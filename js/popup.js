require(["js/settings","js/jdCommon"], function (settings, jd) {
    var DEBUG = true;
    var cityId, cityName, fromCoords, fromName, toCoords,
    toName, date, hour, autoSearch, useGeo;
    var fromInput, toInput, locationBtn, nowCheckbox, datetimeInput, mainForm;


    
    function submitForm(){
	toName = toInput.value;
	fromName = fromInput.value;
	if(!($(nowCheckbox).prop("checked"))) {

	    date = jd.getJDDate($(datetimeInput).val());
	    hour = jd.getJDTime($(datetimeInput).val());
	}
	if(cityId) {
	    chrome.tabs.create({url: jd.createJDUrl(cityId, fromCoords, fromName, toCoords,
	  					 toName, date, hour, autoSearch)});
	} else {
	    window.alert("Wybierz miasto.");
	}
	return false;
    }


    function setCity(){
	cityId = $(this).attr("data-cid");
	$("#cityName").html(cityName = $(this).attr("data-name"));
	settings.set({"cityId" : cityId, "cityName" : cityName});
    }

    function setGeoDefault(){
	settings.set({"geoDefault": useGeo});
    }

    function disableLocation(){
	useGeo = false;
	$(locationBtn).removeClass("btn-success");
	locationBtn.onclick = getLocation;
	$(fromInput).prop({disabled: false});
	fromInput.value = "";
	settings.set({"geoDefault": useGeo});
	$(fromInput).focus();
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
	settings.set({"geoDefault": useGeo});
	$(toInput).focus();
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

    function init(){
	mainForm = document.forms[0];
	mainForm.onsubmit = submitForm;
	fromInput = mainForm.from;
	toInput = mainForm.to;
	locationBtn = mainForm.useLoc;
	nowCheckbox = mainForm.now;
	datetimeInput = mainForm.datetime;
 	
	nowCheckbox.onclick = datetimeToggle;
	locationBtn.onclick = getLocation;
	$("#cityMenu a").click(setCity);
    }

    init();
});
