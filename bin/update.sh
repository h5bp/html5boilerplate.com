#!/bin/bash

declare currentBranch="$(git rev-parse --abbrev-ref HEAD 2> /dev/null)"
declare serverBranch="server-content"
declare tmpBranch=""

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

commit_and_push_changes() {
    # Commit the content from the temporary branch, then, if needed, overwrite
    # the branch intended for the server with the temporary branch, push the
    # changes upstream, and switch back to the original branch
    git add -A \
        && git reset -- ".gitignore" \
        && git commit -m "Yo server! This content is for you! 💜" > /dev/null \
        && git branch -M "$tmpBranch" "$serverBranch" > /dev/null \
        && git push -fq origin "$serverBranch" > /dev/null \
        && git checkout -fq "$currentBranch"
    print_result $? "Commit and push changes"
}

create_temporary_empty_branch() {
    tmpBranch="$(generate_unique_branch_name)"
    git checkout -q --orphan "$tmpBranch"
    print_result $? "Create empty branch"
}

generate_unique_branch_name() {
    local tmp=""
    while [ ! -z "$(git branch | grep -w "$tmp")" ]; do
        tmp="$(mktemp -u XXXXXXXXXXXXXXXXXXXX)"
    done
    printf "$tmp"
}

print_error() {
    # Print output in red
    printf "\e[0;31m [✖] $1\e[0m\n"
}

print_result() {
    [ $1 -eq 0 ] \
        && print_success "$2" \
        || print_error "$2"

    if [ $1 -ne 0 ]; then
        exit 1
    fi
}

print_success() {
    # Print output in green
    printf "\e[0;32m [✔] $1\e[0m\n"
}

remove_unneeded_content() {
    # Remove the unneded file, and then move the content from
    # within the `dist/` directory in the root of the project
    find . -maxdepth 1 \
            ! -name "." \
            ! -name ".git" \
            ! -name ".gitignore" \
            ! -name ".travis.yml" \
            ! -name "dist" \
            ! -name "node_modules" \
            -exec rm -rf {} \; \
        && cp -r dist/ . \
        && rm -rf dist/
    print_result $? "Remove unneded content"
}

update_content() {
    npm -q install > /dev/null \
        && grunt > /dev/null
    print_result $? "Update content"
}

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

main() {
    update_content
    create_temporary_empty_branch
    remove_unneeded_content
    commit_and_push_changes
}

main
