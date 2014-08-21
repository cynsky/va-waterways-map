
require(["esri/map", "esri/dijit/OverviewMap"], function(Map, OverviewMap) {
	window.map = new Map("map", {
		basemap: "osm",
		center: [-75.97086160156249, 37.89287113281247],
		zoom: 9
	});
	var overviewMapDijit = new OverviewMap({
	    map: window.map,
	    attachTo: "bottom-right",
	    color:" #D84E13",
	    opacity: .40,
	    width: 250,
	    height:250
	});
	overviewMapDijit.startup();
	overviewMapDijit.show();
});