import Vue from 'vue'
import App from './App.vue'
import 'amfe-flexible'
import router from './router'
import store from './store'

import { vant } from './plugins/vant'
Object.keys(vant).forEach(item => {
  Vue.use(vant[item])
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
