# zabbix-slack-node
A custom media type for Zabbix that will deliver PROBLEM / RESOLVED alerts to Slack.

* Graph links and acknowledge buttons are probably broken

## Preview
![Preview](https://github.com/josh-g/zabbix-slack-node/raw/images/images/preview.png)

Acknowledgements:

![Acknowledgements](https://github.com/josh-g/zabbix-slack-node/raw/images/images/acknowledge.png)


## Setup
1. Clone this repo into your Zabbix servers "AlertScriptsPath"
2. Run `npm install` inside the cloned repo
3. Log into Zabbix, go to Administration -> Media Types -> Create media type
4. Set the following values:

    | Key | Value |
    | - | - |
    | Type | Script |
    | Script name | `zabbix-slack-node/slack.sh` |
    | Script parameters | {ALERT.SENDTO} |
    |  | {ALERT.SUBJECT} |
    |  | {ALERT.MESSAGE} |
    |  | https://your.zabbix.website.example |
    |  | Your slack webhook URL |

6. Create a new user with sufficient permissions to view problems for all hosts
7. Add a media to the user, with `Type` => `Slack` and `Send to` => `#your-slack-channel`
8. Go to Configuration -> Actions -> Create action and ensure that the operation is defined like so:
<table>
    <thead>
        <tr>
            <td>Key</td>
            <td>Value</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Default subject</td>
            <td>{HOST.NAME1} {TRIGGER.STATUS}: {EVENT.NAME}</td>
        </tr>
        <tr>
            <td>Default message</td>
            <td>
                <pre>
Host: {HOST.NAME1}
Event: {ITEM.KEY1}
Item ID: {ITEM.ID}
Event ID: {EVENT.ID}
Trigger ID: {TRIGGER.ID}
Severity: {TRIGGER.SEVERITY}
Status: {TRIGGER.STATUS}
Trigger: {EVENT.NAME}
Ack: {EVENT.ACK.STATUS}
Service: {TRIGGER.HOSTGROUP.NAME}
Value: {ITEM.VALUE1}
Text: {TRIGGER.STATUS}: {EVENT.NAME}
Tags: {EVENT.TAGS}
IP: {HOST.IP1}
Template: {TRIGGER.TEMPLATE.NAME}: {TRIGGER.EXPRESSION}
When: {EVENT.DATE} {EVENT.TIME}
                </pre>
            </td>
        </tr>
        <tr>
            <td>Operations</td>
            <td>
                <ul>
                    <li>New</li>
                    <li>Send to users: Slack</li>
                    <li>Send only to: Slack</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>
9. Now configure the recovery operation:
<table>
    <thead>
        <tr>
            <td>Key</td>
            <td>Value</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Default subject</td>
            <td>{TRIGGER.STATUS}: {EVENT.NAME}</td>
        </tr>
        <tr>
            <td>Default message</td>
            <td>
                <pre>
Host: {HOST.NAME1}
Event: {ITEM.KEY1}
Item ID: {ITEM.ID}
Event ID: {EVENT.ID}
Severity: {TRIGGER.SEVERITY}
Status: {TRIGGER.STATUS}
Trigger: {EVENT.NAME}
Trigger ID: {TRIGGER.ID}
Ack: {EVENT.ACK.STATUS}
Service: {TRIGGER.HOSTGROUP.NAME}
Value: {ITEM.VALUE1}
Text: {TRIGGER.STATUS}: {EVENT.NAME}
Tags: {EVENT.TAGS}
IP: {HOST.IP1}
Template: {TRIGGER.TEMPLATE.NAME}: {TRIGGER.EXPRESSION}
When: {EVENT.DATE} {EVENT.TIME}
Recovered: {EVENT.RECOVERY.DATE} {EVENT.RECOVERY.TIME}
                </pre>
            </td>
        </tr>
        <tr>
            <td>Operations</td>
            <td>
                Notify all involved
            </td>
        </tr>
    </tbody>
</table>
10. Now configure the update operation:
<table>
    <thead>
        <tr>
            <td>Key</td>
            <td>Value</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Default subject</td>
            <td>{USER.FULLNAME} acknowledged: {EVENT.NAME}</td>
        </tr>
        <tr>
            <td>Default message</td>
            <td>
                <pre>
message: {ACK.MESSAGE}
acknowledgement: yes
status: {EVENT.STATUS}
Severity: {TRIGGER.SEVERITY}
                </pre>
            </td>
        </tr>
        <tr>
            <td>Operations</td>
            <td>
                Send message to users: Slack (Slack) via Slack
            </td>
        </tr>
    </tbody>
</table>
11. Save action
