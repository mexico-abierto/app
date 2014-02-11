#!/bin/sh

# Fetch DemocracyOS container image
# Run container

docker pull rodowi/dos
docker run -p 49160:3000 -d rodowi/dos

