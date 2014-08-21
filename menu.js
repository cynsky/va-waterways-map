
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
	for (var i in map.layerIds) {
		var id = map.layerIds[i];
		if (id == layerId) map.getLayer(id).show();
		else if (id != "layer0") map.getLayer(id).hide();
	}
	for (var i in map.graphicsLayerIds) {
		var id = map.graphicsLayerIds[i];
		if (id == layerId || id.indexOf(layerId) == 0) map.getLayer(id).show();
		else map.getLayer(id).hide();
	}
}