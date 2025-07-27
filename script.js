let terminal, fitAddon, webLinksAddon;
let command = "";
let isAnimating = false;
let storedLinks = [];
let currentPostIndex = -1;
let currentType = "";
let entriesData = [];

const config = {
  terminal: {
    fontSize: 16,
    fontFamily: "'VT323', monospace",
    theme: {
      foreground: "#00ff00",
      cursor: "#ffffff",
      cursorAccent: "#000000",
      selection: "#ffffff",
    },
    cursorStyle: "block",
  },
  commands: [
    "about", "experience", "projects", "skills", 
    "contact", "cv", "posts", "gists", "help", "clear"
  ],
  sections: {
    about: [
      "Name: Nuno Goncalves",
      "Roled: DevOps | Software Engineering | Automation | Security",
      "Location: Portugal",
      "GitHub: https://github.com/iamnunog",
      "LinkedIn: https://www.linkedin.com/in/nunoalbertogoncalves",
    ],
    experience: [
      "So far...",
      "• XML Int. - Senior Security Engineer at a Tier 1 Investment Bank (June 2025 - Present)",
      "• Morgan Stanley – Development Platforms – Security & Supply Chain Tech Lead (November 2022 –March 2025)",
      "• Morgan Stanley – Security Engineer (April 2018 – November 2022)",
      "• BBC - Information Security Specialist (July 2017 – April 2018)",
      "• BBC – Security Operations Centre Specialist (April 2014 – July 2017)",
      "• CGI – Information Security Consultant (January 2012 – April 2014)",
    ],
    projects: [
      "Now loading...", 
      "• nunog.me: homepage https://nunog.me"
    ],
    skills: ["Programming Languages:", "• Python, Golang, Bash, PowerShell"],
    contact: [
      "LinkedIn: https://www.linkedin.com/in/nunoalbertogoncalves/",
      "GitHub: https://github.com/iamnunog",
      "Website: https://nunog.me",
    ],
  }
};

function initTerminal() {
  terminal = new Terminal(config.terminal);
  fitAddon = new FitAddon.FitAddon();
  webLinksAddon = new WebLinksAddon.WebLinksAddon();
  
  terminal.loadAddon(fitAddon);
  terminal.loadAddon(webLinksAddon);
  terminal.open(document.getElementById("terminal"));
  fitAddon.fit();
  
  terminal.registerLinkProvider({
    provideLinks: (y, callback) => {
      const links = storedLinks
        .filter(link => link.y === y)
        .map(link => ({
          range: {
            start: { x: link.startX, y },
            end: { x: link.endX, y }
          },
          text: link.text,
          activate: () => {
            link.url.startsWith("#") 
              ? window.location.hash = link.url 
              : window.open(link.url, "_blank");
          }
        }));
      callback(links);
    }
  });
  
  terminal.onKey(({ key, domEvent }) => handleKeyEvent(key, domEvent));
  window.addEventListener("resize", () => fitAddon.fit());
  
  displayWelcome();
  initRouter();
}

function displayWelcome() {
  terminal.writeln("Available commands:");
  config.commands.forEach(cmd => {
    const desc = {
      about: "Personal information",
      experience: "Work experience", 
      projects: "Personal projects",
      skills: "Technical skills (wip)",
      contact: "Contact information",
      cv: "Request CV",
      posts: "Read blog posts",
      gists: "Browse notes and code snippets",
      help: "Show this help message",
      clear: "Clear the terminal"
    }[cmd];
    terminal.writeln(`  ${cmd.padEnd(11)} - ${desc}`);
  });
  terminal.writeln("");
  writePrompt();
}

function writePrompt() {
  terminal.write('\x1b[37mnuno\x1b[0m@\x1b[37mrealm\x1b[0m:\x1b[37m~$ \x1b[0m');
}

