var IncomingWebhook = require('@slack/client').IncomingWebhook;
var winston = require("winston");

var url = process.env.SLACK_WEBHOOK_URL || '***REMOVED***';

var to = process.argv[2];
var title = process.argv[3];
var payload = process.argv[4];

winston.add(winston.transports.File, {
    filename: 'slack.log'
});

winston.info(payload);

var parser = /^([\d\w ]+?):(.+?)$/gm;
parser = new RegExp(parser);

var tags = {};
while ((result = parser.exec(payload)) !== null) {
    tags[result[1].toLowerCase().trim()] = result[2].trim();
}
tags['when'] = new Date(tags['when']);

var color = null;
if (tags['status'] == 'PROBLEM') {
    if (tags['severity'] == 'Information') {
        color = '#3aa3e3';
    } else if (tags['severity'] == 'Warning') {
        color = '#FFC859';
    } else if (tags['severity'] == 'Average') {
        color = '#FFA059';
    } else if (tags['severity'] == 'High') {
        color = '#FC673A';
    } else if (tags['severity'] == 'Disaster') {
        color = '#F60606';
    }
} else if (tags['status'] == 'OK') {
    color = '#59db8f'
}

var msg_title = 'Unknown Event!';
var icon = ':grey_question:';
if (tags['status'] == 'OK') {
    icon = ':heavy_check_mark:';
    msg_title = 'Resolved: ' + tags['trigger']
} else {
    if (tags['severity'] == 'Disaster' || tags['severity'] == 'High' || tags['severity'] == 'Average') {
        icon = ':bangbang:';
    } else {
        icon = ':exclamation:';
    }
    msg_title = 'PROBLEM: ' + tags['trigger']
}

var response = {
    username: 'zabbix',
    // channel: '#test',
    channel: to,
    icon_emoji: icon,
    attachments: [],
};
var attachment = {
    title: tags['host'] + ' ' + msg_title,
    title_link: 'http://zabbix/events.php?filter_set=1&triggerid=' + tags['trigger id'],
    fields: []
};
if (color !== null) {
    attachment.color = color;
}
if (tags['status'] == 'PROBLEM' &&
    tags['severity'] != 'Information') {
    var fields = [{
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
            title: "When",
            value: tags['when'],
            short: true,
        },
        {
            title: "Graph Link",
            value: '<http://zabbix.synergitech.net/history.php?action=showgraph&itemids%5B%5D=' + tags['item id'] + '|Click Me>',
            short: true,
        },
        {
            title: "Status",
            value: tags['status'],
            short: true,
        },
    ];
    attachment.fields = fields;
} else if (tags['status'] == 'OK') {
    attachment.text = ':heavy_check_mark: ' + msg_title;
} else if (tags['severity'] == 'Information' && tags['status'] == 'PROBLEM') {
    attachment.title = tags['host'];
    attachment.text = ':information_source: ' + tags['trigger'];
}

response.attachments.push(attachment);
var webhook = new IncomingWebhook(url, {
    iconEmoji: icon
});

webhook.send(response, function (err, res) {});
