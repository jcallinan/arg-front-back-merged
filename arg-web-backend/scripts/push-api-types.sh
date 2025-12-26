# #!/bin/bash

# # Configuration
# API_TYPES_REPO="https://AmericanRefiningGroup@dev.azure.com/AmericanRefiningGroup/AmericanRefiningGroup/_git/arg-api-types"
# TEMP_DIR="temp-api-types"

# # Clean up temp directory if it exists
# rm -rf $TEMP_DIR

# # Create temp directory and copy generated files
# mkdir -p $TEMP_DIR
# cp -r src/api-schema/generated/* $TEMP_DIR/

# # Create package.json for the API types repo
# cat > $TEMP_DIR/package.json << EOL
# {
#   "name": "@arg/api-types",
#   "version": "1.0.0",
#   "private": true,
#   "main": "api.ts",
#   "types": "api.ts"
# }
# EOL

# # Initialize git and push to Azure DevOps
# cd $TEMP_DIR
# git init
# git add .
# git commit -m "Update API types $(date +%Y-%m-%d)"
# git branch -M main
# git remote add origin $API_TYPES_REPO
# git push -f origin main

# # Clean up
# cd ..
# rm -rf $TEMP_DIR

# echo "API types pushed to Azure DevOps successfully!" 