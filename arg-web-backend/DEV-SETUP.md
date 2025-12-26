# 🚀 ARG Backend Development Setup

## 🌟 **World-Class VS Code Dev Container (Recommended)**

**The ultimate one-click development experience!**

### **🎯 Getting Started with Dev Container**
```bash
# Prerequisites: VS Code + Dev Containers extension + Docker
1. Open project in VS Code
2. Click "Reopen in Container" 
3. That's it! 🎉
```

**What you get:**
- ✅ **One-click setup** - Zero configuration needed
- ✅ **Pre-configured extensions** - ESLint, Prettier, Copilot, etc.
- ✅ **Integrated debugging** - Press F5 to debug with breakpoints
- ✅ **Code snippets** - Type `nest-controller` + Tab for instant code
- ✅ **Hot-reloading** - Instant feedback on changes
- ✅ **Cross-platform** - Works identically everywhere

### **🛠️ Pre-configured Development Environment**
- **Node.js 22** with npm
- **NestJS CLI** globally installed
- **IBM i ODBC drivers** ready to use
- **Zsh shell** with completion
- **Git** configured

### **🎨 VS Code Extensions (Auto-installed)**
- **Prettier** - Code formatting
- **ESLint** - Code linting
- **TypeScript** - Enhanced TS support
- **Jest** - Test runner integration
- **Thunder Client** - API testing
- **GitHub Copilot** - AI assistance
- **Docker** - Container management
- **NestJS Snippets** - Quick code generation

### **📝 Code Snippets (Type prefix + Tab)**
```
nest-controller     # Complete NestJS controller with CRUD
nest-service        # NestJS service with CRUD operations
nest-dto           # DTO with validation decorators
nest-module        # NestJS module
nest-test          # Jest test file with setup
nest-usecase       # Use case with input/output interfaces
sequelize-model    # Sequelize model with TypeScript
```

### **🐛 Debugging (F5)**
- **Debug NestJS App** - Full debugging with breakpoints
- **Debug NestJS App (Development)** - Debug with watch mode
- **Debug Tests** - Debug Jest tests
- **Debug Current Test File** - Debug the current test file

---

## 🌍 **Alternative Options** (Cross-Platform)

### **🎯 Option 2: npm Scripts (Traditional)**
```bash
npm run dev          # Start development environment
# Inside container: npm run start:dev
```

### **🎯 Option 3: Intelligent Auto-Start**
```bash
./auto-dev.sh        # Mac/Ubuntu
auto-dev.sh          # Windows (Git Bash/WSL)
```

### **🎯 Option 4: Traditional Scripts**
```bash
./dev-start.sh       # Mac/Ubuntu  
dev-start.sh         # Windows (Git Bash/WSL)
```

---

## 🏗️ **First Time Setup**

### **🌟 VS Code Dev Container (Recommended)**
1. **Install VS Code** + **Dev Containers extension**
2. **Install Docker Desktop**
3. **Clone repo**
   ```bash
   git clone <repo-url>
   cd arg-web-backend
   cp sample.env .env
   # Edit .env with your database credentials
   ```
4. **Open in VS Code** and click "Reopen in Container"
5. **Press F5** to start debugging with hot-reload

### **🛠️ Traditional Setup (Any OS)**
1. **Prerequisites**: Docker Desktop + Node.js 18+ + Git
2. **Clone and setup**
   ```bash
   git clone <repo-url>
   cd arg-web-backend
   cp sample.env .env
   # Edit .env with your database credentials
   ```
3. **Start development**
   ```bash
   npm run dev          # ⭐ Works everywhere
   ./auto-dev.sh        # Smart detection
   ./dev-start.sh       # Traditional
   ```
4. **Inside container**
   ```bash
   npm run start:dev    # Hot-reloading
   npm run start        # Regular start
   ```

---

## 🎮 **Available Commands**

### **🚀 From VS Code Command Palette (`Cmd+Shift+P`)**
```
Tasks: Run Task
├── Start Development Server    # npm run start:dev
├── Build Application          # npm run build
├── Run Tests                  # npm run test
├── Run Tests (Watch)          # npm run test:watch
├── Lint Code                  # npm run lint
├── Fix Lint Issues           # npm run lint:fix
├── Format Code               # npm run format
├── Generate Swagger          # npm run generate:swagger
├── Docker: Rebuild Container # npm run dev:rebuild
├── Docker: View Logs         # npm run dev:logs
└── Docker: Check Status      # npm run dev:status
```

### **npm Scripts (Cross-Platform)**
```bash
npm run dev           # Start development environment
npm run dev:stop      # Stop development environment
npm run dev:logs      # View application logs
npm run dev:shell     # Enter development container
npm run dev:rebuild   # Rebuild everything from scratch
npm run dev:status    # Check container status
npm run dev:clean     # Clean up everything
```

---

## 🎯 **Daily Development Workflows**

### **🌟 VS Code Dev Container Workflow**
```bash
1. Open VS Code in project folder
2. Click "Reopen in Container" (if not already)
3. Press F5 to start debugging
4. Start coding with hot-reload! 🚀
```

### **🏃‍♂️ Quick Start Development**
1. **Open in Dev Container** (VS Code handles everything)
2. **Press `F5`** → Select "Debug NestJS App (Development)"
3. **Start coding!** Hot-reload is automatic

### **🧪 Test-Driven Development**
1. **Press `Cmd+Shift+P`** → "Tasks: Run Task" → "Run Tests (Watch)"
2. **Write tests** with `nest-test` snippet
3. **Watch tests run automatically** as you code

### **🐛 Debugging Workflow**
1. **Set breakpoints** in your code
2. **Press `F5`** → Select debug configuration
3. **Step through code** with full variable inspection

