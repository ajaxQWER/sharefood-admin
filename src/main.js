import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
import './assets/theme/theme-default/index.css'
import VueRouter from 'vue-router'
import routes from './routes'
import 'font-awesome/css/font-awesome.min.css'
import moment from 'moment'
// import 'moment/locale/zh-cn'
// import VueLazyload from 'vue-lazyload'
// 引入vue-amap
// import VueAMap from 'vue-amap';

Vue.use(ElementUI)
Vue.use(VueRouter)
// Vue.use(VueLazyload)
// Vue.use(VueAMap);

// 初始化vue-amap
// VueAMap.initAMapApiLoader({
//   // 高德的key
//   key: 'ff339b1e4c406691fb1af1fc4fa012e5', //正式aaef257a849413a2d9329e1b2a0fbb6e
//   // 插件集合
//   plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor','AMap.Geolocation']
// });

//金额格式化
var toDecimal2 = function(num) {
    var parseFloatNum = parseFloat(num);
    if (isNaN(parseFloatNum)) {
        return false;
    }
    var float = Math.round(num * 100) / 100;
    var floatString = float.toString();
    var index = floatString.indexOf('.');
    if (index < 0) {
        index = floatString.length;
        floatString += '.';
    }
    while (floatString.length <= index + 2) {
        floatString += '0';
    }
    return floatString;
}

//正常
// Object.defineProperty(Vue.prototype, 'UPLOADURL', {value: 'http://uploads.gongxiangdiancan.com'});
// Object.defineProperty(Vue.prototype, 'BASEURL', {value: 'http://api.gongxiangdiancan.com'});

//测试
Object.defineProperty(Vue.prototype, 'UPLOADURL', {value: process.env.UPLOAD_URL});
Object.defineProperty(Vue.prototype, 'BASEURL', {value: process.env.BASE_URL});
Object.defineProperty(Vue.prototype, 'moment', {value: moment});
Object.defineProperty(Vue.prototype, 'formatMoney', {value: toDecimal2});

const router = new VueRouter({
    mode:"history",
    routes
})

router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('jwt');
    }
    let jwt = sessionStorage.getItem('jwt');
    if (!jwt && to.path != '/login') {
        next({ path: '/login' })
    } else {
        next()
    }
})

new Vue({
    router,
    // store,
    render: h => h(App)
}).$mount('#app')
