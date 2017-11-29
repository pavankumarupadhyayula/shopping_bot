'use strict';
const builder = require('botbuilder'),
    request = require('request'),
    config = require('./../bin/configuration');


let sendCreatedHeroCards = (session, attachments) => {

    let reply = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(attachments);

    session.send(reply);
}


module.exports = function(session) {

    let options = {
            "method": "GET",
            "uri": config.API_SERVER_PATH + "/v1/mobiles",
            timeout: 60000
        },
        products = [];


    request(options, (err, response, body) => {

        let requestData = JSON.parse(body),
            len = requestData.length;

        //FOR Loop
        for (var i = 0; i < len; i++) {
            if (requestData[i].ProductId != undefined) {
                var card = new builder.HeroCard(session)
                    .title(requestData[i].ProductName)
                    .subtitle(requestData[i].ProductSubName + ", Price: $" + requestData[i].ProductPrice)
                    .text(requestData[i].ProductDescription)
                    .images([builder.CardImage.create(session, config.API_SERVER_PATH + "/" + requestData[i].ProductImgURL)])
                    .buttons([builder.CardAction.imBack(session, "Add to cart " + requestData[i].ProductName, 'Add to cart')]);
                products.push(card);
            }
        }
        //return carousel
        //sendCreatedHeroCards(session, products);

        let reply = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(products);

        session.send(reply);
    });


}