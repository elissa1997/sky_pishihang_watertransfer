// 底图设置 by liuxingyu

import Vue from 'vue';

const arcgisModules = Vue.prototype.$arcgisModules;
const tdtTK = "4267820f43926eaf808d61dc07269beb";

export function baseLayers(map) {
  //天地图影像
  let tdt_img_w = new arcgisModules.WebTileLayer({
    urlTemplate:
      "http://{subDomain}.tianditu.gov.cn/DataServer?T=img_w&x={col}&y={row}&l={level}&tk=" + tdtTK,
    subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
  });

  //天地图影像标注
  let tdt_cia_w = new arcgisModules.WebTileLayer({
    urlTemplate:
      "http://{subDomain}.tianditu.gov.cn/DataServer?T=cia_w&x={col}&y={row}&l={level}&tk=" + tdtTK,
    subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
  });

  // 水系标注与边界
  let AHYX_ZH0717 = new arcgisModules.TileLayer({
    id: 'AHYX_ZH0717',
    title: "水系标注与边界",
    url: "/arcgis/rest/services/AHYX_ZH0717/MapServer",
  })

  //水利综合图
  let AHSL_ZH0717 = new arcgisModules.TileLayer({
    id: 'ahsl_zh',
    title: "水利综合图",
    url: "/arcgis/rest/services/AHSL_ZH0717/MapServer",
    copyright: "水科院"
  })

  const sl_zh = new arcgisModules.GroupLayer({id: "sl_zh", title: "水利综合", visible: true});
  const slImg = new arcgisModules.GroupLayer({id: "slImg", title: "水利影像", visible: false});

  sl_zh.addMany([AHSL_ZH0717]);
  slImg.addMany([tdt_img_w, tdt_cia_w, AHYX_ZH0717]);

  let baseLayers = [slImg, sl_zh];
  return baseLayers;
}