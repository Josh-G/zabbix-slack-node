#!/bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE}")" ; pwd -P )

cd "$parent_path"

to=$1
subject=$2
body=$3

node ./index.js "#test" "OK: Processor load is too high on Zabbix Local" "OK: Processor load is too high on Zabbix Local,Host: Zabbix Local
Event: system.cpu.load[percpu,avg1]
Item ID: 23296
Event ID: 19659
Trigger ID: 13497
Severity: Warning
Status: OK
Trigger: Processor load is too high on Zabbix Local
Ack: No
Service: Zabbix servers
Value: 0.17
Text: OK: Processor load is too high on Zabbix Local
Tags: {EVENT.TAGS}
IP: 127.0.0.1
Template: Template OS Linux: {Zabbix Local:system.cpu.load[percpu,avg1].avg(5m)}>2
When: 2016.12.16 21:32:16 "