function handleKeyEvent(key, domEvent) {
  const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;
  
  if (domEvent.keyCode === 13) { // Enter
    executeCommand();
  } else if (domEvent.keyCode === 8) { // Backspace
    if (command.length > 0) {
      command = command.slice(0, -1);
      terminal.write("\b \b");
    }
  } else if (domEvent.keyCode === 9) { // Tab
    domEvent.preventDefault();
    handleTabCompletion();
  } else if (printable) {
    command += key;
    terminal.write(key);
  }
}

function handleTabCompletion() {
  const matches = config.commands.filter(cmd => cmd.startsWith(command));
  
  if (matches.length === 1) {
    const completion = matches[0].slice(command.length);
    command = matches[0];
    terminal.write(completion);
  } else if (matches.length > 1) {
    terminal.writeln("");
    terminal.writeln(matches.join("  "));
    writePrompt();
    terminal.write(command);
  }
}

function executeCommand() {
  const cmd = command.trim().toLowerCase();
  terminal.writeln("");
  command = "";
  
  if (isAnimating) {
    isAnimating = false;
    terminal.writeln("[Animation interrupted]");
    terminal.writeln("");
    writePrompt();
    return;
  }
  
  switch (cmd) {
    case "about":
    case "experience":
    case "projects":
    case "skills":
    case "contact":
      writeSection(cmd);
      terminal.writeln("");
      writePrompt();
      break;
    case "posts":
    case "gists":
      showList(cmd);
      break;
    case "cv":
      terminal.writeln("Ping me on linkedin.");
      terminal.writeln("https://www.linkedin.com/in/nunoalbertogoncalves")
      terminal.writeln("");
      writePrompt();
      break;
    case "help":
      displayWelcome();
      break;
    case "clear":
      terminal.clear();
      writePrompt();
      break;
    case "":
      writePrompt();
      break;
    default:
      terminal.writeln(`Command not found: ${cmd}`);
      terminal.writeln('Type "help" for available commands.');
      terminal.writeln("");
      writePrompt();
  }
}

function writeSection(name) {
  const section = config.sections[name];
  if (section) {
    section.forEach(line => terminal.writeln(line));
  }
}

function showList(type) {
  currentType = type;
  
  fetch(`${type}.json`)
    .then(res => res.json())
    .then(entries => {
      entriesData = entries;
      storedLinks = [];
      
      const startY = terminal.buffer.active.cursorY + terminal.buffer.active.baseY;
      history.replaceState(null, null, window.location.pathname);
      
      terminal.writeln("Now you use your mouse and click...");
      
      entries.forEach((entry, i) => {
        const line = `${entry.date} / ${entry.title}`;
        terminal.writeln(line);
        
        const currentY = startY + i + 2;
        const titleStart = line.indexOf(entry.title);
        const slug = entry.filename.replace(".md", "");
        
        storedLinks.push({
          y: currentY,
          startX: titleStart,
          endX: titleStart + entry.title.length,
          text: entry.title,
          url: `#/${type}/${slug}`
        });
      });
      
      terminal.writeln("");
      writePrompt();
    })
    .catch(err => {
      console.error(`Failed to load ${type}:`, err);
      terminal.writeln(`Error loading ${type}`);
      terminal.writeln("");
      writePrompt();
    });
}

function showModal(title, contentUrl, isPost = false) {
  const modal = document.getElementById("modal");
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
  
  modal.querySelector(".modal-title").textContent = title;
  
  const navControls = document.querySelector(".modal-nav-controls");
  if (navControls) navControls.style.display = isPost ? "flex" : "none";
  
  if (isPost) updateNavigationState();
  
  fetch(contentUrl)
    .then(res => res.text())
    .then(md => {
      const html = marked.parse(md);
      const modalBody = modal.querySelector(".modal-body");
      modalBody.innerHTML = html;
      
      modalBody.querySelectorAll("pre code").forEach(block => {
        hljs.highlightElement(block);
      });
      
      initModalScroll();
      
      // make sure the scroll get's reset
      modalBody.scrollTo({ top: 0 });
    })
    .catch(err => {
      modal.querySelector(".modal-body").innerHTML = 
        "<h3>Failed to load content</h3><p>Error loading the content.</p>";
      console.error(err);
    });
}

