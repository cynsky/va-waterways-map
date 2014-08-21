
require(["dojo/query",
	"dojo/dom-attr",
	"dojo/domReady!"],
function(query, domAttr) {
	// show/hide menu
	var menuShown = false;
	query('#menuBtn').connect('onclick', function() {
		query('#menu').style('display', menuShown ? 'none' : 'block');
		menuShown = !menuShown;
	});

	// menu buttons
	query('button[data-layer]').connect('onclick', function() {
		showLayer(domAttr.get(this, 'data-layer'));
		query('#menu').style('display', 'none');
		menuShown = false;
	});
});

function showLayer(layerId) {
	var parts = layerId.split("-");
	for (var i in map.layerIds) {
		var id = map.layerIds[i];
		if (id == parts[0]) {
			map.getLayer(id).show();
			if (parts.length > 1)
				map.getLayer(id).setVisibleLayers([parts[1]]);
		}
		else if (id != "layer0") map.getLayer(id).hide();
	}
	for (var i in map.graphicsLayerIds) {
		var id = map.graphicsLayerIds[i];
		if (id == parts[0] || id.indexOf(parts[0]) == 0) map.getLayer(id).show();
		else map.getLayer(id).hide();
	}
}