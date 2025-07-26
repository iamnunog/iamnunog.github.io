<!-- # Understanding Goroutines and Go's Scheduler -->

# WIP

Go's concurrency model is known for it's **goroutines**—lightweight concurrent units that are neither OS threads nor traditional green threads. Instead, they represent a unique approach to concurrent programming that combines aspects of coroutines with sophisticated runtime scheduling.

## What Are Goroutines Really?

**Goroutines are a specialized form of coroutine** with deep integration into the Go runtime. Unlike traditional coroutines that require explicit suspension points (`await`, `yield`, etc.), Go abstracts this complexity away:

- The **Go runtime automatically suspends and resumes goroutines** based on blocking operations (channel I/O, system calls, network operations)
- Goroutines are **cooperatively scheduled** with **runtime-managed preemption** for long-running tasks
- They start with a **tiny 2KB stack** that grows dynamically as needed

This design makes goroutines a unique hybrid: they retain coroutine-like semantics while behaving as **runtime-scheduled tasks** with automatic suspension and resumption.

## The G-M-P Model: Go's Scheduler Architecture

Go's scheduler implements a sophisticated **G-M-P model** designed for efficient concurrent execution:

| Component | Description | Role |
|-----------|-------------|------|
| **G (Goroutine)** | The actual lightweight task | Contains function code, stack, and execution state |
| **M (Machine)** | OS thread wrapper | Executes goroutines on actual hardware threads |
| **P (Processor)** | Logical processor | Schedules goroutines and manages local run queues |

### Key Properties

Each **P (Processor)** maintains:
- A **local run queue** of ready-to-run goroutines
- An **associated OS thread (M)** for execution
- **Work-stealing logic** for load balancing
- **System call handling** mechanisms

The number of P's equals `GOMAXPROCS` (defaults to CPU core count), controlling **parallelism** but not **concurrency**.

## Scheduler Architecture Visualization

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

Understanding this difference is crucial for Go developers:

- **Concurrency**: The ability to deal with multiple tasks at once (structure)
- **Parallelism**: The ability to execute multiple tasks simultaneously (execution)

**Example**: You might have 10,000 goroutines running *concurrently*, but only 4 executing *in parallel* if `GOMAXPROCS=4`.

## Practical Demonstration: Observing Scheduler Behavior

Here's an enhanced example that demonstrates parallelism control:

```go
package main

import (
    "fmt"
    "runtime"
    "sync"
    "time"
)

func main() {
    // Experiment with different values: 1, 2, 4, 8
    runtime.GOMAXPROCS(2)
    
    fmt.Printf("GOMAXPROCS: %d\n", runtime.GOMAXPROCS(0))
    fmt.Printf("NumCPU: %d\n", runtime.NumCPU())
    fmt.Printf("NumGoroutine before: %d\n", runtime.NumGoroutine())
    
    var wg sync.WaitGroup
    start := time.Now()
    
    // Create CPU-intensive goroutines
    for i := 0; i < 8; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            
            // Simulate CPU-intensive work
            sum := 0
            for j := 0; j < 1000000; j++ {
                sum += j
            }
            
            fmt.Printf("Goroutine %d finished (sum: %d) on thread %d\n", 
                      id, sum, runtime.NumGoroutine())
        }(i)
    }
    
    wg.Wait()
    fmt.Printf("Total execution time: %v\n", time.Since(start))
    fmt.Printf("NumGoroutine after: %d\n", runtime.NumGoroutine())
}
```

**Key Observations:**
- With `GOMAXPROCS=1`: Sequential execution despite 8 goroutines
- With `GOMAXPROCS=4`: True parallel execution on 4 logical processors
- Execution time decreases with higher `GOMAXPROCS` (up to CPU core count)

## How Goroutine Scheduling Works

### 1. **Goroutine Creation**
```go
go myFunction() // Creates new goroutine (G)
```

### 2. **Scheduling Process**
1. New goroutine is placed in the **local run queue** of the current P
2. If local queue is full, half the goroutines move to the **global run queue**
3. The scheduler assigns the goroutine to an OS thread (M) bound to that P
4. When goroutines block, the scheduler suspends them and picks another runnable one

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
// Usually unnecessary - Go sets this optimally
runtime.GOMAXPROCS(runtime.NumCPU())
```

### 2. **Use Buffered Channels for Producer-Consumer**
```go
ch := make(chan int, 100) // Reduces goroutine blocking
```

### 3. **Monitor Goroutine Leaks**
```go
fmt.Printf("Active goroutines: %d\n", runtime.NumGoroutine())
```

### 4. **Prefer Goroutines Over Thread Pools**
```go
// Good: Simple and efficient
for task := range tasks {
    go processTask(task)
}

// Avoid: Manual thread pool management
```

## Common Misconceptions

### More goroutines = better performance
*Reality*: Parallelism is limited by GOMAXPROCS, not goroutine count

### Goroutines are free
*Reality*: They have memory overhead and scheduling costs

### Blocking operations stop everything
*Reality*: Go's scheduler handles blocking efficiently

## Key Takeaways

- **Goroutines are specialized coroutines** with automatic scheduling and preemption
- **The G-M-P model** provides efficient multiplexing of goroutines onto OS threads
- **Logical processors (P)** control parallelism, not concurrency limits
- **Work-stealing** and **efficient system call handling** ensure optimal performance
- **GOMAXPROCS** determines parallel execution capacity, not concurrent capacity

The Go scheduler's elegance lies in its simplicity from the programmer's perspective while maintaining sophisticated optimization underneath. This design enables Go to handle massive concurrency with minimal cognitive overhead, making it ideal for modern distributed systems and high-performance applications.
