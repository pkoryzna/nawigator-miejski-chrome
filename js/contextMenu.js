(function(){

 	function createJDUrl (cityId, fromCoords, fromName, toCoords, toName, date, hour, autoSearch){
	 	var url = "http://jakdojade.pl/?";

 		url += "cid=" + cityId + "&";
 		if(fromCoords) url += "fc=" + fromCoords + "&";
 		if(fromName) url += "fn=" + encodeURI(fromName) + "&";
 		if(toCoords) url += "tc=" + toCoords + "&";
 		if(toName) url += "tn=" + encodeURI(toName) + "&";
 		if(hour) url += "h=" + hour + "&";
 		if(date) url += "d=" + date + "&";
 		if(autoSearch) url += "as=" + autoSearch;

	 	return url;
	 }

	function goToJD(info, tab){
		chrome.storage.sync.get(["cityId"], function (o){
			if(!(o.cityId)){
				window.alert("Nie wybrano miasta. Kliknij na przycisk na toolbarze i wybierz miasto.");
				
			} else {
				navigator.geolocation.getCurrentPosition(function (position){
					var fromCoords = position.coords.latitude
					 + ":" + position.coords.longitude;
					var fromName = "Moja lokalizacja (dokł. " + position.coords.accuracy + " m)";
					var toName = info.selectionText;
					var autoSearch = true;
					chrome.tabs.create({url : createJDUrl(o.cityId, fromCoords, fromName, null,
			 			toName, null, null, autoSearch)});
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