'use strict';
const store = require('store');


let _setsessiondata = function(userdata) {
    return store.set('session', userdata);
}


let _getsessiondata = function(clientId) {

    let object = store.get('session');
    return object[clientId];

}



module.exports = {
    setSessionData: _setsessiondata,
    getSessionData: _getsessiondata
}