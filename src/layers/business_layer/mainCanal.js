// 干渠图层
import Vue from 'vue';
import { backendStatic } from "@/network/static.js";

const arcgisModules = Vue.prototype.$arcgisModules;

export async function mainCanal() {
  let geojson = undefined
  let template = {
    id: "mainCanal",
    title: "干渠",
    renderer: {
      "type": "simple",
      "symbol": {
        type: "simple-line",
        width: 3,
        color: "#0077ff",
      }
    },
    effect: "bloom(1, 0px 0)",
    editingEnabled: true,
    url: undefined,
    geometryType: "polyline",
  }

  await backendStatic("/dist/json/psh_layer/mainCanal.json").then(res => {
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