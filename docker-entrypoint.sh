#!/bin/sh

set -euo

VERSION="$(cat ./version.txt)"
export VERSION

exec "$@"
