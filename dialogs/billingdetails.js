'use strict';
const builder = require('botbuilder'),
    sessionmanager = require('./../utils/sessionmanager'),
    tools = require('./../utils/tools'),
    config = require('./../bin/configuration'),
    request = require('request'),
    store = require('store'),
    uuid = require('uuid/v4');


var card = {
    "contentType": "application/vnd.microsoft.card.adaptive",
    "content": {
        "type": "AdaptiveCard",
        "version": "1.0",
        "body": [{
                "type": "TextBlock",
                "text": "Enter Customer Information",
                "size": "large",
                "weight": "bolder"
            },
            {
                "type": "TextBlock",
                "text": "First Name"
            },
            {
                "type": "Input.Text",
                "id": "firstname"
            }, {
                "type": "TextBlock",
                "text": "Last Name"
            },
            {
                "type": "Input.Text",
                "id": "lastname"
            },
            {
                "type": "TextBlock",
                "text": "Email"
            },
            {
                "type": "Input.Text",
                "id": "emailid"
            }, {
                "type": "TextBlock",
                "text": "Phone"
            },
            {
                "type": "Input.Text",
                "id": "phone"
            }
        ],
        "actions": [{
            "type": "Action.Submit",
            "title": "submit",
            'speak': '<s>Customer</s>',
            'data': {
                'type': 'Customer'
            }
        }]
    }
}



var shipping_card = {
    "contentType": "application/vnd.microsoft.card.adaptive",
    "content": {
        "type": "AdaptiveCard",
        "version": "1.0",
        "body": [{
                "type": "TextBlock",
                "text": "Enter Shipping Address",
                "size": "large",
                "weight": "bolder"
            },
            {
                "type": "TextBlock",
                "text": "Address1"
            },
            {
                "type": "Input.Text",
                "id": "address1"
            }, {
                "type": "TextBlock",
                "text": "Address2"
            },
            {
                "type": "Input.Text",
                "id": "address2"
            },
            {
                "type": "TextBlock",
                "text": "City"
            },
            {
                "type": "Input.Text",
                "id": "city"
            },
            {
                "type": "TextBlock",
                "text": "State"
            },
            {
                "type": "Input.ChoiceSet",
                "id": "state",
                "style": "compact",
                "choices": [{
                        "title": "Alabama",
                        "value": "AL"
                    },
                    {
                        "title": "Alaska",
                        "value": "AK"
                    },
                    {
                        "title": "California",
                        "value": "CA"
                    },
                    {
                        "title": "Florida",
                        "value": "FL"
                    },
                    {
                        "title": "Illinois",
                        "value": "IL"
                    }
                ]
            },
            {
                "type": "TextBlock",
                "text": "Zip"
            },
            {
                "type": "Input.Text",
                "id": "zip"
            },
            {
                "type": "TextBlock",
                "text": "Country"
            },
            {
                "type": "Input.ChoiceSet",
                "id": "country",
                "style": "compact",
                "choices": [{
                    "title": "USA",
                    "value": "USA",
                    "isSelected": true
                }]
            }
        ],
        "actions": [{
            "type": "Action.Submit",
            "title": "submit",
            'speak': '<s>ShippingAddress</s>',
            'data': {
                'type': 'ShippingAddress'
            }
        }]
    }
}




let processSubmitAction = (session, value) => {
    //console.log(session.message);
    switch (value.type) {
        case 'Customer':
            session.userData.customer = value;
            var cards = new builder.Message(session)
               .addAttachment(shipping_card);
               session.send(cards);
               return;
        case 'ShippingAddress':
            session.userData.shipping = value;
             console.log('userdata ------> ',JSON.stringify(session.userData));
             console.log(JSON.stringify(session.privateConversationData))
             session.endConversation();
                    let shippingDetails = session.userData;

        let options = {
            "method": "POST",
            "uri": config.API_SERVER_PATH + "/prepayment",
            "json": { "clientId":13235566, "orderDetails": session.privateConversationData, "botAddress": session.userData, "transactionId": uuid() },
            "timeout": 60000
        };
        request(options, function(err, response, body) {
            let card = new builder.ThumbnailCard(session)
                .title("Shipping Address")
                .subtitle("Purchased items will be delivered here")
                .text(`${shippingDetails.customer.firstname} ${shippingDetails.customer.lastname},${shippingDetails.customer.emailid},${shippingDetails.customer.phone},${shippingDetails.shipping.address1},${shippingDetails.shipping.address2},${shippingDetails.shipping.city},${shippingDetails.shipping.state},${shippingDetails.shipping.zip},${shippingDetails.shipping.country}`)
                .images([builder.CardImage.create(session, config.API_SERVER_PATH + "/gallery/images/shipping.png")])
                .buttons([builder.CardAction.openUrl(session, config.UI_SERVER_PATH + '/' + 123546, "Payment"), builder.CardAction.imBack(session, "cancel", "Cancel")]);

            var cardMsg = new builder.Message(session)
                .addAttachment(card);

            session.send(cardMsg);
//         })
            return;
    });
    }


}


