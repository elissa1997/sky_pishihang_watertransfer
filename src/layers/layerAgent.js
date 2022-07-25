import Vue from 'vue';
import { mainCanal } from "@/layers/business_layer/mainCanal.js";
import { gate } from "@/layers/business_layer/gate.js";

export async function layerTest(map) {
  map.add(await mainCanal());
  map.add(await gate());
  // console.log(await mainCanal());
}


const layerObj = {
  gate: {layer: gate, index: 100},
};

export async function handlerLayerByTree(map, view, checkKeys, allLayerId){
  for (let index = 0; index < allLayerId.length; index++) {
    const id = allLayerId[index];
    let isChecKeys = checkKeys.find(layer => layer.layerId == id)
    let isLoadOnMap = map.findLayerById(id);
    if (isChecKeys) {
      // 已勾选 提交测试
      if (!isLoadOnMap) {
        // 地图未加载该图层，先加载图层 
        let layer = await gate();
        let index = layerObj[id].index;
        map.add(layer, index);
      }else{
        // 地图已加载该图层，visible设为true
        isLoadOnMap.visible = true;
      }
      isLoadOnMap = map.findLayerById(id);
      view.whenLayerView(isLoadOnMap).then(function (layerView) {
        layerView.filter = {
          objectIds: isChecKeys.fid
        }
      });
      // 根据fid更新要素
    }else{
      // 未勾选
      if (isLoadOnMap) {
        // 地图已加载该图层，visible设为false
        isLoadOnMap.visible  = false;
      }else{
        // 地图未加载该图层，不操作
      }
    }
  }
  // map.reorder(map.findLayerById("mainCanal"), 1);
}