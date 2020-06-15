import Vue from 'vue'
import App from './App.vue'
import 'amfe-flexible'
import { Cell, CellGroup, Icon, Tag, Swipe, SwipeItem, SubmitBar, Checkbox } from 'vant';
import router from './router'
import store from './store'

Vue.use(Cell);
Vue.use(Icon);
Vue.use(Tag);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(CellGroup);
Vue.use(SubmitBar);
Vue.use(Checkbox)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
