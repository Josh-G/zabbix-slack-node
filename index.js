var IncomingWebhook = require('@slack/client').IncomingWebhook;

var url = process.env.SLACK_WEBHOOK_URL || '***REMOVED***';

var to = process.argv[2];
var title = process.argv[3];
var payload = process.argv[4];

var parser = /^([\d\w ]+?):(.+?)$/gm;
parser = new RegExp(parser);

var tags = {};
while ((result = parser.exec(payload)) !== null) {
    tags[result[1].toLowerCase().trim()] = result[2].trim();
}
tags['when'] = new Date(tags['when']);

var color = '#59db8f';
if (tags['status'] == 'PROBLEM') {
    if (tags['severity'] == 'Warning') {
        color = '#FFC859';
    }
    else if (tags['severity'] == 'Average') {
        color = '#FFA059';
    }
}

var msg_title = 'Unknown Event!';
var icon = ':grey_question:';
if (tags['status'] == 'OK') {
    icon = ':heavy_check_mark:';
    msg_title = 'Resolved: '+tags['trigger']
}
else {
    if (tags['severity'] == 'Disaster' || tags['Severity'] == 'High' || tags['severity'] == 'Average') {
        icon = ':bangbang:';
    }
    else {
        icon = ':exclamation:';
    }
    msg_title = 'PROBLEM: '+tags['trigger']
}

var response = {
        username: 'zabbix',
        // channel: '#test',
        channel: to,
        icon_emoji: icon,
        attachments: [{
            title: msg_title,
            title_link: 'http://zabbix/events.php?filter_set=1&triggerid='+tags['trigger id'],
            color: color,
            fields: [
                {
                    title: "Trigger",
                    value: tags['trigger'],
                    short: true,
                },
                {
                    title: "Severity",
                    value: tags['severity'],
                    short: true,
                },
                {
                    title: "Current Value",
                    value: tags['value'],
                    short: true,
                },
                {
                    title: "IP Address",
                    value: tags['ip'],
                    short: true,
                },
                {
                    title: "Graph Link",
                    value: '<http://zabbix/history.php?action=showgraph&itemids%5B%5D='+tags['item id']+'|Click Me>',
                    short: true,
                },
            ]
        }],
};

var webhook = new IncomingWebhook(url, {iconEmoji: icon});
webhook.send(response, function() {

});
