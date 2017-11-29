'use strict';
module.exports = function(session) {
    session.send('Help');
    session.endDialog();
}