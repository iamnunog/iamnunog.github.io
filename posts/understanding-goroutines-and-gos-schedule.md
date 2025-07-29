Recently, I am spending sometime reading [**Concurrency in Go**](https://www.oreilly.com/library/view/concurrency-in-go/9781491941294/), so far awesome book. After wrapping up the 2nd chapter, I found myself not actually knowing exactly how the Go runtime really manages goroutines under the hood. This blog post is a summary of the research and notes I compiled to better understand how goroutines work, how they're scheduled, and what makes them so efficient. 

Go's concurrency model is cantered around **goroutines** units of concurrent execution that are neither traditional OS threads neither classic threads. Goroutines combine characteristics from coroutines with a runtime-managed scheduling system that does not require explicit yield or await (e.g. python) unlike traditional coroutines implementations. 

And this characteristic was when I started to get **confused**. 

Contrary to other programming languages, again Python, we explicitly `yield` or `await` to give control back to the event loop or scheduler. That’s how we let other tasks make progress. So naturally, I asked myself: 

> Do you mean this is a coroutine-like system and I don’t need to define when execution should yield?

That's when I started…

## What Are Goroutines Really?

**Goroutines are a "specialised" form of coroutine**, unlike traditional coroutines that require explicit suspension points (`await`, `yield`, etc.), Go abstracts this complexity away:

- The **Go runtime automatically suspends and resumes goroutines** based on blocking operations (channel I/O, system calls, network operations, etc.).
- Goroutines are **cooperatively scheduled** with **runtime-managed preemption** for long-running tasks:  
  _"You've had your turn long enough, let others run now."_
  > **Note:** Preemption means forcibly interrupting or stopping something that's currently running.
- Goroutines start with a **tiny 2KB stack** that grows dynamically as needed.

Goroutines combine the "best" of both worlds: they work like coroutines (cooperative multitasking) but are automatically managed by Go's scheduler, which handles pausing and resuming them as needed.


## The G-M-P Model: Go's Scheduler Architecture

So, how the scheduler works, Go's scheduler implements a **G-M-P model** designed for efficient concurrent executions:

| Component | Description | Role |
|-----------|-------------|------|
| **G (Goroutine)** | The actual lightweight task | Contains function code, stack, and execution state |
| **M (Machine)** | OS thread wrapper | Executes goroutines on actual hardware threads |
| **P (Processor)** | Logical processor | Schedules goroutines and manages local run queues |
> **Note:** P isn't a physical CPU core - it's a logical processor that provides the context needed to execute goroutines. Think of it as a **"scheduling context"** that manages resources and maintains state.


### Key Properties

Each **P (Processor)** maintains:
- A **local run queue** of ready-to-run goroutines
- An **associated OS thread (M)** for execution
- **Work-stealing logic** for load balancing
- **System call handling** mechanisms

The number of P's equals `GOMAXPROCS` (env var, or `runtime.GOMAXPROCS(N/0)`) (defaults to logical CPU count), controlling **parallelism** (how many goroutines can be executed simultaneously) but not **concurrency** (you can still create millions of goroutines that exist and are managed by the scheduler, as long as you have memory in your system).

## Scheduler Architecture Visualization

<a id="diagram"></a>

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   P1        │    │   P2        │    │   P3        │
│ ┌─────────┐ │    │ ┌─────────┐ │    │ ┌─────────┐ │
│ │ G1  G2  │ │    │ │ G5  G6  │ │    │ │ G9  G10 │ │
│ │ G3  G4  │ │    │ │ G7  G8  │ │    │ │ G11 G12 │ │
│ └─────────┘ │    │ └─────────┘ │    │ └─────────┘ │
│     │       │    │     │       │    │     │       │
│     ▼       │    │     ▼       │    │     ▼       │
│    M1       │    │    M2       │    │    M3       │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ OS Thread 1 │    │ OS Thread 2 │    │ OS Thread 3 │
└─────────────┘    └─────────────┘    └─────────────┘

Global Run Queue: [G13, G14, G15, ...]
```

**Legend:**
- **G**: Goroutine (lightweight task)
- **P**: Processor (scheduler with local queue)
- **M**: Machine (OS thread wrapper)

## Concurrency vs Parallelism: The Critical Distinction

Understanding this difference is crucial, remember, 

- **Concurrency**: The ability to deal with multiple tasks at once (structure)
- **Parallelism**: The ability to execute multiple tasks simultaneously (execution)

To quote, [**Concurrency in Go**](https://www.oreilly.com/library/view/concurrency-in-go/9781491941294/), 
> Concurrency is a property of the code; parallelism is a property of the running program.

**Example**: You might have 10,000 goroutines running *concurrently*, but only 4 executing *in parallel* if `GOMAXPROCS=4`.

Example that demonstrates parallelism control in golang:

```go
package main

import (
    "fmt"
    "runtime"
    "sync"
    "time"
)

func main() {
    // experiment with different values: 1, 2, 4, 8
    runtime.GOMAXPROCS(1)
    
    fmt.Printf("GOMAXPROCS: %d\n", runtime.GOMAXPROCS(0))
    fmt.Printf("NumCPU: %d\n", runtime.NumCPU())
    fmt.Printf("NumGoroutine before: %d\n", runtime.NumGoroutine())
    
    var wg sync.WaitGroup
    start := time.Now()
    
    // create somthing CPU-intensive with goroutines
    for i := range 20 {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            
            // intense work :)
            sum := 0
            for j := 0; j < 1_000_000_000; j++ {
                sum += j
            }
            
            fmt.Printf("Goroutine %d finished (sum: %d)\n", id, sum)
        }(i)
    }
    
    wg.Wait()
    fmt.Printf("Total execution time: %v\n", time.Since(start))
    fmt.Printf("NumGoroutine after: %d\n", runtime.NumGoroutine())
}
```

**Key Observations:**
- With `GOMAXPROCS=1`: Sequential execution despite 20 goroutines
- With `GOMAXPROCS=4`: True parallel execution on 4 logical processors
- Execution time decreases with higher `GOMAXPROCS` (up to CPU core count)

Again, goroutines give you concurrency, but `GOMAXPROCS` determines how much of that concurrency becomes true parallelism.

> __***"Concurrency is a property of the code; parallelism is a property of the running program."***__

## How Goroutine Scheduling Works

So, how does the the go scheduler really works, suppose we have (remember the above),

### 1. **Goroutine Creation**
```go
go myFunction() // creates new goroutine (G)
```

### 2. **Scheduling Process**
1. New goroutine is placed in the **local run queue** of the current `P`
2. If local queue is full, half the goroutines move to the **global run queue**
3. The scheduler assigns the goroutine to an OS thread (`M`) bound to that `P`
4. When goroutines block (goroutine cannot continue execution because it is waiting on some resource or operation to complete), the scheduler suspends them and picks another runnable one


When does the goroutines block?, e.g.

```go
// voluntary block examples,
// waiting for data
conn.Read(buf) 

