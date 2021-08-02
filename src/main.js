// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { XButton } from 'vux'
import axios from 'axios'
import store from './store.js'
import Strophe from 'strophe.js'      //Strophe.js是为XMPP写的一个js类库。因为http协议本身不能实现持久连接，所以strophe利用BOSH模拟实现持久连接
import $ from 'jquery'
import BaiduMap from 'vue-baidu-map'
// import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'       //图像查看器
import VueScroller from 'vue-scroller'  //滑动刷新和加载
import Recorder  from "recorder-js"
import Mint from "mint-ui"
import "mint-ui/lib/style.css"
import {CellSwipe} from "mint-ui"
import VueClipboard from 'vue-clipboard2' //剪切板

Vue.use(VueClipboard)
Vue.config.devtools = true
Vue.config.performance = true
Vue.component(CellSwipe.name, CellSwipe);
Vue.use(Mint);
Vue.use(axios);
Vue.prototype.$http = axios;
Vue.use(VueScroller)
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'jKNQmZGpICFGGVpZL2qMIWz5FQQG14PW'
})

// Vue.use(Viewer);
// Viewer.setDefaults({
//   Options: {"keyboard": false}
// });

Vue.config.productionTip = false


//定义一个全局过滤器实现日期格式化

Vue.config.productionTip = false
// axios.defaults.baseURL = '/api'
// axios.defaults.headers.post['Content-Type'] = 'application/json';
/* eslint-disable no-new */
// Vue.prototype.HOST='/abc';
new Vue({
  el: '#app',
  router,
  store,// 使用store
  Strophe,
  components: { App },
  template: '<App/>'
})
Vue.component('x-button', XButton)    //把vux的一个组件赋值给vue的一个组件


