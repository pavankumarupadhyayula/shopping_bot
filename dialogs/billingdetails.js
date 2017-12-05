'use strict';
const builder = require('botbuilder'),
    sessionmanager = require('./../utils/sessionmanager'),
    tools = require('./../utils/tools'),
    config = require('./../bin/configuration'),
    request = require('request'),
    store = require('store'),
    uuid = require('uuid/v4');

module.exports = [function(session) {
        builder.Prompts.text(session, "Please provide  First Name?(e.g.:Pavan Kumar)");
    }, function(session, result) {
        session.userData.firstname = result.response;
        builder.Prompts.text(session, "Please provide  Last Name?(e.g.:Upadhyayula)");
    }, function(session, result) {
        session.userData.lastname = result.response;
        builder.Prompts.text(session, "Please provide emailId?(e.g.:xxxx@gmail.com)");
    },
    function(session, result) {
        session.userData.email = result.response;
        builder.Prompts.number(session, "Please provide phone number?(e.g.:9000000000)");
    },
    function(session, result) {
        session.userData.phonenumber = result.response;
        builder.Prompts.text(session, "Please provide street1?(e.g.:1396 Mount Road)");
    },
    function(session, result) {
        session.userData.street1 = result.response;
        builder.Prompts.text(session, "Please provide street2?(e.g.:Street Town)");
    },
    function(session, result) {
        session.userData.street2 = result.response;
        builder.Prompts.text(session, "Please provide city?(e.g.:Chicago)");
    },
    function(session, result) {
        session.userData.city = result.response;
        builder.Prompts.text(session, "Please provide state?(e.g.:Illinois or IL)");
    },
    function(session, result) {
        session.userData.state = result.response;
        builder.Prompts.number(session, "Please provide zipcode?(e.g.:600018)");
    },
    function(session, result) {
        session.userData.zipcode = result.response;
        builder.Prompts.text(session, "Please provide country?(e.g.:United States or US)");
    },
    function(session, result) {
        session.userData.country = result.response;
        let clientId = session.userData.clientId,
            purchaseDetails = sessionmanager.getSessionData(clientId);
        //session.userData.clientId = clientId;
        session.userData.order = purchaseDetails;

        let shippingDetails = session.userData;


        console.log(JSON.stringify(session.userData.order));
        let options = {
            "method": "POST",
            "uri": config.API_SERVER_PATH + "/prepayment",
            "json": { "clientId": session.userData.clientId, "orderDetails": session.userData, "botAddress": session.message.address, "transactionId": uuid() },
            "timeout": 60000
        };
        request(options, function(err, response, body) {
            let card = new builder.ThumbnailCard(session)
                .title("Shipping Address")
                .subtitle("Purchased items will be delivered here")
                .text(`${shippingDetails.firstname} ${shippingDetails.lastname},${shippingDetails.email},${shippingDetails.phonenumber},${shippingDetails.street1},${shippingDetails.street2},${shippingDetails.city},${shippingDetails.state},${shippingDetails.zipcode},${shippingDetails.country}`)
                .images([builder.CardImage.create(session, config.API_SERVER_PATH + "/gallery/images/shipping.png")])
                .buttons([builder.CardAction.openUrl(session, config.UI_SERVER_PATH + '/' + body, "Payment"), builder.CardAction.imBack(session, "cancel", "Cancel")]);

            var cardMsg = new builder.Message(session)
                .addAttachment(card);

            session.send(cardMsg);
        })

    }
];