function closeModal() {
  const modal = document.getElementById("modal");

  if (modal.dataset.cleanupResize) {
    const cleanup = new Function(modal.dataset.cleanupResize);
    cleanup();
    delete modal.dataset.cleanupResize;
  }

  modal.classList.remove("show");
  document.body.style.overflow = "auto";
  
  const navControls = document.querySelector(".modal-nav-controls");
  if (navControls) navControls.style.display = "flex";
  
  history.replaceState(null, null, window.location.pathname);
  
  // reset command and ensure single prompt
  command = "";
  
  setTimeout(() => {
    if (terminal && terminal.element && terminal.element.style.display !== 'none') {
      terminal.focus();
    }
  }, 100);
}

function initModalScroll() {
  const modalBody = document.getElementById("modalBody");
  const progressFill = document.getElementById("progressFill");
  
  if (!modalBody || !progressFill) return;
  
  const updateProgress = () => {
    const { scrollTop, scrollHeight, clientHeight } = modalBody;
    const percentage = scrollHeight > clientHeight 
      ? Math.round((scrollTop / (scrollHeight - clientHeight)) * 100)
      : 0;
    progressFill.style.width = percentage + "%";
  };
  
  modalBody.addEventListener("scroll", updateProgress);
  updateProgress();
}

function updateNavigationState() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  
  if (!entriesData || !prevBtn || !nextBtn) return;
  
  if (currentPostIndex === -1) {
    const currentSlug = window.location.hash.split('/').pop();
    currentPostIndex = entriesData.findIndex(
      entry => entry.filename.replace(".md", "") === currentSlug
    );
  }
  
  // reset button states first
  prevBtn.disabled = false;
  nextBtn.disabled = false;
  prevBtn.style.transform = "";
  nextBtn.style.transform = "";
  prevBtn.style.boxShadow = "";
  nextBtn.style.boxShadow = "";
  
  // apply proper disabled state
  prevBtn.disabled = currentPostIndex <= 0;
  nextBtn.disabled = currentPostIndex >= entriesData.length - 1;
  
  prevBtn.title = currentPostIndex > 0 
    ? `Previous: ${entriesData[currentPostIndex - 1].title}`
    : "No previous post";
    
  nextBtn.title = currentPostIndex < entriesData.length - 1
    ? `Next: ${entriesData[currentPostIndex + 1].title}` 
    : "No next post";
}

function navigatePrev() {
  if (currentPostIndex > 0) {
    currentPostIndex--;
    loadPostByIndex(currentPostIndex);
  }
}

function navigateNext() {
  if (currentPostIndex < entriesData.length - 1) {
    currentPostIndex++;
    loadPostByIndex(currentPostIndex);
  }
}

function loadPostByIndex(index) {
  const post = entriesData[index];
  if (post) {
    const slug = post.filename.replace(".md", "");
    history.replaceState(null, null, `#/${currentType}/${slug}`);
    showModal(post.title, `${currentType}/${post.filename}`, true);
  }
}

async function copyPermalink() {
  const copyBtn = document.getElementById("copyUrlBtn");
  const permalink = window.location.href;
  
  try {
    await navigator.clipboard.writeText(permalink);
    
    const originalContent = copyBtn.innerHTML;
    copyBtn.classList.add("copied");
    copyBtn.innerHTML = "✓";
    copyBtn.title = "Copied!";
    
    setTimeout(() => {
      copyBtn.classList.remove("copied");
      copyBtn.innerHTML = originalContent;
      copyBtn.title = "Copy Permalink";
    }, 1500);
  } catch (err) {
    console.error("Failed to copy:", err);
    copyBtn.style.backgroundColor = "#ff0000";
    copyBtn.innerHTML = "✗";
    setTimeout(() => {
      copyBtn.style.backgroundColor = "";
      copyBtn.innerHTML = copyBtn.innerHTML;
    }, 1500);
  }
}

function initRouter() {
  handleRoute();
  window.addEventListener("hashchange", handleRoute);
}

