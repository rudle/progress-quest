#!/usr/bin/python
"""Publish this game here to server"""

import subprocess

manifest = "*.html *.js *.gif back.jpg dicebar.jpg close*.png *.css".split()
includes = sum(map(list, zip(["--include"] * len(manifest), manifest)), [])
server = "play.progressquest.com"
destination = "grumdrig.com:www/" + server + "/"

print manifest
output = subprocess.call(
  ["rsync",
   #"--dry-run",
   "--verbose",
   "--compress",
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
