Virginia Waterways Trip Planner
===============================

This is a web & mobile app for fishermen and other recreational and commercial users of Virginia waterways. It presents
relevant info, such as weather & tide data, navigational maps, points of interest, and links to other sources, in a map
format.

It was developed by a team from the [Virginia Department of Environmental Quality](http://www.deq.virginia.gov/) for the Commonwealth Datathon on August
21-22, 2014.

The live application is [hosted on GitHub](http://tonygambone.github.io/va-waterways-map/).

Data Sources
------------

* [VGIN ESRI address geocoding service](http://gismaps.vita.virginia.gov/arcgis/rest/services/Geocoding)
* [DEQ ESRI geometry service](http://www.deq.virginia.gov/arcgis/rest/services/Utilities/Geometry/GeometryServer)
* [Open Street Map](http://www.openstreetmap.org/) base layer
* [DEQ water assessments estuary layer](http://www.deq.virginia.gov/connectwithdeq/vegis/vegisdatasets.aspx)
* Virginia hospitals data layer (TODO: source?)
* [VDGIF Maintained Boating Access Locations](http://www.dgif.virginia.gov/boating/access/), 8/21/2014, Virginia Department of Game and Inland Fisheries
* [VGIN aerial imagery layer](http://gismaps.vita.virginia.gov/arcgis/rest/services/MostRecentImagery)
* [VGIN locality boundaries layer](http://gismaps.vita.virginia.gov/arcgis/rest/services/VA_Base_layers/Virginia_Localities/MapServer)
* [NOAA marine navigational charts layer](http://egisws02.nos.noaa.gov/ArcGIS/rest/services/RNC/NOAA_RNC/ImageServer)
* [NOAA estuarine bathymetry layer](http://egisws02.nos.noaa.gov/ArcGIS/rest/services/Estuarine_Bathymetry/NOAA_Estuarine_Bathymetry/MapServer)
* [VDOT road construction projects data layer](http://gis.vdot.virginia.gov/arcgis/rest/services/varoads/VARoads/FeatureServer)
* [NOAA RIDGE weather radar layer](http://gis.srh.noaa.gov/arcgis/rest/services/RIDGERadar/MapServer)
* [NOAA CO-OPS tide stations layer](http://tidesandcurrents.noaa.gov/googleearth.html)

It also uses the [SunCalc](https://github.com/mourner/suncalc) javascript library for determining moon phase and
sunrise/sunset times.

Team members
------------

* Bobby Whittemore, DEQ
* John Tragesser, DEQ
* Peter Meiller, DEQ
* Tony Gambone, DEQ
* Zach Kaplan, [FIRST Robotics Team 1086 Blue Cheese](http://www.bluecheese1086.org/)

