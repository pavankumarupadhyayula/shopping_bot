'use strict';
const builder = require('botbuilder');

module.exports = [function(session) {
    builder.Prompts.text(session, "Please provide customer name?(e.g.:Pavan Kumar Upadhyayula)");
}, function(session, result) {
    session.userData.customername = result.response;
    builder.Prompts.text(session, "Please provide emailId?(e.g.:xxxx@gmail.com)");
}, function(session, result) {
    session.userData.email = result.response;
    builder.Prompts.number(session, "Please provide phone number?(e.g.:9000000000)");
}, function(session, result) {
    session.userData.phonenumber = result.response;
    builder.Prompts.text(session, "Please provide street1?(e.g.:1396 Mount Road)");
}, function(session, result) {
    session.userData.street1 = result.response;
    builder.Prompts.text(session, "Please provide street2?(e.g.:Street Town)");
}, function(session, result) {
    session.userData.street2 = result.response;
    builder.Prompts.text(session, "Please provide city?(e.g.:Chicago)");
}, function(session, result) {
    session.userData.city = result.response;
    builder.Prompts.text(session, "Please provide state?(e.g.:Illinois or IL)");
}, function(session, result) {
    session.userData.state = result.response;
    builder.Prompts.text(session, "Please provide country?(e.g.:United States or US)");
}, function(session, result) {
    session.userData.country = result.response;

    console.log('--------=----', session.userData);
    //builder.Prompts.text(session, "Please provide country?(e.g.:United States or US)");
}]