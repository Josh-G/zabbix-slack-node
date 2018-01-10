TO="#test"
SUBJECT="127.0.0.1 PROBLEM: Processor load is too high on [ALERT TEST]"
BODY="
Host: 127.0.0.1
Event: {ITEM.KEY1}
Item ID: 23296
Event ID: 1202295
Trigger ID: 1
Severity: Warning
Status: PROBLEM
Trigger: Processor load is too high on 127.0.0.1
Ack: {EVENT.ACK.STATUS}
Service: {TRIGGER.HOSTGROUP.NAME}
Value: 100%
Text: {TRIGGER.STATUS}: {TRIGGER.NAME}
Tags: {EVENT.TAGS}
IP: {HOST.IP1}
Template: {TRIGGER.TEMPLATE.NAME}: {TRIGGER.EXPRESSION}
When: 2018-01-01 00:00:00"

./slack.sh "$TO" "$SUBJECT" "$BODY"
