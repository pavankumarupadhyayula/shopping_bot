'use strict';
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    builder = require('botbuilder'),
    config = require('./../bin/configuration'),
    watches = require('./../dialogs/watches'),
    mobiles = require('./../dialogs/mobiles'),
    laptops = require('./../dialogs/laptops'),
    mainmenu = require('./../dialogs/mainmenu'),
    help = require('./../dialogs/help'),
    billingdetails = require('./../dialogs/billingdetails'),
    { DialogCallBackLabels } = require('./../dialogs/menu');


app.set('PORT', config.defaultPort);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//bot microsoft appId and appPassword
var connector = new builder.ChatConnector({
    appId: '',
    appPassword: ''
});


app.post('/api/messages', connector.listen());


let customerdata = [],
    object = {},
    clientId;



// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, [mainmenu, function(session, result) {

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

    var selection = result.response.entity.replace(" ", "");
    return session.beginDialog(selection);

}]);




bot.dialog('buy', [function(session) {
            //Client Id for each session
            clientId = session.message.sourceEvent.clientActivityId;
            clientId = clientId.substr(0, clientId.indexOf("."));

            let msg = session.message.text;
            msg = msg.replace("Add to cart ", "");

            //Storing Messages;
            if (!object.hasOwnProperty(clientId)) {
                object[clientId] = { "Item": [msg] };
            } else {
                object[clientId].Item.push(msg);
            }

            builder.Prompts.choice(session, 'Item add to cart, Do you want to purchase more..', [DialogCallBackLabels.Yes, DialogCallBackLabels.No]);
        },
        function(session, result) {


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
                    return session.beginDialog(selection);
            }

        }
    ])
    .triggerAction({
        matches: /Add to cart/i
    });




bot.dialog('Yes', [mainmenu, function(session, result) {

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

    var selection = result.response.entity.replace(" ", "");
    return session.beginDialog(selection);

}]);



bot.dialog('No', billingdetails);


bot.dialog('Watches', watches);
bot.dialog('Mobiles', mobiles);
bot.dialog('Laptops', laptops);
bot.dialog('Help', help);


// Catching error message
bot.on('error', (e) => {
    console.log(`An error occured: ${JSON.stringify(e)}`);
})


app.listen(app.get('PORT'), (req, res) => {
    console.log(`bot application is up and running on http://localhost:${app.get('PORT')}`);
});