#!/bin/bash
clear

if [ -z $1 ]; then
   echo "Hey buddy dont forget your commit messages."
   exit 1
else
   message="$1";
   git add .
   echo "Making commit with message $message . . . "
   git commit -m "$message"
   git push
   git checkout gh-pages
   git rebase master
   echo "Rebasing gh-pages . . . "
   git push
   git checkout master
   echo "You are all set to pal . . . Get coding again. . ."
fi
