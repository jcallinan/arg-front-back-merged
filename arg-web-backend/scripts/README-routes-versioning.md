# Routes & Permissions Management - Versioning System

## 🎯 Quick Start

The routes versioning system automatically creates versioned files and manages rollbacks using content copying. Your application always imports `routes-map.ts` and gets the latest data automatically.

## 📋 Prerequisites

- Node.js and npm installed
- TypeScript project setup
- Swagger files with route definitions

## 🚀 Basic Usage

### 1. Generate Routes Map
```bash
npm run generate:routes-map
```
**What happens:**
- Creates `routes-map.v1.ts`, `routes-map.v2.ts`, etc. (versioned files)
- `routes-map.ts` automatically updated with latest content
- Your application gets the newest data automatically

### 2. List Available Versions
```bash
npm run generate:routes-map list-versions
```
**Output:**
```
📚 Available versions:
   routes-map.v1.ts (2025-09-24T04:34:24.544Z)
   routes-map.v2.ts (2025-09-24T04:34:53.187Z)
   routes-map.v3.ts (2025-09-24T04:35:11.593Z)
```

### 3. Rollback to Previous Version
```bash
npm run generate:routes-map rollback 2
```
**What happens:**
- `routes-map.ts` now contains content from `routes-map.v2.ts`
- Your application gets version 2 data
- All other versions remain unchanged

## 📁 File Structure

```
src/api-schema/routes-mapper/
├── routes-map.ts          # Current version content (copied from latest)
├── routes-map.v1.ts       # Version 1 (historical)
├── routes-map.v2.ts       # Version 2 (historical)
├── routes-map.v3.ts       # Version 3 (historical)
└── ...                    # Additional versions
```

## 🔧 How It Works

### Automatic Versioning
- **First run**: Creates `routes-map.v1.ts` + copies content to `routes-map.ts`
- **Second run**: Creates `routes-map.v2.ts` + copies content to `routes-map.ts`
- **Third run**: Creates `routes-map.v3.ts` + copies content to `routes-map.ts`
- **And so on...**

### Content Copying Magic
- `routes-map.ts` contains the actual content from the current active version
- Your application always imports `routes-map.ts` (never the versioned files directly)
- Rollback = copy content from specific version to `routes-map.ts`
- Generate = create new version + copy content to `routes-map.ts`

## 💻 In Your Application Code

### ✅ Always Do This
```typescript
// In your application
import { RightsMap } from './routes-mapper/routes-map';
// ✅ This always gets the current active version
```

### ❌ Never Do This
```typescript
// DON'T import versioned files directly
import { RightsMap } from './routes-mapper/routes-map.v3';
// ❌ This locks you to a specific version
```

## 🎮 Common Workflows

### Workflow 1: Normal Development
```bash
# 1. Make changes to your swagger files
# 2. Generate new routes
npm run generate:routes-map

# 3. Your app automatically gets the latest routes
# 4. Test your application
```

### Workflow 2: Rollback After Issues
```bash
# 1. Something breaks with the latest version
# 2. Check available versions
npm run generate:routes-map list-versions

# 3. Rollback to a working version
npm run generate:routes-map rollback 2

# 4. Your app now uses version 2 (the working one)
# 5. Fix the issues and generate again
npm run generate:routes-map
```

### Workflow 3: Compare Versions
```bash
# 1. Check what version you're currently using
ls -la src/api-schema/routes-mapper/routes-map.ts
# Output: routes-map.ts (regular file with content)

# 2. Rollback to compare
npm run generate:routes-map rollback 1

# 3. Test your app with version 1
# 4. Switch back to latest
npm run generate:routes-map rollback 3
```

## ⚙️ Configuration

Edit `scripts/generate-routes-map.ts` to customize:

```typescript
const CONFIG = {
  // Enforce access rights validation (default: true)
  ENFORCE_ACCESS_RIGHTS: true,
  
  // Enforce unique operation IDs (default: true)
  ENFORCE_UNIQUE_OPERATION_IDS: true,
  
  // Show detailed validation reports (default: true)
  SHOW_VALIDATION_REPORT: true,
  
  // Enable file versioning (default: true)
  ENABLE_FILE_VERSIONING: true,
  
  // Maximum versions to keep (default: 10)
  MAX_VERSIONS_TO_KEEP: 10,
};
```

## 🔍 Troubleshooting

### Problem: "Routes missing access rights"
**Solution:** Add `metaData.accessRights` to your swagger route definitions:
```typescript
export const myRoute = {
  path: '/api/users',
  method: 'GET',
  operation: {
    operationId: 'getUsers',
    summary: 'Get users',
    metaData: {
      accessRights: ['user:read'] // ← Add this
    }
  }
};
```

### Problem: "Duplicate operationIds found"
**Solution:** Make sure all `operationId` values are unique across all swagger files.

### Problem: "Version not found"
**Solution:** 
```bash
# Check available versions
npm run generate:routes-map list-versions

# Use an existing version number
npm run generate:routes-map rollback 1
```

### Problem: File content issues
**Solution:** The script handles content copying automatically. If you have issues:
```bash
# Remove the file manually
rm src/api-schema/routes-mapper/routes-map.ts

# Generate again
npm run generate:routes-map
```

## 📊 Validation Reports

The script shows detailed validation reports:

```
📊 Access Rights Validation Report:
✅ Routes WITH access rights: 3
⚠️  Routes MISSING access rights: 77

🔍 OperationId (method) Uniqueness Report:
✅ Unique operationIds (method): 80
❌ Duplicate operationIds (method): 0
```

## 🎯 Best Practices

1. **Always use `routes-map.ts`** in your application code
2. **Test after each generation** to ensure everything works
3. **Keep versioning enabled** for production safety
4. **Regular cleanup** happens automatically (keeps last 10 versions)
5. **Use rollback** when you need to revert changes quickly

## 🚨 Important Notes

- **Never edit versioned files directly** (`routes-map.v1.ts`, etc.)
- **Always use the generation script** to create new versions
- **The content copying system is automatic** - don't manually copy files
- **Your application code never changes** - always import `routes-map.ts`

## 🎉 Benefits

- ✅ **Automatic versioning** - no manual file management
- ✅ **Instant rollback** - switch versions in seconds
- ✅ **Git friendly** - no symlink issues with version control
- ✅ **IDE friendly** - displays actual content, not symlink targets
- ✅ **Cross-platform** - works on all operating systems
- ✅ **Safe** - all historical versions preserved
- ✅ **Easy to use** - your code never changes
- ✅ **Production ready** - built-in validation and error handling

---

**Need help?** Check the validation reports in the script output for detailed error messages and solutions.