### **📚 API Development**
1. **Use `nest-controller` snippet** for new endpoints
2. **Generate Swagger docs**: `Cmd+Shift+P` → "Generate Swagger"
3. **Test APIs** with Thunder Client extension

### **🛠️ Traditional Workflow**
```bash
npm run dev          # Any OS
npm run start:dev    # Inside container
```

---

## 🔧 **What Happens Automatically**

✅ **Docker container builds** (first time only)  
✅ **Dependencies install** (automatically in Linux container)  
✅ **Database drivers setup** (IBM ODBC for Linux)  
✅ **Environment configured** (from .env)  
✅ **Hot-reloading enabled** (edit files locally)  
✅ **Cross-platform compatibility** (Mac, Windows, Ubuntu)  

### **🌟 Additional Dev Container Benefits**
✅ **Extensions auto-install** (ESLint, Prettier, Copilot, etc.)  
✅ **Settings synchronized** (formatting, linting, debugging)  
✅ **Code snippets ready** (nest-controller, nest-service, etc.)  
✅ **Integrated debugging** (breakpoints, variable inspection)  
✅ **AI assistance** (GitHub Copilot for code suggestions)  

---

## 🔥 **Pro Tips**

### **⚡ Keyboard Shortcuts**
```
F5                    # Start debugging
Cmd+Shift+P          # Command palette
Ctrl+`               # Open terminal
Cmd+Shift+E          # Explorer
Cmd+Shift+F          # Search across files
Cmd+P                # Quick file open
Ctrl+Shift+`         # New terminal
```

### **🛠️ Quick Actions**
- **Auto-import**: Type class name, VS Code imports automatically
- **Quick fix**: `Cmd+.` on errors for suggestions
- **Refactor**: `F2` to rename symbols everywhere
- **Go to definition**: `F12` or `Cmd+Click`

### **🧪 Testing**
- **Run single test**: Click the play button next to test
- **Run test file**: Right-click test file → "Run Tests"
- **Debug test**: Set breakpoint, right-click → "Debug Test"

---

## 🌍 **OS-Specific Notes**

### **🍎 macOS**
```bash
# VS Code Dev Container - Perfect experience
# npm scripts - Work perfectly
# Shell scripts - Work perfectly
```

### **🪟 Windows**
```bash
# VS Code Dev Container - Perfect experience
# npm scripts - Work in PowerShell/CMD/Git Bash
# Shell scripts - Use Git Bash or WSL
```

### **🐧 Ubuntu/Linux**
```bash
# VS Code Dev Container - Perfect experience
# npm scripts - Work perfectly
# Shell scripts - Work perfectly
```

---

## 🚀 **Performance Features**

### **⚡ Fast Builds**
- **Cached Docker layers** - rebuilds only what changed
- **Optimized volume mounts** - fast file sync
- **Excluded directories** - node_modules not watched

### **🔄 Hot Reloading**
- **Instant feedback** - see changes in ~2 seconds
- **Smart restart** - only restarts when needed
- **TypeScript compilation** - automatic on save

### **🛡️ Automatic Quality Checks**
- **ESLint** runs on save with auto-fix
- **Prettier** formats code on save
- **TypeScript** checks types in real-time

---

## 🎨 **For Different Developer Types**

### **🌟 "Ultimate Experience" Developer**
```bash
# Use VS Code Dev Container
1. Open in VS Code → "Reopen in Container"
2. Press F5 to debug
3. Use code snippets (nest-controller + Tab)
4. Get AI suggestions from Copilot
```

### **🏃‍♂️ "Just Works" Developer (Any OS)**
```bash
npm run dev
npm run start:dev
```

### **🔧 "Power User" Developer**
```bash
npm run dev:status   # Check what's running
npm run dev:logs     # Debug issues  
npm run dev:shell    # Enter container
npm run dev:clean    # Nuclear option
```

---

## 🆘 **Troubleshooting**

### **VS Code Dev Container Issues**
```bash
# Rebuild container
Cmd+Shift+P → "Dev Containers: Rebuild Container"

# Reset everything
Cmd+Shift+P → "Dev Containers: Rebuild Without Cache"

# View logs
Docker Desktop → Containers → arg-backend → Logs
```

### **Traditional Setup Issues (Any OS)**
```bash
npm run dev:clean    # Nuclear option - clean everything
npm run dev:rebuild  # Rebuild from scratch
npm run dev:status   # Check what's running
npm run dev:logs     # Debug issues
```

### **Performance Issues**
```bash
# Check container resources
docker stats arg-backend

# Clean up Docker
docker system prune -f

# Restart Docker Desktop
```

---

## 📱 **Application Access**

- **API**: http://localhost:5001
- **Health Check**: http://localhost:5001/health-check
- **Swagger**: http://localhost:5001/api (if configured)

---

## 🎯 **Why This Setup Is World-Class**

### **🌍 Cross-Platform Foundation**
✅ **Docker handles everything** - IBM ODBC, Node.js, dependencies  
✅ **npm scripts work everywhere** - Node.js is cross-platform  
✅ **No OS-specific tools** - No make, no OS-specific dependencies  
✅ **Volume mounting works** - Docker handles file system differences  

### **🌟 World-Class with Dev Containers**
✅ **Zero configuration** - Works out of the box  
✅ **Professional tooling** - Best-in-class extensions  
✅ **Integrated debugging** - Full IDE experience  
✅ **AI-powered development** - GitHub Copilot integration  
✅ **Team consistency** - Same environment for everyone  
✅ **Optimized performance** - Fast builds, instant feedback  
✅ **Productivity boosters** - Snippets, auto-formatting, AI assistance  

This setup eliminates environment inconsistencies and provides a world-class development experience that works identically across all platforms! 🚀 