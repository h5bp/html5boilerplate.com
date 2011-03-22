#!/usr/bin/env bash

# gotta do this for the i18n subdomains that hotlink
cp src/css/style.css src/css/screen.css

make build
cd build
ant 
cd ..
