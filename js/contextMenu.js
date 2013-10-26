(function(){
    var jd = require("js/jdCommon.js");

    function goToJD (info, tab) {
	chrome.storage.sync.get(["cityId"], function (o){
	    if(!(o.cityId)){
		window.alert("Nie wybrano miasta. Kliknij na przycisk na toolbarze i wybierz miasto.");
	    } else {
		navigator.geolocation.getCurrentPosition(function (position){
		    var o = {};
		    o["fromCoords"] = position.coords.latitude
			+ ":" + position.coords.longitude;
		    o["fromName"] = "Moja lokalizacja (dokł. " + position.coords.accuracy + " m)";
		    o["toName"] = info.selectionText;
		    o["autoSearch"] = true;
		    chrome.tabs.create({url : jd.createJDUrl(o)});
		});
	    }
	});
    }

    chrome.contextMenus.create({
	"title": "Znajdź trasę do \"%s\" na jakdojade.pl",
	"contexts": ["selection"],
	"onclick": goToJD
    });
})();
