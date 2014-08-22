// run addFishLayer(map) to render this
function addFishLayer(map) {
require(
	["dojo/_base/xhr", "dojo/_base/array", 
	"esri/layers/GraphicsLayer",
	"esri/graphic",
	"esri/symbols/SimpleMarkerSymbol",
	"esri/InfoTemplate",
	"esri/geometry/Point",
	"dojo/domReady!"], function(xhr, array, GraphicsLayer, Graphic, SimpleMarkerSymbol, InfoTemplate, Point) {
		window.dojoArray = array;
		window.TK = null; // this appears in some of the files

		var gl = new GraphicsLayer();
		var infoTemplate = new InfoTemplate();
		infoTemplate.setTitle("Fish Info");
		infoTemplate.setContent('<p><strong>${NAME}</strong></p>' +
			'<p><strong>Identification:</strong> ${IDENT}</p>' +
			'<p><strong>Techniques:</strong> ${TECHNIQUES}</p>' +
			'${IMAGE:formatImage}');
		gl.infoTemplate = infoTemplate;

		xhr.get({
			url: 'data/gnis_places.txt', handleAs: 'json',
			load: function(data) {
				window.gnis = data;
			}
		}).then(function() {
			xhr.get({
				url: 'data/black_crappie.txt', handleAs: 'json',
				load: function(data) {
					addSymbols(data[0]);
				}
			});
			xhr.get({
				url: 'data/white_crappie.txt', handleAs: 'json',
				load: function(data) {
					addSymbols(data[0]);
				}
			});
			xhr.get({
				url: 'data/largemouth_bass.txt', handleAs: 'json',
				load: function(data) {
					addSymbols(data[0]);
				}
			});
		});

		map.addLayers([gl]);

		function addSymbols(obj, name) {
			var latLons = getLatLons(obj);
			for (var i in latLons) {
				var p = latLons[i];
				var g = new Graphic(new Point(p.x, p.y),
					new SimpleMarkerSymbol().setSize(20));
				g.setAttributes({ 
					NAME: obj.species.name, 
					IDENT: obj.species.identification, 
					TECHNIQUES: obj.fishing_techniques,
					IMAGE: obj.species.images.length > 0 ? obj.species.images[0].url : null });
				gl.add(g);
			}
		}

		function getGnisIds(obj) {
			var ids = [];
			for (var i in obj.best_fishing.lakes) {
				var id = obj.best_fishing.lakes[i].gnis_id;
				if (id) ids.push(id);
			}
			for (var i in obj.best_fishing.rivers) {
				var id = obj.best_fishing.rivers[i].gnis_id;
				if (id) ids.push(id);
			}
			return ids;
		}

		function getLatLons(obj) {
			return getGnisIds(obj).map(function(el) {
				for (var i in gnis) {
					var g = gnis[i];
					if (g.feature_id == el) return { x: g.prim_long_dec, y: g.prim_lat_dec };
				}
				return null;
			});
		}
	});
}

function formatImage(str) {
	if (str == null) return "";
	return '<img src="' + str + '">';
}