// blocks if another goroutine holds the lock
mu.Lock() 

// blocks for 1 second
time.Sleep(time.Second) 

// blocks until a value is sent into the channel
ch := make(chan int)
<-ch 
```

### 3. **Work Stealing**
When a P's local queue is empty:
1. Check the **global run queue**
2. **Steal work** from other P's local queues
3. This ensures optimal load balancing across all processors

## Advanced Scheduler Features

### Preemption
Go 1.14+ introduced **asynchronous preemption**:
- Long-running goroutines can be forcibly suspended
- Prevents goroutine starvation in tight loops
- Uses signal-based mechanisms on Unix systems

### System Call Handling
When a goroutine makes a system call:
1. The M (OS thread) blocks
2. The P detaches from the blocked M
3. A new M is created or reused for the P
4. Other goroutines continue execution uninterrupted

```go
go func() {
    fmt.Println("Goroutine doing blocking syscall (waiting for stdin)...")
    buf := make([]byte, 1)
    os.Stdin.Read(buf) // Blocks here until user input
    fmt.Println("Read complete.")
}()

// Meanwhile, another goroutine still runs
go func() {
    for i := 0; i < 5; i++ {
        fmt.Println("Tick", i)
        time.Sleep(time.Second)
    }
}()
```

## Performance Implications

### Memory Efficiency
- **Goroutines**: ~2KB initial stack
- **OS Threads**: ~2MB default stack
- **Result**: Can create millions of goroutines vs thousands of threads

### Context Switching
- **Goroutines**: Managed in user space, extremely fast
- **OS Threads**: Kernel-level switching, higher overhead
- **Result**: Goroutine switching is 10-100x faster

## Best Practices

### 1. **Don't Adjust GOMAXPROCS Unless Necessary**
```go
// go by the defaults
runtime.GOMAXPROCS(runtime.NumCPU())
```

### 2. **Use Buffered Channels for Producer-Consumer**
```go
ch := make(chan int, 100) // reduces goroutine blocking
```

### 3. **Monitor Goroutine Leaks**
```go
// it happens :)
fmt.Printf("Active goroutines: %d\n", runtime.NumGoroutine())
```

### 4. **Prefer Goroutines Over Thread Pools**
```go
// Good: Simple and efficient
for task := range tasks {
    go processTask(task)
}

// Avoid: Manual thread pool management unless...
```

## Key Takeaways

- **Goroutines are specialisqed coroutines** with automatic scheduling and preemption
- **The G-M-P model** provides efficient multiplexing of goroutines onto OS threads
- **Logical processors (P)** control parallelism, not concurrency limits
- **Work-stealing** and **efficient system call handling** ensure optimal performance
- **GOMAXPROCS** determines parallel execution capacity, not concurrent capacity


## Conclusion

What really stands out to me after digging into all this is how Go gives us simplicity on the surface, while hiding a very sophisticated runtime underneath. You write code using go func() and it just works—no explicit yield, no manual context switching, and no messy callback hell. But behind the scenes, the Go scheduler is doing a the heavy lifting: managing the goroutines, dynamically, stack sizes, balancing workloads across processors, and preempting long-running tasks.

Understanding the G-M-P model gave me a new level of appreciation for how Go handles concurrency. It's not just about spinning up lightweight `tasks`; it's about doing so in a way that scales and performs without the low-level thread management.

Go’s concurrency model feels simple and easy to use. The balance between a ergonomic API and runtime optimisation makes go quite special, really enjoying it.