function handleRoute() {
  const hash = window.location.hash;
  const [, section, ...params] = hash.split("/").filter(Boolean);
  
  if (!section) {
    closeModal();
    return;
  }
  
  switch (section) {
    case "posts":
    case "gists":
      if (params.length > 0) {
        loadBySlug(section, params.join("/"));
      } else {
        showList(section);
      }
      break;
    default:
      if (terminal) {
        terminal.writeln(`Unknown route: ${section}`);
        writePrompt();
      }
  }
}

function loadBySlug(type, slug) {
  currentType = type;
  
  fetch(`${type}.json`)
    .then(res => res.json())
    .then(posts => {
      entriesData = posts;
      const post = posts.find(p => p.filename.replace(".md", "") === slug);
      
      if (post) {
        currentPostIndex = posts.findIndex(p => p.filename.replace(".md", "") === slug);
        showModal(post.title, `${type}/${post.filename}`, true);
      } else {
        if (terminal) {
          terminal.writeln(`Not found: ${slug}`);
          writePrompt();
        }
        window.location.hash = "";
      }
    })
    .catch(err => {
      console.error("Failed to load posts:", err);
      if (terminal) {
        terminal.writeln("Error loading post.");
        writePrompt();
      }
    });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
  
  if (document.getElementById("modal").classList.contains("show")) {
    modelBody = document.getElementById("modalBody")

    if (e.key === "ArrowLeft" && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      navigatePrev();
    } else if (e.key === "ArrowRight" && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      navigateNext();
    }
  }
});

window.addEventListener("resize", () => {
  clearTimeout(window.fitTimeout);
  window.fitTimeout = setTimeout(() => {
    fitAddon.fit();
    terminal.scrollToBottom(); 
  }, 100);
});

document.getElementById("modal").addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay")) {
    closeModal();
  }
});

function initGlitch() {
  const container = document.getElementById("asciiArt");
  if (!container) return;
  
  const text = container.textContent;
  const isMobile = () => window.innerWidth <= 768;
  
  const effects = [
    { class: "px", chance: 0.05 },
    { class: "cs", chance: 0.05 },
    { class: "ds", chance: 0.05 },
  ];
  
  const lineEffects = [
    { class: "sl", chance: 0.15 },
    { class: "sr", chance: 0.15 },
  ];
  
  function applyGlitch() {
    const lines = text.split("\n");
    const effectMultiplier = isMobile() ? 0.4 : 1;
    
    const html = lines.map(line => {
      if (!line.trim()) return "";
      
      let lineWrapper = "";
      const lineRoll = Math.random();
      const lineEffect = lineEffects.find(e => lineRoll < e.chance);
      
      if (lineEffect) {
        lineWrapper = `<span class="${lineEffect.class}" style="animation-delay:${Math.random() * 4}s">`;
      }
      
      const chars = line.split("").map(char => {
        if (char === " ") return " ";
        
        const roll = Math.random();
        let totalChance = 0;
        
        for (const effect of effects) {
          totalChance += effect.chance * effectMultiplier;
          if (roll < totalChance) {
            return `<span class="${effect.class}" style="animation-delay:${Math.random() * 6}s">${char}</span>`;
          }
        }
        
        return char;
      }).join("");
      
      return lineWrapper + chars + (lineWrapper ? "</span>" : "");
    }).join("<br>");
    
    container.innerHTML = html;
  }
  
  applyGlitch();
  setInterval(applyGlitch, isMobile() ? 30000 : 20000);
  
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(applyGlitch, 250);
  });
  
  window.addEventListener("orientationchange", () => {
    setTimeout(applyGlitch, 100);
  });
  
  let touchTimer;
  container.addEventListener("touchstart", (e) => {
    e.preventDefault();
    container.style.transform = "scale(0.98)";
    container.style.filter = "brightness(1.2)";
    
    clearTimeout(touchTimer);
    touchTimer = setTimeout(() => {
      container.style.transform = "";
      container.style.filter = "";
    }, 200);
  });
}

window.onload = () => {
  initTerminal();
  setTimeout(initGlitch, 100);
};
