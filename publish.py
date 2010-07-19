#!/usr/bin/python
"""Publish this game here to server"""

import subprocess

manifest = [
  "*.html",
  "config.js",
  "jquery.js",
  "main.js",
  "newguy.js",
  "roster.js",
  "*.gif",
  "back.jpg",
  "dicebar.jpg",
  "close*.png",
  "*.css"]
includes = sum(map(list, zip(["--include"] * len(manifest), manifest)), [])
destination = "progressquest.com:www/progressquest.com/play/"

print manifest
output = subprocess.call(
  ["rsync",
   #"--dry-run",
   "--verbose",
   "--compress",
   "--checksum",
   "--recursive",
   "--partial",
   "--progress",
   #"--itemize-changes",
   "--delete",
   "--delete-excluded",
   "--times",
   ] + includes + [
   "--exclude", "*",
   "./",
   destination])