module.exports.customer = function(session) {
    if (session.message && session.message.value) {
        // A Card's Submit Action obj was received
        processSubmitAction(session, session.message.value);
        return;
    }
    var cards = new builder.Message(session)
        .addAttachment(card);
    session.send(cards);
};




// module.exports = [function(session) {
//         builder.Prompts.text(session, "Please provide  First Name?(e.g.:Pavan Kumar)");
//     }, function(session, result) {
//         session.userData.firstname = result.response;
//         builder.Prompts.text(session, "Please provide  Last Name?(e.g.:Upadhyayula)");
//     }, function(session, result) {
//         session.userData.lastname = result.response;
//         builder.Prompts.text(session, "Please provide emailId?(e.g.:xxxx@gmail.com)");
//     },
//     function(session, result) {
//         session.userData.email = result.response;
//         builder.Prompts.number(session, "Please provide phone number?(e.g.:9000000000)");
//     },
//     function(session, result) {
//         session.userData.phonenumber = result.response;
//         builder.Prompts.text(session, "Please provide street1?(e.g.:1396 Mount Road)");
//     },
//     function(session, result) {
//         session.userData.street1 = result.response;
//         builder.Prompts.text(session, "Please provide street2?(e.g.:Street Town)");
//     },
//     function(session, result) {
//         session.userData.street2 = result.response;
//         builder.Prompts.text(session, "Please provide city?(e.g.:Chicago)");
//     },
//     function(session, result) {
//         session.userData.city = result.response;
//         builder.Prompts.text(session, "Please provide state?(e.g.:Illinois or IL)");
//     },
//     function(session, result) {
//         session.userData.state = result.response;
//         builder.Prompts.number(session, "Please provide zipcode?(e.g.:600018)");
//     },
//     function(session, result) {
//         session.userData.zipcode = result.response;
//         builder.Prompts.text(session, "Please provide country?(e.g.:United States or US)");
//     },
//     function(session, result) {
//         session.userData.country = result.response;
//         let clientId = session.userData.clientId,
//             purchaseDetails = sessionmanager.getSessionData(clientId);
//         //session.userData.clientId = clientId;
//         session.userData.order = purchaseDetails;

//         let shippingDetails = session.userData;


//         console.log(JSON.stringify(session.userData.order));
//         let options = {
//             "method": "POST",
//             "uri": config.API_SERVER_PATH + "/prepayment",
//             "json": { "clientId": session.userData.clientId, "orderDetails": session.userData, "botAddress": session.message.address, "transactionId": uuid() },
//             "timeout": 60000
//         };
//         request(options, function(err, response, body) {
//             let card = new builder.ThumbnailCard(session)
//                 .title("Shipping Address")
//                 .subtitle("Purchased items will be delivered here")
//                 .text(`${shippingDetails.firstname} ${shippingDetails.lastname},${shippingDetails.email},${shippingDetails.phonenumber},${shippingDetails.street1},${shippingDetails.street2},${shippingDetails.city},${shippingDetails.state},${shippingDetails.zipcode},${shippingDetails.country}`)
//                 .images([builder.CardImage.create(session, config.API_SERVER_PATH + "/gallery/images/shipping.png")])
//                 .buttons([builder.CardAction.openUrl(session, config.UI_SERVER_PATH + '/' + session.userData.clientId, "Payment"), builder.CardAction.imBack(session, "cancel", "Cancel")]);

//             var cardMsg = new builder.Message(session)
//                 .addAttachment(card);

//             session.send(cardMsg);
//         })

//     }
// ];