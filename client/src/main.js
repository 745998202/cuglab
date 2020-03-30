import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// axios 请求
import axios from './http'
// element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

// 中间件的使用
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$axios = axios
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
