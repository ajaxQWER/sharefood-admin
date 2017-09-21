import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Index from './views/Index.vue'
import Banner from './views/Banner/Banner.vue'
import Coupon from './views/Coupon/Coupon.vue'
import GoodsList from './views/Goods/GoodsList.vue'
import GoodsType from './views/Goods/GoodsType.vue'
let routes = [{
    path: '/login',
    component: Login,
    name: '',
    hidden: true
}, {
    path: '/404',
    component: NotFound,
    name: '404',
    hidden: true
}, {
    path: '/',
    component: Home,
    redirect: '/index',
    name: '主页',
    hidden: true
}, {
    path: '/index',
    component: Home,
    children: [
        { path: '/', component: Index, name: '主页' }
    ],
    hidden: true
}, {
    path: '/',
    component: Home,
    name: '',
    leaf: true, //只有一个节点
    iconCls: 'fa fa-gear',
    children: [
        { path: '/banner', component: Banner, name: 'Banner管理' },
    ]
},{
    path: '/',
    component: Home,
    name: '',
    leaf: true, //只有一个节点
    iconCls: 'fa fa-gear',
    children: [
        { path: '/coupon', component: Coupon, name: '优惠券管理' },
    ]
}, {
    path: '/',
    component: Home,
    name: '商品管理',
    iconCls: 'fa fa-user-o', //图标样式class
    children: [{
        path: '/GoodsList',
        component: GoodsList,
        name: '商品列表'
    }, {
        path: '/GoodsType',
        component: GoodsType,
        name: '商品分类'
    }]
}, {
    path: '*',
    hidden: true,
    redirect: { path: '/404' }
}];

export default routes;