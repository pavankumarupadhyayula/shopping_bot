'use strict';
const builder = require('botbuilder'),
    { DialogLabelsMain } = require('./menu');

module.exports = function(session) {
    builder.Prompts.choice(session, 'Dear Customer, Please chose your option...', [DialogLabelsMain.Buy, DialogLabelsMain.TrackOrder, DialogLabelsMain.Help])
}