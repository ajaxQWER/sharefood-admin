import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Index from './views/Index.vue'
import Banner from './views/Banner/Banner.vue'
import Coupon from './views/Coupon/Coupon.vue'
import Goods from './views/Goods/Goods.vue'
import ShopList from './views/Shop/ShopList.vue'
import ShopType from './views/Shop/ShopType.vue'
import ShopDetail from './views/Shop/ShopDetail.vue'
import ShopAppraise from './views/Shop/ShopAppraise.vue'
import ShopAudit from './views/Shop/ShopAudit.vue'
import ShopAuditDetail from './views/Shop/ShopAuditDetail.vue'
import User from './views/User/User.vue'
import Order from './views/Order/Order.vue'
import OrderDetail from './views/Order/OrderDetail.vue'
import AdminLogs from './views/AdminLogs/AdminLogs.vue'
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
    name: '',
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
    iconCls: 'fa fa-flag',
    children: [
        { path: '/banner', component: Banner, name: 'Banner管理' },
    ]
}, {
    path: '/',
    component: Home,
    name: '',
    leaf: true, //只有一个节点
    iconCls: 'fa fa-ticket',
    children: [
        { path: '/coupon', component: Coupon, name: '优惠券管理' },
    ]
}, {
    path: '/',
    component: Home,
    name: '',
    leaf: true, //只有一个节点
    iconCls: 'fa fa-product-hunt', //图标样式class
    children: [
        { path: '/goods', component: Goods, name: '商品管理' }
    ]
}, {
    path: '/',
    component: Home,
    name: '店铺管理',
    iconCls: 'fa fa-shopping-bag', //图标样式class
    children: [{
        path: '/shopList',
        component: ShopList,
        name: '店铺列表'
    }, {
        path: '/shopType',
        component: ShopType,
        name: '店铺分类'
    }, {
        path: '/shopAppraise',
        component: ShopAppraise,
        name: '店铺评价'
    }, {
        path: '/shopAudit',
        component: ShopAudit,
        name: '店铺审核'
    }, {
        path: '/shopAuditDetail',
        component: ShopAuditDetail,
        name: '店铺详情',
        hidden: true
    }]
}, {
    path: '/',
    component: Home,
    name: '',
    leaf: true, //只有一个节点
    iconCls: 'fa fa-user-o',
    children: [
        { path: '/user', component: User, name: '用户管理' },
    ]
}, {
    path: '/',
    component: Home,
    name: '',
    leaf: true, //只有一个节点
    iconCls: 'fa fa-file-text',
    children: [
        { path: '/order', component: Order, name: '订单管理' },
        { path: '/orderDetail', component: OrderDetail, hidden: true, name: '订单详情' },
    ]
}, {
    path: '/',
    component: Home,
    name: '',
    hidden: true,
    children: [
        { path: '/shopDetail', component: ShopDetail, name: '新增店铺' },
    ]
}, {
    path: '/',
    component: Home,
    name: '',
    leaf: true, //只有一个节点
    iconCls: 'fa fa-list-alt',
    children: [
        { path: '/adminLogs', component: AdminLogs, name: '日志管理' },
    ]
}, {
    path: '*',
    hidden: true,
    redirect: { path: '/404' }
}];

export default routes;