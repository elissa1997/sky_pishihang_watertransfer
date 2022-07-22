import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Dayjs
import dayjs from "dayjs";
import dayOfyear from 'dayjs/plugin/dayOfYear';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(dayOfyear)
dayjs.extend(customParseFormat)
// echarts
import * as echarts from 'echarts';
// 字节跳动IconPark图标库
import {install} from '@icon-park/vue/es/all';
// ArcGIS库
import { initArcGisJs } from "@/util/loadGisModules";
// Ant Design组件库全局提示
import { message } from 'ant-design-vue';

Vue.config.productionTip = false

const initParamsStart = async () => {
  try {
    Vue.prototype.$arcgisModules = await initArcGisJs();
    Vue.prototype.$message = message;
    Vue.prototype.$dayjs = dayjs;
    Vue.prototype.$echarts = echarts;
  } catch (error) {
    
  }

  install(Vue);
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}

initParamsStart()