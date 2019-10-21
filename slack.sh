#!/bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE}")" ; pwd -P )

to=$1
subject=$2
body=$3
hostname=$4
slack_hook=$5

node $parent_path/index.js "$to" "$subject" "$body" "$hostname" "$slack_hook"
