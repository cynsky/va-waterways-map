
require([
	"esri/map",
	"esri/layers/ArcGISDynamicMapServiceLayer",
	"esri/layers/KMLLayer",
	"esri/layers/ArcGISTiledMapServiceLayer",
	"dojo/domReady!"
	], function(
		Map,
		ArcGISDynamicMapServiceLayer,
		KMLLayer,
		ArcGISTiledMapServiceLayer) {
	window.map = new Map("map", {
		basemap: "osm",
		center: [-75.97086160156249, 37.89287113281247],
		zoom: 9
	});

	// map layers
	map.addLayers([
		// estuaries and hospitals
		new ArcGISDynamicMapServiceLayer("http://deq.virginia.gov/arcgis/rest/services/staff/Estuaries_2012/MapServer",
			{ id: "est", visible: false }),
		// boat ramps
		new KMLLayer("http://www.dgif.virginia.gov/gis/kmz/DGIF_Boating_Access_Sites.kmz",
			{ id: "ramp", visible: false }),
		// imagery
		new ArcGISTiledMapServiceLayer("http://gismaps.vita.virginia.gov/arcgis/rest/services/MostRecentImagery/MostRecentImagery_WGS/MapServer",
			{ id: "imagery", visible: false }),
		//locality boundaries
		new ArcGISTiledMapServiceLayer("http://gismaps.vita.virginia.gov/arcgis/rest/services/VA_Base_layers/Virginia_Localities/MapServer",
			{ id: "localities", visible: false }),
		// nav charts
		new ArcGISDynamicMapServiceLayer("http://egisws02.nos.noaa.gov/ArcGIS/rest/services/RNC/NOAA_RNC/MapServer",
			{ id: "nav", visible: false }),
		// bathymetry
		new ArcGISDynamicMapServiceLayer("http://egisws02.nos.noaa.gov/ArcGIS/rest/services/Estuarine_Bathymetry/NOAA_Estuarine_Bathymetry/MapServer",
			{ id: "bath", visible: true })
		]);
});