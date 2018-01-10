#!/bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE}")" ; pwd -P )

cd "$parent_path"

to=$1
subject=$2
body=$3
hostname=$4

node ./index.js "$1" "$2" "$3" "$4"
