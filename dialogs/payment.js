'use strict';
const builder = require('botbuilder'),
    request = require('request'),
    openUrl = require('open'),
    config = require('./../bin/configuration'),
    store = require('store'),
    uuid = require('uuid/v4');


module.exports = [function(session) {
    console.log(JSON.stringify(session.userData.order));
    let options = {
        "method": "POST",
        "uri": config.API_SERVER_PATH + "/prepayment",
        "json": { "clientId": session.userData.clientId, "orderDetails": session.userData, "botAddress": session.message.address, "transactionId": uuid() },
        "timeout": 60000
    };
    request(options, function(err, response, body) {
        console.log(body.clientId);

        openUrl(config.UI_SERVER_PATH + '/' + body);
    })
}]