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
    purchase = require('./../dialogs/purchase'),
    payment = require('./../dialogs/payment'),
    tools = require('./../utils/tools'),
    store = require('store'),
    buymenu = require('./../dialogs/buymenu'),
    trackorder = require('./../dialogs/trackorder');



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


// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, [mainmenu, function(session, result) {
    console.log(session.message);
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


bot.dialog('purchase', purchase).triggerAction({
    matches: /Product/i
});


bot.dialog('pay', payment).triggerAction({
    matches: /Pay/i
});

bot.dialog('cancel', [function(session) {
    session.send('Your order has been cancelled').endDialog()
}]).triggerAction({
    matches: /Cancel/i
});



bot.dialog('Yes', buymenu);
bot.dialog('No', billingdetails);

bot.dialog('Buy', buymenu);
bot.dialog('TrackOrder', trackorder);

bot.dialog('Watches', watches);
bot.dialog('Mobiles', mobiles);
bot.dialog('Laptops', laptops);
bot.dialog('Help', help);


app.post('/callback', (req, res) => {
    console.log("callback", req.body);
    var msg = new builder.Message().address(req.body.address);
    if (req.body.status == 'ACCEPT') {
        msg.text('Your Order Confirmed \r \n  OrderID:123456');
    } else {
        msg.text('Sorry unable to place your order \r \n Order Failed');
    }

    msg.textLocale('en-US');
    bot.send(msg);
    res.send('ok');
    session.endDialog();
});


// Catching error message
bot.on('error', (e) => {
    console.log(`An error occured: ${JSON.stringify(e)}`);
})


app.listen(app.get('PORT'), (req, res) => {
    console.log(`bot application is up and running on http://localhost:${app.get('PORT')}`);
});