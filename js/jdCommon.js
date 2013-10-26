// common functions for jakdojade.pl GET API queries
define({
    createJDUrl: function(o){
	var url = "http://jakdojade.pl/?";
	url += "cid=" + o.cityId + "&";
	if(o.useGeo) url += "fc=" + o.fromCoords + "&";
	if(o.fromName) url += "fn=" + encodeURI(o.fromName) + "&";
	if(o.toCoords) url += "tc=" + o.toCoords + "&";
	if(o.toName) url += "tn=" + encodeURI(o.toName) + "&";
	if(o.hour) url += "h=" + o.hour + "&";
	if(o.date) url += "d=" + o.date + "&";
	if(o.autoSearch) url += "as=" + o.autoSearch;

	return url;
    },

    getJDDate: function(datetime){
	// YYYY-MM-DD T   H  H  :  M  M
	// 0123456789 10  11 12 13 14 15
	// uhh
	return "" + datetime.substr(8,2) + "." + datetime.substr(5,2) + "." +
	    datetime.substr(2,2);
    },

    getJDTime: function(datetime){
	return "" + datetime.substr(11,2) + ":" + datetime.substr(14,2);
    }
});
