// geocoding setup
require(["esri/tasks/locator", "esri/SpatialReference", "esri/geometry/Point", "dojo/query", "dojo/domReady!"],
function(Locator, SpatialReference, Point, query) {
  window.locator = new Locator("http://gismaps.vita.virginia.gov/arcgis/rest/services/Geocoding/VGIN_Composite_Locator/GeocodeServer");
  locator.spatialReference = new SpatialReference({ wkid: 4326 });
  locator.on("address-to-locations-complete", function(obj) {
    // obj is e.g. { addresses: [...] }
    // each address is { address: "...", location: { type: point, x: -77..., y: 37... }, score: 100 }
    if (obj.addresses && obj.addresses.length > 0) {
      for (var i in obj.addresses) {
        var addr = obj.addresses[i];
        if (addr.score > 90) {
          console.log(addr.address);
          map.centerAndZoom(new Point(addr.location.x, addr.location.y), 14);  
          map.graphics.clear();
          var mapcross = new esri.symbol.PictureMarkerSymbol('images/map_cross.png', 31, 31);
          var graphic = new esri.Graphic(map.extent.getCenter(), mapcross);
          //graphic.id = "cr";
          map.graphics.add(graphic);
          break;
        }
      }
    }
    else {alert("No valid address found")};
    console.log(obj);
  });

  

  query('#search').connect('onkeypress', function(evt) {
    var e = evt || window.event;
    if (e.keyCode == 13) { locator.addressToLocations({ SingleLine: this.value }); }
  });
});