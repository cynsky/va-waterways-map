require([
	"esri/map",
	"esri/layers/ArcGISDynamicMapServiceLayer",
	"esri/layers/KMLLayer",
	"esri/layers/ArcGISTiledMapServiceLayer",
	"esri/layers/FeatureLayer",
	"esri/dijit/OverviewMap",
	"esri/geometry/Point",
	"dojo/domReady!"
	], function(
		Map,
		ArcGISDynamicMapServiceLayer,
		KMLLayer,
		ArcGISTiledMapServiceLayer,
		FeatureLayer,
		OverviewMap,
		Point) {
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
			{ id: "bath", visible: false }),
		// VDOT road projects
		new FeatureLayer("http://gis.vdot.virginia.gov/arcgis/rest/services/varoads/VARoads/FeatureServer/1",
			{ id: "road", visible: false })
		]);
	
	// geolocation
	if ('geolocation' in navigator) {
		navigator.geolocation.getCurrentPosition(function (pos) {
			window.map.centerAt(new Point(pos.coords.longitude, pos.coords.latitude));
		});
	}
});