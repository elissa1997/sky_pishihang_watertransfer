<template>
  <div id="gis2d">
    <div class="mapView" id="mapView"></div>

    <template v-if="map">
      <baseLayerSwitch :map="map" @openOverviewLive="openOverviewLive"/>
    </template>
  </div>
</template>

<script>
import baseLayerSwitch from "@/components/mapTool/baseLayerSwitch.vue";
import { baseLayers } from "@/layers/baseLayer.js";
import { layerTest } from "@/layers/layerAgent.js";
export default {
  name: "gis2d",
  props: {},
  components: {
    baseLayerSwitch
  },
  data() {
    return {
      map: undefined,
      view: undefined,
    }
  },
  methods: {
    // 初始化创建地图
    async createdView() {
      let tileInfo = this.$arcgisModules.TileInfo.create({
        spatialReference: {wkid: 4326},
        numLODs: 20
      });

      this.map = new this.$arcgisModules.Map({
        basemap: new this.$arcgisModules.Basemap({
          baseLayers: baseLayers(),
          title: "底图",
          id: "base",
        })
      }),

      this.view = new this.$arcgisModules.MapView({
        map: this.map,
        container: "mapView",
        showLabels: true,
        center: [116.7003513,31.9709783],
        // extent: anHuiExtents,
        // spatialReference: {
        //   wkid: 102100
        // },
        zoom: 10,
        constraints: {
          lods: tileInfo.lods,
          minZoom: 10,
          maxZoom: 18,
          rotationEnabled: false
        },
        popup: {
          collapseEnabled : false, // 移除title点击折叠功能
          dockOptions: {
              buttonEnabled: false // 隐藏固定标签页
          },
          actions: [] // 清空事件按钮 （缩放至、...）
        }
      });
  
      await this.view.when(async () => {
        this.$message.success('地图加载完成');
        layerTest(this.map);
        // loadDefaultLayers(this.map, this.view);
        // this.featureClick();
      })

      this.view.ui.remove("zoom"); //清除放大缩小按钮
      this.view.ui.remove("attribution"); //清除底部powered by ESRI

      this.view.on("pointer-down", () => {
        
      });
    },

    // 打开实时概化图
    openOverviewLive() {
      // this.openModal("实时概化图", null, "overViewLive");
    },

    
  },
  mounted() {
    this.createdView();
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
  #gis2d {
    position: relative;
    overflow-x: hidden;
  }

  .mapView {
    width: 100%;
    height: calc(100vh - 70px);
  }
</style>