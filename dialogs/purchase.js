'use strict';
const builder = require('botbuilder'),
    sessionmanager = require('./../utils/sessionmanager'),
    tools = require('./../utils/tools'),
    { DialogCallBackLabels } = require('./../dialogs/menu');

let customerdata = [],
    object = {},
    clientId;

module.exports = [function(session) {
    //Client Id for each session
    clientId = session.message.sourceEvent.clientActivityId;
    clientId = tools.substr(clientId);

    let msg = session.message.text;
    msg = msg.replace("Product ", "");

    //Storing Messages;
    if (!object.hasOwnProperty(clientId)) {
        object[clientId] = { "Item": [{ "ProductType": tools.productType(msg), "productName": tools.productName(msg) }] };
    } else {
        object[clientId].Item.push({ "ProductType": tools.productType(msg), "productName": tools.productName(msg) });
    }
    builder.Prompts.number(session, `How many  ${ tools.productName(msg)} do you want to purchase?(e.g.: 5 or 10)`);

}, function(session, result) {

    let msg = result.response;

    //Storing Messages;
    object[clientId]["Item"].push({ "quantity": msg });
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