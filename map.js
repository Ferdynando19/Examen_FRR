var map;
var serviceAreaTask;
var clickpoint;

require(["esri/map",
    "esri/geometry/Extent",
    "dojo/on",
    "esri/layers/FeatureLayer",
    "esri/tasks/ServiceAreaTask", "esri/tasks/ServiceAreaParameters", "esri/tasks/FeatureSet",
    "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol",
    "esri/geometry/Point", "esri/graphic",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/tasks/FeatureSet",
    "dojo/domReady!"],
    function (
        Map,
        Extent,
        on,
        FeatureLayer,
        ServiceAreaTask, ServiceAreaParameters, FeatureSet,
        SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
      Point, Graphic, Query, QueryTask, FeatureSet){

        map = new Map("map", {
            basemap: "topo",
            center: [-3.658438,40.414340],
            zoom: 12,
            sliderStyle: "small"
            });

        var hospitales = new FeatureLayer("https://services5.arcgis.com/zZdalPw2d0tQx8G1/ArcGIS/rest/services/CENTROS_SALUD_FRR/FeatureServer/0",{
            outFields: ["*"],
            });

        map.addLayers([hospitales]);
        var queryTask = new QueryTask("https://services5.arcgis.com/zZdalPw2d0tQx8G1/ArcGIS/rest/services/CENTROS_SALUD_FRR/FeatureServer/0");


        var queryPoints = new Query();
        queryPoints.where = '1 = 1';
        hospitales.selectFeatures(queryPoints);

        hospitales.on('selection-complete', saveCentros)

        
        function saveCentros(result) {
        console.log(result)

        params = new ServiceAreaParameters();
        params.defaultBreaks= [3];
        params.outSpatialReference = map.spatialReference;
        params.returnFacilities = true;
        params.impedanceAttributeName = "WalkTime"
        params.facilities = featureSet
        serviceAreaTask = new ServiceAreaTask("https://formacion.esri.es/server/rest/services/RedMadrid/NAServer/Service%20Area");

        serviceAreaTask.solve(params,function(solveResult){
                var polygonSymbol = new SimpleFillSymbol(
                "solid",
                new SimpleLineSymbol("solid", new Color([232,104,80]), 2),
                new Color([232,104,80,0.25])
                );
              
                arrayUtils.forEach(solveResult.serviceAreaPolygons, function(serviceArea){
                serviceArea.setSymbol(polygonSymbol);
                map.graphics.add(serviceArea);
              });
            });

    

        };
  
});

