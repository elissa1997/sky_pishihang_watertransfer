// 干渠图层
import Vue from 'vue';
import { backendStatic } from "@/network/static.js";

const arcgisModules = Vue.prototype.$arcgisModules;

export async function gate() {
  let geojson = undefined
  let template = {
    id: "gate",
    title: "水闸",
    labelsVisible: true,
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
  }

  await backendStatic("/dist/json/psh_layer/gate.json").then(res => {
    geojson = res;
  })

  const blob = new Blob([JSON.stringify(geojson)], {
    type: "application/json"
  });
  const blobUrl = URL.createObjectURL(blob);
  template.url = blobUrl;

  let layer = new arcgisModules.GeoJSONLayer(template);
  return layer;

}