'use strict';
const builder = require('botbuilder'),
    sessionmanager = require('./../utils/sessionmanager'),
    tools = require('./../utils/tools'),
    { DialogCallBackLabels } = require('./../dialogs/menu');

let customerdata = [],
    object = {},
    clientId,
    ProductName;
module.exports = [function(session) {
    //Client Id for each session
    clientId = session.message.sourceEvent.clientActivityId;
    clientId = tools.substr(clientId);

    let msg = session.message.text;
    console.log(msg);
    msg = msg.replace("Product ", "").split(",");
    console.log(msg);
    ProductName = msg[1];

    //Storing Messages;
    if (!object.hasOwnProperty(clientId)) {
        object[clientId] = { "Item": [{ "ProductType": msg[0], "productName": msg[1], "price": msg[2].replace("$", "") }] };
    } else {
        object[clientId].Item.push({ "ProductType": msg[0], "productName": msg[1], "price": msg[2].replace("$", "") });
    }
    builder.Prompts.number(session, `How many  ${msg[1]} do you want to purchase?(e.g.: 5 or 10)`);

}, function(session, result) {

    let msg = result.response;

    //Storing Messages;
    for (var i = 0; i < object[clientId]["Item"].length; i++) {
        if (object[clientId]["Item"][i]['productName'] == ProductName)
            object[clientId]["Item"][i]['quantity'] = msg;
    }

    builder.Prompts.choice(session, `Item add to cart, Do you want to purchase more..`, [DialogCallBackLabels.Yes, DialogCallBackLabels.No]);
}, function(session, result) {
    if (!result.response) {
        // exhausted attemps and no selection, start over
        session.send('Ooops! Too many attemps :( But don\'t worry, I\'m handling that exception and you can try again!');
        return session.endDialog();
    }

    // on error, start over
    session.on('error', function(err) {
        session.send('Failed with message: %s', err.message);
        session.endDialog();
    });

    // continue on proper dialog
    var selection = result.response.entity;
    switch (selection) {
        case 'Yes':
            session.endDialog();
        case 'No':
            sessionmanager.setSessionData(object);
            return session.beginDialog(selection);
    }
}]