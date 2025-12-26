import fs from "fs";
import path from "path";
import { glob } from "glob";

// Dynamically discover and import all swagger files
async function loadAllSwaggerFiles() {
  const swaggerFiles = await glob("../src/**/*.swagger.ts", { 
    cwd: __dirname 
  });
  
  const apis: any[] = [];
  
  for (const file of swaggerFiles) {
    try {
      const module = await import(path.resolve(__dirname, file));
      // Get all exports from the module
      const exports = Object.values(module);
      
      // Filter for objects that have 'path' and 'operation' properties
      const swaggerExports = exports.filter((exp: any) => 
        exp && typeof exp === 'object' && exp.path && exp.operation
      );
      
      // Check for exports missing path property
      const exportsWithOperation = exports.filter((exp: any) => 
        exp && typeof exp === 'object' && exp.operation
      );
      const missingPathExports = exportsWithOperation.filter((exp: any) => 
        !exp.path
      );
      
      if (missingPathExports.length > 0) {
        console.log(`\n⚠️  Exports missing 'path' property in ${file}:`);
        missingPathExports.forEach((exp: any) => {
          console.log(`   - ${exp.operation?.summary || 'Unknown'}`);
        });
      }
      
      // Check for exports missing operation property
      const exportsWithPath = exports.filter((exp: any) => 
        exp && typeof exp === 'object' && exp.path
      );
      const missingOperationExports = exportsWithPath.filter((exp: any) => 
        !exp.operation
      );
      
      if (missingOperationExports.length > 0) {
        console.log(`\n⚠️  Exports missing 'operation' property in ${file}:`);
        missingOperationExports.forEach((exp: any) => {
          console.log(`   - Path: ${exp.path}`);
        });
      }
      
      // Note: Some exports may be filtered out if they don't have both 'path' and 'operation' properties
      // This is expected for utility/helper exports that aren't actual API endpoints
      
      apis.push(...swaggerExports);
    } catch (error) {
      console.warn(`Failed to load ${file}:`, error);
    }
  }
  
  return apis;
}

// Configuration for access rights enforcement and versioning
const CONFIG = {
  // Set to true to throw errors for missing access rights
  ENFORCE_ACCESS_RIGHTS: true, // Changed to true for production safety
  // Set to true to throw errors for duplicate operationIds
  ENFORCE_UNIQUE_OPERATION_IDS: true, // Changed to true for production safety
  // Set to true to show detailed validation report
  SHOW_VALIDATION_REPORT: true,
  // Set to true to enable file versioning for rollback support
  ENABLE_FILE_VERSIONING: true,
  // Maximum number of versions to keep (older versions will be deleted)
  MAX_VERSIONS_TO_KEEP: 10,
};

// Version management functions
function getNextVersionNumber(basePath: string): number {
  const versionFiles = fs.readdirSync(path.dirname(basePath))
    .filter(file => file.startsWith(path.basename(basePath, '.ts') + '.v') && file.endsWith('.ts'))
    .map(file => {
      const match = file.match(/\.v(\d+)\.ts$/);
      return match ? parseInt(match[1] || '0', 10) : 0;
    })
    .filter(version => !isNaN(version))
    .sort((a, b) => b - a); // Sort descending to get highest version first

  return versionFiles.length > 0 ? (versionFiles[0] || 0) + 1 : 1;
}


function cleanupOldVersions(basePath: string, maxVersions: number): void {
  const dir = path.dirname(basePath);
  const baseName = path.basename(basePath, '.ts');
  
  const versionFiles = fs.readdirSync(dir)
    .filter(file => file.startsWith(baseName + '.v') && file.endsWith('.ts'))
    .map(file => {
      const match = file.match(/\.v(\d+)\.ts$/);
      const version = match ? parseInt(match[1] || '0', 10) : 0;
      const fullPath = path.join(dir, file);
      const stats = fs.statSync(fullPath);
      return { file, version, fullPath, mtime: stats.mtime };
    })
    .filter(item => !isNaN(item.version))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime()); // Sort by modification time, newest first

  // Keep only the most recent versions
  const filesToDelete = versionFiles.slice(maxVersions);
  
  filesToDelete.forEach(item => {
    try {
      fs.unlinkSync(item.fullPath);
      console.log(`🗑️  Cleaned up old version: ${item.file}`);
    } catch (error) {
      console.warn(`⚠️  Failed to delete old version ${item.file}:`, error);
    }
  });
}

// Note: Now using full paths instead of base paths to show all individual routes

