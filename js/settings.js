// settings


define(function () {

    var settings;

    function get() {
	var out = {};
	var error;
	chrome.storage.sync.get(null, function(o){
	    if(! chrome.runtime.lastError) out = o;
	    else {
		console.log(chrome.runtime.lastError.message);
		error =  chrome.runtime.lastError.message
	    }
	});
	if (! error) return out;
	else return {error: error};
    };

    function set (o, val) {

	if(typeof o === "String") {
	    var prop = o;
	    o = {};
	    o[prop] = val;
	}
	chrome.storage.sync.set(o);
    };

    settings = get();
    settings["set"] = set;
    return settings;
});
