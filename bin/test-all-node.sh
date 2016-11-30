#! /bin/bash

. "$(brew --prefix nvm)/nvm.sh"

NODE_VERSIONS=(0.10 0.12 4 5 6 7)

for version in ${NODE_VERSIONS[@]}; do
  echo " -- Node $version"
  nvm install $version && \
    npm install --build-from-source && \
    npm test && \
    rm -rf node_modules || \
    exit $?
done
