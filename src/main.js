import Vue from "vue";
import BaiduMap from "vue-baidu-map";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en"; // lang i18n
import "@babel/polyfill";
import "@/styles/index.scss"; // global css

import dataV from "@jiaminghi/data-view";

import App from "./App";
import store from "./store";
import router from "./router";

import "@/icons"; // icon
import "@/permission"; // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
/**global components  Start*/
import echarts from "@/components/Echarts";
Vue.component("echarts", echarts);

import vContainer from "@/components/v-ad-container";
Vue.component("v-container", vContainer);

import fullPage from "@/components/fullPage/entry";
Vue.component("full-page", fullPage);
/**global components  End*/

import moment from "moment";
Object.defineProperty(Vue.prototype, "$moment", {
  value: moment,
});

// set ElementUI lang to EN
Vue.use(ElementUI);
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: process.env.VUE_APP_AK,
});

Vue.use(dataV);
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
