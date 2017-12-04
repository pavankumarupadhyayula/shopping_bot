'use strict';
const builder = require('botbuilder'),
    { DialogLabels } = require('./menu');

module.exports = [function(session) {
    builder.Prompts.choice(session, 'Do you want to Buy', [DialogLabels.Watches, DialogLabels.Mobiles, DialogLabels.Laptops])
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

    var selection = result.response.entity.replace(" ", "");
    return session.beginDialog(selection);

}]