'use strict';

let _substr = function(val) { return val.substr(0, val.indexOf(".")); }

let _substrPrdouctType = function(val) { return val.substr(0, val.indexOf(",")); }

let _substrPrdouctName = function(val) { return val.substr(val.indexOf(",")).replace(",", ""); }

module.exports = {
    substr: _substr,
    productType: _substrPrdouctType,
    productName: _substrPrdouctName
}