async function generateRoutesMap() {
  const routesMap: { path: string; method: string; accessRights: string[]; operationId: string }[] = [];

  // Dynamically load all swagger files
  const apis = await loadAllSwaggerFiles();
  console.log(`🔍 Total exports found: ${apis.length}`);

  // Track routes missing access rights
  const routesMissingRights: string[] = [];
  const routesWithRights: string[] = [];
  
  // Track operationIds for uniqueness validation
  const operationIds: string[] = [];
  const duplicateOperationIds: string[] = [];

  for (const api of apis) {
    // Use the full path instead of just the base path
    const fullPath = api.path;
    const operation = api.operation as any;
    const rights = operation.metaData?.accessRights || [];
    const method = api.method || 'GET'; // Get method from the top level, default to GET if not specified

    // Use operationId as key to get all 80 routes (truly unique)
    const operationId = operation.operationId || 'unknown';
    
    // Check for duplicate operationIds
    if (operationIds.includes(operationId)) {
      duplicateOperationIds.push(operationId);
      console.error(`❌ DUPLICATE operationId found: "${operationId}" (${method}) for path "${fullPath}"`);
    } else {
      operationIds.push(operationId);
    }
    
    routesMap.push({
      path: fullPath,
      operationId: operationId,
      method: method,
      accessRights: rights
    });

    // Track routes for validation
    if (rights.length === 0) {
      routesMissingRights.push(`${method} ${fullPath}`);
    } else {
      routesWithRights.push(`${method} ${fullPath}`);
    }
  }

  // Validation report
  if (CONFIG.SHOW_VALIDATION_REPORT) {
    console.log(`\n📊 Access Rights Validation Report:`);
    console.log(`✅ Routes WITH access rights: ${routesWithRights.length}`);
    console.log(`⚠️  Routes MISSING access rights: ${routesMissingRights.length}`);
    
    if (routesMissingRights.length > 0) {
      console.log(`\n🚨 Routes missing metaData.accessRights:`);
      routesMissingRights.forEach((route, index) => {
        console.log(`   ${index + 1}. ${route}`);
      });
    }
    
    // OperationId uniqueness report
    console.log(`\n🔍 OperationId (method) Uniqueness Report:`);
    console.log(`✅ Unique operationIds (method): ${operationIds.length}`);
    console.log(`❌ Duplicate operationIds (method): ${duplicateOperationIds.length}`);
    
    if (duplicateOperationIds.length > 0) {
      console.log(`\n🚨 DUPLICATE operationIds found:`);
      const uniqueDuplicates = [...new Set(duplicateOperationIds)];
      uniqueDuplicates.forEach((operationId, index) => {
        // Find the method for this operationId
        const duplicateRoute = apis.find(api => api.operation.operationId === operationId);
        const method = duplicateRoute?.method || 'unknown';
        console.log(`   ${index + 1}. "${operationId}" (${method})`);
      });
      console.log(`\n❌ ERROR: Found ${duplicateOperationIds.length} duplicate operationIds!`);
      console.log(`   This will cause routes to overwrite each other.`);
      console.log(`   Please make all operationIds unique in your swagger files.`);
    }
  }

  // Enforcement: Throw error if configured to enforce access rights
  if (CONFIG.ENFORCE_ACCESS_RIGHTS && routesMissingRights.length > 0) {
    console.error(`\n❌ ENFORCEMENT ERROR: ${routesMissingRights.length} routes are missing access rights!`);
    console.error(`   Set CONFIG.ENFORCE_ACCESS_RIGHTS = false to allow missing rights`);
    console.error(`   Or add metaData.accessRights to the following routes:`);
    routesMissingRights.forEach((route, index) => {
      console.error(`   ${index + 1}. ${route}`);
    });
    process.exit(1);
  }

  // Enforcement: Throw error if configured to enforce unique operationIds
  if (CONFIG.ENFORCE_UNIQUE_OPERATION_IDS && duplicateOperationIds.length > 0) {
    console.error(`\n❌ ENFORCEMENT ERROR: ${duplicateOperationIds.length} duplicate operationIds found!`);
    console.error(`   Set CONFIG.ENFORCE_UNIQUE_OPERATION_IDS = false to allow duplicates`);
    console.error(`   Or make all operationIds unique in your swagger files:`);
    const uniqueDuplicates = [...new Set(duplicateOperationIds)];
    uniqueDuplicates.forEach((operationId, index) => {
      // Find the method for this operationId
      const duplicateRoute = apis.find(api => api.operation.operationId === operationId);
      const method = duplicateRoute?.method || 'unknown';
      console.error(`   ${index + 1}. "${operationId}" (${method})`);
    });
    process.exit(1);
  }

  // Output file
  const fileContent = `export const RightsMap = ${JSON.stringify(routesMap, null, 2)};\n`;

  const outFile = path.resolve(__dirname, "../src/api-schema/routes-mapper/routes-map.ts");
  
  // Determine the target file and versioning logic
  let targetFile: string;
  let nextVersion: number;
  
  if (CONFIG.ENABLE_FILE_VERSIONING) {
    // Get the next version number based on existing v1, v2, etc. files
    nextVersion = getNextVersionNumber(outFile);
    targetFile = path.resolve(__dirname, `../src/api-schema/routes-mapper/routes-map.v${nextVersion}.ts`);
    
    // Clean up old versions (keep only the most recent ones)
    cleanupOldVersions(outFile, CONFIG.MAX_VERSIONS_TO_KEEP);
  } else {
    targetFile = outFile;
    nextVersion = 0; // Set a default value for non-versioning mode
  }
  
  // Handle symlinks - if targetFile is a symlink, remove it first
  if (fs.existsSync(targetFile)) {
    try {
      const stats = fs.lstatSync(targetFile);
      if (stats.isSymbolicLink()) {
        fs.unlinkSync(targetFile);
        console.log(`🔗 Removed existing symlink: ${path.basename(targetFile)}`);
      }
    } catch (error) {
      // If it's not a symlink, continue with normal file handling
    }
  }
  
  // Temporarily make file writable for script
  try {
    fs.chmodSync(targetFile, 0o644); // Make writable
  } catch (error) {
    console.log("ℹ️  File permissions already writable or file doesn't exist yet");
  }
  
  // Write the file
  fs.writeFileSync(targetFile, fileContent, { encoding: "utf-8" });
  
  // Lock the file again (make read-only)
  fs.chmodSync(targetFile, 0o444); // Make read-only
  
  console.log(`✅ ${path.basename(targetFile)} generated and locked successfully!!`);
  
  // Copy content to routes-map.ts (if versioning is enabled)
  if (CONFIG.ENABLE_FILE_VERSIONING) {
    // Remove existing file/symlink if it exists
    if (fs.existsSync(outFile)) {
      try {
        const stats = fs.lstatSync(outFile);
        if (stats.isSymbolicLink()) {
          fs.unlinkSync(outFile);
          console.log(`🔗 Removed existing symlink: ${path.basename(outFile)}`);
        } else {
          // It's a regular file, remove it
          fs.unlinkSync(outFile);
          console.log(`🗑️  Removed existing file: ${path.basename(outFile)}`);
        }
      } catch (error) {
        console.warn(`⚠️  Error removing existing file: ${error}`);
      }
    }
    
    // Copy content from the latest version to routes-map.ts
    fs.copyFileSync(targetFile, outFile);
    console.log(`📄 routes-map.ts updated with content from routes-map.v${nextVersion}.ts`);
  }
  
  // Show versioning info if enabled
  if (CONFIG.ENABLE_FILE_VERSIONING) {
    const versionFiles = fs.readdirSync(path.dirname(outFile))
      .filter(file => file.startsWith('routes-map.v') && file.endsWith('.ts'))
      .sort();
    
    if (versionFiles.length > 0) {
      console.log(`📚 Available versions: ${versionFiles.join(', ')}`);
      console.log(`💡 To rollback, use: npm run generate:routes-map rollback <version>`);
    }
  }
}

