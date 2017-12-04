'use strict';

let _substr = function(val) { return val.substr(0, val.indexOf(".")); }

//let _substrPrdouctType = function(val) { return val.substr(0, val.indexOf(",")); }

let _substrPrdouct = function(val) { console.log(val); return val.split(","); }

module.exports = {
    substr: _substr,
    //productType: _substrPrdouctType,
    product: _substrPrdouct
}