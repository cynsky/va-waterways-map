
require(["lib/suncalc/suncalc.js",
	"esri/tasks/GeometryService",
	"esri/tasks/DistanceParameters",
	"esri/geometry/Point",
	"esri/SpatialReference",
	"dojo/promise/all"], function(SunCalc, GeometryService, DistanceParameters, Point, SpatialReference, all) {

window.getSunTimes = function(lat, lon) {
	return SunCalc.getTimes(new Date(), lat, lon);
};

window.getMoonPhase = function() {
	var phase = SunCalc.getMoonIllumination(new Date()).phase;
	if (phase == 0) {
		return 'New Moon';
	}
	else if (phase > 0 && phase < .25) {
		return 'Waxing Crescent';
	}
	else if (phase = .25) {
		return 'First Quarter';
	}
	else if (phase > .25 && phase < .5) {
		return 'Waxing Gibbous';
	}
	else if (phase = .5) {
		return 'Full Moon';
	}
	else if (phase > .5 && phase < .75) {
		return 'Waning Gibbous';
	}
	else if (phase = 0.75) {
		return 'Last Quarter';
	}
	else {
		return 'Waning Crescent';
	};
};

var geometry = new GeometryService("http://www.deq.virginia.gov/arcgis/rest/services/Utilities/Geometry/GeometryServer");
window.findClosestWeatherStation = function(lat,lon,callback) {
	// extracted from KML
	var stations =
		[{"station": "8638999", "point": new Point(-76.0067, 36.92999999909353, new SpatialReference(4326)) },
		{"station": "8638863", "point": new Point(-76.1133, 36.96669999909319, new SpatialReference(4326)) },
		{"station": "8638511", "point": new Point(-76.4242, 36.96229999909323, new SpatialReference(4326)) },
		{"station": "8632200", "point": new Point(-75.9884, 37.16519999909141, new SpatialReference(4326)) },
		{"station": "8635750", "point": new Point(-76.4644, 37.99609999908444, new SpatialReference(4326)) },
		{"station": "8639348", "point": new Point(-76.3017, 36.77829999909491, new SpatialReference(4326)) },
		{"station": "8632837", "point": new Point(-76.015, 37.53829999908819, new SpatialReference(4326)) },
		{"station": "8638610", "point": new Point(-76.33, 36.94669999909338, new SpatialReference(4326)) },
		{"station": "8638595", "point": new Point(-76.3383, 36.8882999990939, new SpatialReference(4326)) },
		{"station": "8631044", "point": new Point(-75.6858, 37.6077999990876, new SpatialReference(4326)) },
		{"station": "8638614", "point": new Point(-76.32170000000001, 36.98169999909305, new SpatialReference(4326)) },
		{"station": "8637611", "point": new Point(-76.33329999999999, 37.24999999909066, new SpatialReference(4326)) },
		{"station": "8637689", "point": new Point(-76.4783, 37.22669999909088, new SpatialReference(4326)) }];

	var currentPoint = new Point(lon, lat, new SpatialReference(4326));
	var deferreds = [];
	var closest = null;
	for (var i in stations) {
		var station = stations[i];
		var params = new DistanceParameters();
		params.distanceUnit = 9035;
		params.geometry1 = currentPoint;
		params.geometry2 = station.point;
		params.geodesic = true;
		deferreds.push(geometry.distance(params, (function(stationId) {
			// gotta pass the station ID to the inner scope here
			return function(distance) {
				if (closest == null || distance < closest.distance) {
					closest = { stationId: stationId, distance: distance };
				}
			}
		})(station.station)));
	}
	all(deferreds).then(function() { callback(closest); })
};

});