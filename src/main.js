import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
import './assets/theme/theme-default/index.css'
import VueRouter from 'vue-router'
// import store from './vuex/store'
// import Vuex from 'vuex'
import routes from './routes'
import 'font-awesome/css/font-awesome.min.css'
import moment from 'moment'
// import 'moment/locale/zh-cn'
// import VueLazyload from 'vue-lazyload'

Vue.use(ElementUI)
Vue.use(VueRouter)
// Vue.use(Vuex)
// Vue.use(VueLazyload)

Object.defineProperty(Vue.prototype, 'moment', {value: moment});
Object.defineProperty(Vue.prototype, 'UPLOADURL', {value: 'http://www.baidu.com'});
Object.defineProperty(Vue.prototype, 'BASEURL', {value: ''});

const router = new VueRouter({
    mode:"history",
    routes
})

// router.beforeEach((to, from, next) => {
//     if (to.path == '/login') {
//         sessionStorage.removeItem('user');
//         sessionStorage.removeItem('jwt');
//     }
//     let jwt = sessionStorage.getItem('jwt');
//     if (!jwt && to.path != '/login') {
//         next({ path: '/login' })
//     } else {
//         next()
//     }
// })

new Vue({
    router,
    // store,
    render: h => h(App)
}).$mount('#app')
