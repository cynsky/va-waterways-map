
require(["esri/map"], function(Map) {
	window.map = new Map("map", {
		basemap: "osm",
		center: [-75.97086160156249, 37.89287113281247],
		zoom: 9
	});
});