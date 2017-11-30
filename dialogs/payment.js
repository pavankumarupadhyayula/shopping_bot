'use strict';
const builder = require('botbuilder'),
    request = require('request'),
    openUrl = require('open'),
    config = require('./../bin/configuration'),
    store = require('store');


module.exports = [function(session) {
    // let options = {
    //     "method": "POST",
    //     "uri": config.API_SERVER_PATH + "/v1/prepayment",
    //     "json": session.userData,
    //     "timeout": 60000
    // };
    // request(options, function(err, response, body) {
    //     console.log(body);
    //     openUrl('http://localhost:2017/v1/' + body);
    // })
}]