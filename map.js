require([
	"esri/map",
	"esri/layers/ArcGISDynamicMapServiceLayer",
	"esri/layers/KMLLayer",
	"esri/layers/ArcGISTiledMapServiceLayer",
	"esri/layers/FeatureLayer",
	"esri/dijit/OverviewMap",
	"esri/geometry/Point",
	"esri/InfoTemplate",
	"esri/geometry/webMercatorUtils",
	"dojo/query",
	"dojo/domReady!"
	], function(
		Map,
		ArcGISDynamicMapServiceLayer,
		KMLLayer,
		ArcGISTiledMapServiceLayer,
		FeatureLayer,
		OverviewMap,
		Point,
		InfoTemplate,
		webMercatorUtils,
		query) {
	window.map = new Map("map", {
		basemap: "osm",
		center: [-75.97086160156249, 37.89287113281247],
		zoom: 9
	});

	// save center & zoom
	map.on('extent-change', function (obj) {
		if ('localStorage' in window) {
			localStorage['deq.extent'] = JSON.stringify({ center: obj.extent.getCenter(), zoom: map.getZoom() });
		}
	})

	// loading spinner
	var loadingTimeout = 0;
	dojo.connect(map, "onUpdateStart", function() {
		clearTimeout(loadingTimeout);
		loadingTimeout = setTimeout(function() {
			query('#loading').style('display', 'inline');
		}, 500);
	});
	dojo.connect(map, "onUpdateEnd", function() {
		clearTimeout(loadingTimeout);
		query('#loading').style('display', 'none');
	});

	var overviewMapDijit = new OverviewMap({
	    map: window.map,
	    attachTo: "bottom-left",
	    color:" #D84E13",
	    opacity: .40,
	    width: 200,
	    height:200,
	    visible: true
	    
	    });

	overviewMapDijit.startup();
	if ('matchMedia' in window) {
		var mq = window.matchMedia('(max-width: 600px)');
		if (mq.matches) overviewMapDijit.hide(); else overviewMapDijit.show();
		mq.addListener(function(evt) {
			if (mq.matches) overviewMapDijit.hide(); else overviewMapDijit.show();
		});
	}
	else overviewMapDijit.show();

	// map layers
	map.addLayers([
		// hospitals
		new FeatureLayer("http://deq.virginia.gov/arcgis/rest/services/staff/Estuaries_2012/MapServer/0",
			{ id: "hosp", visible: false, outFields: ["HOSP_NAME", "PHYS_ST_1", "PHYS_CITY", "WEBSITE"] }),
		// estuaries
		new FeatureLayer("http://deq.virginia.gov/arcgis/rest/services/staff/Estuaries_2012/MapServer/1",
			{ id: "est", visible: false, outFields: ["WATER_NAME", "LOCATION", "AQUA_LIFE", "FISH_CONSU", "RECREATION", "SHELLFISH", "ID305B"] }),
		// boat ramps
		new KMLLayer("http://tonygambone.org/va-waterways-map/data/DGIF_Boating_Access_Sites_custom_2.kmz",
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
			{ id: "road", visible: false }),
		// Current RIDGELINE Radar Data
		new ArcGISDynamicMapServiceLayer("http://gis.srh.noaa.gov/arcgis/rest/services/RIDGERadar/MapServer",
			{ id: "radar", visible: false, refreshInterval: 5 }),
		// tide predictions
		new KMLLayer("http://tonygambone.org/va-waterways-map/data/coops-tidepredictions_2.kmz",
			{ id: "tide", visible: false })
		]);

	// popups
	var estTemplate = new InfoTemplate();
	estTemplate.setTitle("Estuary Segment");
	estTemplate.setContent('<p><strong>${WATER_NAME}</strong></p><p>${LOCATION}</p><ul class="infoTemplate"><li><strong>Aquatic Life:</strong> ${AQUA_LIFE}</li><li><strong>Fish Consumption:</strong> ${FISH_CONSU}</li><li><strong>Recreation:</strong> ${RECREATION}</li><li><strong>Shellfish:</strong> ${SHELLFISH}</li><a href=http://www.deq.virginia.gov/FS2012/FactSheets.aspx?id=${ID305B}&style=1 target=_blank >Fact Sheet</a>');
	map.getLayer("est").infoTemplate = estTemplate;
	var hospTemplate = new InfoTemplate();
	hospTemplate.setTitle("Hospital");
	hospTemplate.setContent('<p><strong>${HOSP_NAME}</strong></p><p>${PHYS_ST_1}<br>${PHYS_CITY}</p>${WEBSITE:formatWebsite}');
	map.getLayer("hosp").infoTemplate = hospTemplate;
	var roadTemplate = new InfoTemplate();
	roadTemplate.setTitle("Road Project");
	roadTemplate.setContent('<p><strong>Status:</strong> ${PROJECT_PHASE:formatProjectPhase}</p>');
	map.getLayer("road").infoTemplate = roadTemplate;

	// default popup, only show if the base map graphic is the event target
	map.on('click', function(evt) { if (evt.target == query('svg#map_gc')[0]) {
		var latitude = evt.mapPoint.getLatitude().toFixed(5);
		var longitude = evt.mapPoint.getLongitude().toFixed(5);
		var sunTimes = getSunTimes(latitude, longitude);
		var moonPhase = getMoonPhase();
		map.infoWindow.setTitle("Map Location");
		findClosestWeatherStation(latitude, longitude, function(closest) {
			map.infoWindow.setContent('<p><strong>Coordinates:</strong> ' + latitude + ', ' + longitude + '<br>' +
								'<strong>Sunrise:</strong> ' + moment(sunTimes.sunrise).format('h:mm a') + '<br>' +
								'<strong>Sunset:</strong> ' + moment(sunTimes.sunset).format('h:mm a') + '<br>' + 
								'<strong>Moon Phase:</strong> ' + moonPhase + '</p>' +
								'<p><strong>Closest Weather Station:</strong> ' + closest.stationId + '<br>' +
								'<strong>Distance to Weather Station:</strong> ' + closest.distance.toFixed(2) + ' miles</p>');
		});
		// show spinner initially
		map.infoWindow.setContent('<div style="text-align: center;"><img src="ajax-loader.gif"></div>');
		map.infoWindow.show(evt.mapPoint, map.getInfoWindowAnchor(evt.screenPoint));
	}});

	// restore saved position or set geolocated position
	if ('localStorage' in window && localStorage['deq.extent'] != null) {
		try {
			var extent = JSON.parse(localStorage['deq.extent']);
			map.centerAndZoom(extent.center, extent.zoom);
		} catch (e) { localStorage.remove('deq.extent'); }
	} else if ('geolocation' in navigator) {
		navigator.geolocation.getCurrentPosition(function (pos) {
			window.map.centerAndZoom(new Point(pos.coords.longitude, pos.coords.latitude), 12);
		});
	}
});

var formatWebsite = function(value, key, data) {
	if (!value || value.length == 0) return "";
	if (value.indexOf("http") != 0) { value = "http://" + value; }
	return '<p><a href="' + value + '" target="_blank">Visit website</a></p>';
};

var formatProjectPhase = function(value, key, data) {
	var parts = value.split(" ");
	for (var i in parts) {
		parts[i] = parts[i].substring(0,1) + parts[i].substring(1).toLowerCase();
	}
	return parts.join(" ");
};
