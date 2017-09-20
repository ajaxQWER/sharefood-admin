const regist = () => import('./views/regist.vue');
const Login = () => import('./views/Login.vue');
const NotFound = () => import('./views/404.vue');
const Home = () => import('./views/Home.vue');
const Index = () => import('./views/Index.vue');
const videoList = () => import('./views/video/videoList.vue');
const video = () => import('./views/video/video.vue');
const product = () => import('./views/product/product.vue');
const reward = () => import('./views/reward/reward.vue');
const teacherList = () => import('./views/teacher/teacherList.vue');
const productOrder = () => import('./views/order/productOrder.vue');
const rechargeOrder = () => import('./views/order/rechargeOrder.vue');
const rankOrder = () => import('./views/order/rankOrder.vue');
const contentGuide = () => import('./views/contentGuide/contentGuide.vue');
const banner = () => import('./views/banner/banner.vue');
const user = () => import('./views/user/user.vue');
const slider = () => import('./views/slider/slider.vue');
const rewardPK = () => import('./views/rewardPK/rewardPK.vue');
const rank = () => import('./views/rank/rank.vue');
const certificate = () => import('./views/certificate/certificate.vue');


let routes = [{
        path: '/regist',
        component: regist,
        name: '',
        hidden: true
    }, {
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
        iconCls: 'fa fa-book',
        children: [
            { path: '/banner', component: banner, name: 'banner管理' }
        ]
    }, {
        path: '/',
        component: Home,
        name: '',
        leaf: true, //只有一个节点
        iconCls: 'fa fa-book',
        children: [
            { path: '/slider', component: slider, name: '飞屏管理' }
        ]
    },{
        path: '/',
        component: Home,
        name: '',
        leaf: true, //只有一个节点
        iconCls: 'fa fa-book',
        children: [
            { path: '/user', component: user, name: '用户管理' }
        ]
    }, {
        path: '/',
        component: Home,
        redirect: '/index',
        name: '视频管理',
        iconCls: 'fa fa-user-o', //图标样式class
        children: [{
            path: '/videosCategory',
            component: videoList,
            name: '视频分类'
        }, {
            path: '/video',
            component: video,
            name: '视频列表'
        }]
    },
    {
        path: '/',
        component: Home,
        name: '',
        leaf: true, //只有一个节点
        iconCls: 'fa fa-book',
        children: [
            { path: '/rank', component: rank, name: '龙虎榜' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        leaf: true, //只有一个节点
        iconCls: 'fa fa-book',
        children: [
            { path: '/product', component: product, name: '产品管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        leaf: true, //只有一个节点
        iconCls: 'fa fa-book',
        children: [
            { path: '/teacher', component: teacherList, name: '老师管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '订单管理',
        // leaf: true, //只有一个节点
        iconCls: 'fa fa-book',
        children: [
            { path: '/productOrder', component: productOrder, name: '产品订单' },
            { path: '/rechargeOrder', component: rechargeOrder, name: '充值订单' },
            { path: '/rankOrder', component: rankOrder, name: '龙虎榜订单' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        leaf: true, //只有一个节点
        iconCls: 'fa fa-gear',
        children: [
            { path: '/reward', component: reward, name: '悬赏管理' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        leaf: true, //只有一个节点
        iconCls: 'fa fa-gear',
        children: [
            { path: '/contentGuide', component: contentGuide, name: '内容导引' },
        ]
    }, {
        path: '/',
        component: Home,
        name: '',
        hidden: true,
        children: [
            { path: '/rewardPK', component: rewardPK, name: '竞赏文稿管理' }
        ]
    },{
        path: '/',
        component: Home,
        name: '',
        hidden: true,
        children: [
            { path: '/certificate', component: certificate, name: '证书管理' }
        ]
    }, {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;