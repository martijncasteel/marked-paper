#!/bin/sh

git fetch --all
git reset --hard origin/master

git log -1 | awk 'NR==1 {print $2}'

return
