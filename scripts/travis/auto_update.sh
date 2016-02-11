#!/bin/bash

declare -r PRIVATE_KEY_FILE_NAME='github_deploy_key'

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

# Decrypt the file containing the private key

openssl aes-256-cbc \
    -K $encrypted_61ec48e9c4ba_key \
    -iv $encrypted_61ec48e9c4ba_iv \
    -in "$(dirname "$BASH_SOURCE")/${PRIVATE_KEY_FILE_NAME}.enc" \
    -out ~/.ssh/$PRIVATE_KEY_FILE_NAME -d

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

# Enable SSH authentication

chmod 600 ~/.ssh/$PRIVATE_KEY_FILE_NAME
echo "Host github.com" >> ~/.ssh/config
echo "  IdentityFile ~/.ssh/$PRIVATE_KEY_FILE_NAME" >> ~/.ssh/config

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

# Automatically update the content from the `gh-pages` branch

$(npm bin)/travis-after-all && \
    $(npm bin)/update-branch --commands "npm run build" \
                             --commit-message "Hey server, this content is for you! [skip ci]" \
                             --directory "dist" \
                             --distribution-branch "gh-pages" \
                             --source-branch "master"