// Rollback utility function using content copy approach
function rollbackToVersion(version: number): void {
  const outFile = path.resolve(__dirname, "../src/api-schema/routes-mapper/routes-map.ts");
  const dir = path.dirname(outFile);
  const baseName = path.basename(outFile, '.ts');
  const versionedFile = path.join(dir, `${baseName}.v${version}.ts`);
  
  if (!fs.existsSync(versionedFile)) {
    console.error(`❌ Version ${version} not found: ${versionedFile}`);
    process.exit(1);
  }
  
  try {
    // Remove existing file/symlink
    if (fs.existsSync(outFile)) {
      fs.unlinkSync(outFile);
    }
    
    // Copy content from the versioned file
    fs.copyFileSync(versionedFile, outFile);
    
    console.log(`✅ Successfully rolled back to version ${version}`);
    console.log(`📄 routes-map.ts updated with content from routes-map.v${version}.ts`);
  } catch (error) {
    console.error(`❌ Failed to rollback to version ${version}:`, error);
    process.exit(1);
  }
}

// Command line argument handling
const args = process.argv.slice(2);
if (args.length > 0) {
  const command = args[0];
  
  if (command === 'rollback' && args[1]) {
    const version = parseInt(args[1], 10);
    if (isNaN(version)) {
      console.error('❌ Invalid version number. Usage: npm run generate:routes-map rollback <version>');
      process.exit(1);
    }
    rollbackToVersion(version);
    process.exit(0);
  } else if (command === 'list-versions') {
    const outFile = path.resolve(__dirname, "../src/api-schema/routes-mapper/routes-map.ts");
    const dir = path.dirname(outFile);
    const versionFiles = fs.readdirSync(dir)
      .filter(file => file.startsWith('routes-map.v') && file.endsWith('.ts'))
      .sort();
    
    if (versionFiles.length === 0) {
      console.log('📚 No versioned files found');
    } else {
      console.log('📚 Available versions:');
      versionFiles.forEach(file => {
        const stats = fs.statSync(path.join(dir, file));
        console.log(`   ${file} (${stats.mtime.toISOString()})`);
      });
    }
    process.exit(0);
  } else {
    console.log('Usage:');
    console.log('  npm run generate:routes-map                    # Generate new routes map');
    console.log('  npm run generate:routes-map rollback <version> # Rollback to specific version');
    console.log('  npm run generate:routes-map list-versions      # List available versions');
    process.exit(1);
  }
}

generateRoutesMap().catch(console.error);
