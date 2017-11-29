'use strict';
const builder = require('botbuilder'),
    { DialogLabels } = require('./menu');

module.exports = function(session) {
    builder.Prompts.choice(session, 'Dear Customer, Do you want to Buy', [DialogLabels.Watches, DialogLabels.Mobiles, DialogLabels.Laptops, DialogLabels.Help])
}