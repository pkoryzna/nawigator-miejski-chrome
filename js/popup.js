(function(){
	var DEBUG = true;
	var cityId, cityName, fromCoords, fromName, toCoords,
	 toName, date, hour, autoSearch, useGeo;

	var fromInput, toInput, locationBtn, nowCheckbox, datetimeInput, mainForm;

	 function submitForm(){
	 	toName = toInput.value;
	 	fromName = fromInput.value;
	 	if(!($(nowCheckbox).prop("checked"))) {

	 		date = getJDDate($(datetimeInput).val());
	 		hour = getJDTime($(datetimeInput).val());
	 	}
	 	if(cityId) {
	 		chrome.tabs.create({url: createJDUrl(cityId, fromCoords, fromName, toCoords,
	  			toName, date, hour, autoSearch)});
	 	} else {
	 		window.alert("Wybierz miasto.");
	 	}
	 	return false;
	 }

	 function createJDUrl(cityId, fromCoords, fromName, toCoords,
	  toName, date, hour, autoSearch){
	 	var url = "http://jakdojade.pl/?";

 		url += "cid=" + cityId + "&";
 		if(useGeo) url += "fc=" + fromCoords + "&";
 		if(fromName) url += "fn=" + encodeURI(fromName) + "&";
 		if(toCoords) url += "tc=" + toCoords + "&";
 		if(toName) url += "tn=" + encodeURI(toName) + "&";
 		if(hour) url += "h=" + hour + "&";
 		if(date) url += "d=" + date + "&";
 		if(autoSearch) url += "as=" + autoSearch;

	 	return url;
	 }

	 function getJDDate(datetime){
	 	// YYYY-MM-DD T   H  H  :  M  M
	 	// 0123456789 10  11 12 13 14 15
	 	return "" + datetime.substr(8,2) + "." + datetime.substr(5,2) + "." +
	 		 datetime.substr(2,2);

	 }

	 function getJDTime(datetime){
	 	 return "" + datetime.substr(11,2) + ":" + datetime.substr(14,2);
	 }

	 function setCity(){
	 	cityId = $(this).attr("data-cid");
	 	$("#cityName").html(cityName = $(this).attr("data-name"));
		console.log($(this).attr("data-name"));
		chrome.storage.sync.set({"cityId" : cityId, "cityName" : cityName});
	 }

	 function setGeoDefault(){
	 	var geoDefault = $("#geoDefaultOption").prop("checked");
		chrome.storage.sync.set({"geoDefault": geoDefault});
		if(geoDefault) {getLocation()} else {disableLocation()};
	 }

	 function disableLocation(){
	 	useGeo = false;
		$(locationBtn).removeClass("btn-success");
		locationBtn.onclick = getLocation;
		$(fromInput).prop({disabled: false});
		fromInput.value = "";
	 }

	 function getLocation(){
	 	navigator.geolocation.getCurrentPosition(positionSuccess);
		$(locationBtn).addClass("btn-info");
	 }

	 function positionSuccess(position){
	 	fromCoords = position.coords.latitude + ":" + position.coords.longitude;
	 	fromInput.value = "Moja lokalizacja (dokł. " + position.coords.accuracy + " m)";
	 	useGeo = true;
	 	if(DEBUG) console.log(fromCoords);
		$(locationBtn).removeClass("btn-info");
	 	$(locationBtn).addClass("btn-success");
	 	locationBtn.onclick = disableLocation;
	 	$(fromInput).prop({disabled: true});
	 }

	 function datetimeToggle(){
	 	if ($(nowCheckbox).prop("checked")) {
	 		$(datetimeInput).addClass("hidden");

	 	} else {
	 		$(datetimeInput).removeClass("hidden");
			var dateNow = new Date();
			function pad(n){ return n<10 ? '0'+ n : n };
	 		$(datetimeInput).val("" + dateNow.getFullYear() + "-" + 
	 			pad(dateNow.getMonth()+1) + "-" + pad(dateNow.getDate()) + "T" +
	 		 	pad(dateNow.getHours()) + ":" + pad(dateNow.getMinutes()));
	 	}
	 }

	 (function init(){
		mainForm = document.forms[0];
	 	mainForm.onsubmit = submitForm;
	 	fromInput = mainForm.from;
	 	toInput = mainForm.to;
	 	locationBtn = mainForm.useLoc;
	 	nowCheckbox = mainForm.now;
	 	datetimeInput = mainForm.datetime;
 	    $("#geoDefaultOption").change(setGeoDefault);
	 	nowCheckbox.onclick = datetimeToggle;
	 	locationBtn.onclick = getLocation;
	 	$("#cityMenu a").click(setCity);
	 	chrome.storage.sync.get(["cityId", "cityName", "geoDefault"],
	 		function(o){
	 			if(!chrome.runtime.lastError){
		 				cityId = o.cityId;
		 				$("#cityName").html(cityName = o.cityName);
		 				if(o.geoDefault) {
		 					$("#geoDefaultOption").prop({"checked": true});
		 					getLocation();
		 				}
	 				}else{
	 					console.log(chrome.runtime.lastError.message);
	 				} });
	 })();

})();