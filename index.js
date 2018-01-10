var IncomingWebhook = require('@slack/client').IncomingWebhook;
var winston = require("winston");
var os = require("os");
var request = require('request');

var url = process.env.SLACK_WEBHOOK_URL || '***REMOVED***';

var to = process.argv[2];
var title = process.argv[3];
var payload = process.argv[4];
var sourceURL = process.argv[5].trim() || 'https://' + os.hostname();

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
} else if (tags['acknowledgement'] == 'yes') {
    icon = ':eye:';
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
    channel: to,
    icon_url: "https://s3-eu-west-1.amazonaws.com/synergisite/img/zabbix-logo.png",
    attachments: [],
};

if (tags['acknowledgement'] == 'yes') {
    var attachment = {
        title: icon + " " + title,
        text: tags['message'],
    };
} else {
    var attachment = {
        title: icon + " " + tags['trigger'],
        text: tags['severity'] + " on " + tags['host'],
        title_link: sourceURL + '/events.php?filter_set=1&triggerid=' + tags['trigger id'],
        fields: [],
        actions: [],
    };
}

if (color !== null) {
    attachment.color = color;
}

if (tags['status'] == 'PROBLEM' && tags['severity'] != 'Information' && tags['acknowledgement'] != 'yes') {
        var graphLink = sourceURL + '/history.php?action=showgraph&itemids%5B%5D=' + tags['item id'];
        var fields = [
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
                value: '<' + graphLink + '|Click Me>',
                short: true,
            },
        ];
        attachment.fields = fields;

        attachment.actions = [
            {
                "type": "button",
                "text": "Acknowledge",
                "url": sourceURL + "/zabbix.php?action=acknowledge.edit&eventids\[\]=" + tags['event id'],
            },
        ];
} else if (tags['severity'] == 'Information') {
    if (tags['status'] == 'PROBLEM') {
        attachment.title = tags['host'];
        attachment.text = ':information_source: ' + tags['trigger'];
    } else {
        process.exit();
    }
} else if (tags['status'] == 'OK') {
    attachment.text = msg_title;
}
response.attachments.push(attachment);

var webhook = new IncomingWebhook(url, {
    iconUrl: "https://s3-eu-west-1.amazonaws.com/synergisite/img/zabbix-logo.png"
});
webhook.send(response, function (err, res) {});
