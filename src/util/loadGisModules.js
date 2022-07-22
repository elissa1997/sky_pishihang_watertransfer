
import { loadModules } from 'esri-loader'
export async function initArcGisJs() {
  let moduleJsPath = [
    "esri/Basemap",
    "esri/Map",
    "esri/WebMap",
    'esri/views/MapView',
    "esri/core/watchUtils",
    "esri/core/promiseUtils",
    "esri/geometry/support/webMercatorUtils",
    "esri/identity/IdentityManager",
    "esri/geometry/Polyline",
    "esri/geometry/Point",
    "esri/geometry/Extent",
    "esri/layers/TileLayer",
    "esri/layers/GeoJSONLayer",
    "esri/layers/GraphicsLayer",
    "esri/layers/ElevationLayer",
    "esri/layers/BaseElevationLayer",
    "esri/layers/BaseDynamicLayer",
    "esri/layers/FeatureLayer",
    "esri/layers/GroupLayer",
    "esri/layers/WebTileLayer",
    "esri/layers/support/LabelClass",
    "esri/layers/support/TileInfo",
    "esri/views/2d/layers/BaseLayerViewGL2D",
    "esri/geometry/Circle",
    "esri/symbols/TextSymbol",
    "esri/symbols/ExtrudeSymbol3DLayer",
    "esri/symbols/SimpleFillSymbol",
    "esri/Graphic",
    "esri/layers/support/TileInfo",
    "esri/Camera",
    "esri/config",
    "esri/request",
    "dojo/on",
    "dojo/domReady!"
  ]
  let moduleNames = moduleJsPath.map(path => (path.match('[^/]+(?!.*/)')[0]));
  let options = {
    url: "http://10.34.0.118:8081/dist/arcgis/4.19/init.js",
    css: "http://10.34.0.118:8081/dist/arcgis/4.19/esri/css/main.css"
    // url: "https://js.arcgis.com/4.20/",
    // css:"https://js.arcgis.com/4.20/esri/themes/light/main.css",
  };
  let arcgisModules = await loadModules(moduleJsPath, options);

  let modules = {};
  moduleNames.forEach((key, index) => {
    modules[key] = arcgisModules[index]
  });
  //设置配置
  // 私有化字体
  modules.config.fontsUrl = "http://10.34.0.115:8383/dist/fonts";
  return modules
}
