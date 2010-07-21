#!/usr/bin/python
"""Publish this game here to server"""

import subprocess, sys

manifest = [
  "*.html",
  "json2.js",
  "config.js",
  "jquery.js",
  "main.js",
  "newguy.js",
  "roster.js",
  "*.gif",
  "back.jpg",
  "dicebar.jpg",
  "close*.png",
  "touch-icon.png",
  "ipad-ad.jpg",
  "*.css"]
includes = sum(map(list, zip(["--include"] * len(manifest), manifest)), [])
destination = "progressquest.com:www/progressquest.com/play/"

print manifest
args = (
  ["rsync"] +
  sys.argv[1:] +
  [#"--dry-run",
   "--verbose",
   "--compress",
   "--checksum",
   "--recursive",
   "--partial",
   "--progress",
   #"--itemize-changes",
   "--delete",
   "--delete-excluded",
   "--times"] +
  includes +
  ["--exclude", "*",
   "./",
   destination])

print args
output = subprocess.call(args)
