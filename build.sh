#!/bin/bash
set -e

# Set environment variables
export CI=false
export GENERATE_SOURCEMAP=false

# Make sure react-scripts is executable
chmod +x node_modules/.bin/react-scripts

# Run the build
node_modules/.bin/react-scripts build 