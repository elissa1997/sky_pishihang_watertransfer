<template>
  <div id="layerTree" :class="{ isCollapse: collapse }">
    <div class="head">
      <span class="title">图层控制</span>
      <component 
        @click="collapse = !collapse"
        :is="!collapse ? 'icon-menu-unfold-one' : 'icon-menu-fold-one'"
        theme="outline"
        size="24"
        fill="#099e07"
        :strokeWidth="3"
      />
    </div>

    <div class="tree" v-if="treeData">
      <a-tree
        show-icon
        checkable
        :tree-data="treeData"
        :defaultCheckedKeys="defaultKeys"
        @check="treeCheck"
        @select="treeClick"
      >
        <!--  <img slot="gate"  src="/dist/icon/riverPath_blue_128.svg">
        <img slot="gate"  src="/dist/icon/riverPath_blue_128.svg">
        <img slot="gate"  src="/dist/icon/pumpStation_red_128.svg"> -->
        <img slot="gate" src="/dist/icon/waterGate_red_128.svg" />
        <!-- <img slot="gate"  src="/dist/icon/waterGate_purple_110.svg">
        <img slot="gate"  src="/dist/icon/waterGate_gray_100.svg">
        <img slot="gate"  src="/dist/icon/culvert_yellow_100.svg">
        <img slot="gate"  src="/dist/icon/lake_blue_128.svg">
        <img slot="gate"  src="/dist/icon/videoStation_128.svg">
        <img slot="gate"  src="/dist/icon/hydraulic_facility_128.svg"> -->
      </a-tree>
    </div>
  </div>
</template>

<script>
import { Button, Tree } from "ant-design-vue";
import { frontStatic } from "@/network/static.js";
import { handlerLayerByTree } from "@/layers/layerAgent.js";

export default {
  name: "layerTree",
  components: { AButton: Button, ATree: Tree },
  props: {
    view: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      collapse: false,
      treeData: undefined,
      defaultKeys: undefined,

      regex: {
        layer: /^\w+/,
        layerAndfid: /\w+-FID\d+/,
      },
    };
  },

  methods: {
    async getTreeData() {
      await frontStatic("/json/Pishihang_transfer_tree.json").then((res) => {
        this.treeData = res.treeData;
        this.defaultKeys = res.defaultCheck;
      });
    },

    // 勾选操作
    treeCheck(checkedKeys, e) {
      let checkedTree = [];
      let allCheck = [...checkedKeys, ...e.halfCheckedKeys];
      // 先筛选图层选项
      allCheck.map((elem) => {
        if (!this.regex.layerAndfid.exec(elem) && this.regex.layer.exec(elem)) {
          checkedTree.push({ layerId: elem, fid: [] });
        }
      });

      // 再将要素选项放入图层fid
      allCheck.map((elem) => {
        if (this.regex.layerAndfid.exec(elem)) {
          checkedTree.map((layer) => {
            if (layer.layerId == elem.replace(/-FID\d+/s, ``)) {
              layer.fid.push(Number(elem.replace(/\w+-FID/s, ``)));
            }
          });
        }
      });
      let allLayerId = this.getAllLayerId();
      handlerLayerByTree(this.view.map, this.view, checkedTree, allLayerId);
    },

    // 默认勾选
    defaultCheck() {
      let checkedTree = [];
      this.defaultKeys.forEach((key) => {
        let checkFid = [];
        this.treeData.map((layer) => {
          if (layer.key == key) {
            checkFid = layer.children.map((feature) => {
              return Number(feature.key.replace(/\w+-FID/s, ``));
            });
          }
        });
        checkedTree.push({ layerId: key, fid: checkFid });
      });
      let allLayerId = this.getAllLayerId();
      handlerLayerByTree(this.view.map, this.view, checkedTree, allLayerId);
    },

    // 获取树中所有图层id
    getAllLayerId() {
      let regex = /^\w+$/m;
      let allLayerId = [];
      // 递归搜索图层id
      let parseTreeJson = function (treeNodes) {
        if (!treeNodes || !treeNodes.length) return;
        for (let i = 0, len = treeNodes.length; i < len; i++) {
          let childs = treeNodes[i].children;
          if (regex.exec(treeNodes[i].key)) {
            allLayerId.push(treeNodes[i].key);
          }
          if (childs && childs.length > 0) {
            parseTreeJson(childs);
          }
        }
      };

      parseTreeJson(this.treeData);
      return allLayerId.sort();
    },

    // 树点击
    treeClick(selectedKeys, e) {
      let select = selectedKeys[0];
      let regex = /(\w+-FID)|(sz)|(hb)|(bb)/m;
      if (regex.exec(select)) {
        let featurePointRegex = /\w+-FID\d+/m;
        if (featurePointRegex.exec(select)) {
          // 要素点点击
          let layerId = select.replace(/-FID\d+/s, ``);
          let fid = select.replace(/\w+-FID/s, ``);
          this.goToTarget({
            type: "featurePoint",
            info: {
              layerId,
              fid,
            },
          });
        } else {
          // 地区点击
          this.goToTarget({
            type: "area",
            info: select,
          });
        }
      }
    },
    // 跳转到具体位置
    goToTarget(data) {
      let type = data.type;
      let info = data.info;
      if (type === "featurePoint") {
        let layer = this.view.map.findLayerById(info.layerId);
        if (layer) {
          let that = this;
          // whenLayerView
          let queryInfo = layer.createQuery();
          queryInfo.where = `OBJECTID = ${info.fid}`;
          layer.queryFeatures(queryInfo).then((res) => {
            this.view.goTo(
              {
                target: res.features[0].geometry,
                zoom: 14,
              },
              {
                duration :1000
              }
            );
          });
        } else {
          this.$message.warning("此图层还未加载，请先勾选此图层任意项目");
        }
      } else {
        let geometry = centerList(id);
        this.view.goTo({
          target: geometry,
          zoom: 12,
        });
      }
    },
  },

  created() {},
  async mounted() {
    await this.getTreeData();
    this.defaultCheck();
  },
};
</script>

<style lang="scss" scoped>
#layerTree {
  @include grossGlass;
  @include boxShadow;
  @include animation_cubic-bezier;

  // padding: 10px 0px;
  border-radius: 5px;
  position: absolute;
  top: 100px;
  left: 10px;
  // min-width: 300px;
  width: 300px;
}

.isCollapse {
  width: 159px !important;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  border-bottom: 0.5px solid #00000017;

  .title {
    font-size: 17px;
    font-weight: 700;
    color: $mainColor;
  }
}

.tree {
  padding: 5px 10px;
  max-height: calc(100vh - 70px - 100px - 37px - 10px);
  overflow-y: auto;

  img {
    height: 17px;
    margin-right: 5px;
  }
}
</style>