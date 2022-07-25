// 干渠图层
import Vue from 'vue';
import { backendStatic ,frontStatic } from "@/network/static.js";

const arcgisModules = Vue.prototype.$arcgisModules;
let layer;
export async function gate() {
  let geojson = undefined
  let template = {
    id: "gate",
    title: "水闸",
    labelsVisible: true,
    visible:true,
    labelingInfo: {
      "labelExpressionInfo": {
        expression: "$feature.NAME"
      },
      "labelPlacement": "below-center",
        "symbol": {
        "type": "text",
        "color": "black",
        "haloSize": 1,
        "haloColor": "#ffffff",
        "font": {"size": 12}
      }
    },
    renderer: {
      "type": "simple",
      "symbol": {
        "type": "picture-marker",
        "url": "/dist/icon/waterGate_red_128.svg",
        "width": 15,
        "height": 15
      },
      "visualVariables": [
        {
        "type": "rotation",
        "field": "angle",
        "rotationType": "geographic"
        }
      ]
    },
    // effect: "bloom(1, 0px 0)",
    editingEnabled: true,
    url: undefined,
    geometryType: "point",
    fields: [
      {"name": "OBJECTID", "type": "oid"},
      {"name": "NAME", "type": "string"},
      {"name": "YSMC", "type": "string"},
      {"name": "CODE", "type": "string"},
      {"name": "GDB_FROM_D", "type": "string"},
      {"name": "GDB_TO_DAT", "type": "string"},
      {"name": "YSBM", "type": "string"},
      {"name": "LOCATION", "type": "string"},
    ],
    outFields: ["*"],
    objectIdField:"OBJECTID"
    
  }

  if(!layer){
     await backendStatic("dist/json/psh_layer/gate.json").then(res => {
      geojson = res;
    })
    const blob = new Blob([JSON.stringify(geojson)], {
      type: "application/json"
    });
    const blobUrl = URL.createObjectURL(blob);
    template.url = blobUrl;
    !layer && (layer = new arcgisModules.GeoJSONLayer(template));
  }
  return layer;

}