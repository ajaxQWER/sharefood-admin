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
import ShopAppraiseDetail from './views/Shop/ShopAppraiseDetail.vue'
import ShopAudit from './views/Shop/ShopAudit.vue'
import ShopAuditLogs from './views/Shop/ShopAuditLogs.vue'
import ShopAuditDetail from './views/Shop/ShopAuditDetail.vue'
import User from './views/User/User.vue'
import Order from './views/Order/Order.vue'
import OrderDetail from './views/Order/OrderDetail.vue'
import AdminLogs from './views/AdminLogs/AdminLogs.vue'
import ArticleList from './views/Article/ArticleList.vue'
import ArticleType from './views/Article/ArticleType.vue'
import ArticleEdit from './views/Article/ArticleEdit.vue'
import Settlement from './views/Settlement/Settlement.vue'
import SettlementRecord from './views/Settlement/SettlementRecord.vue'
import Agent from './views/Agent/Agent.vue'
import AgentRegion from './views/Agent/AgentRegion.vue'
import ShopTag from './views/Tag/ShopTag.vue'
import GoodsTag from './views/Tag/GoodsTag.vue'
import DeliveryTag from './views/Tag/DeliveryTag.vue'
import Admin from './views/Admin/Admin.vue'
import AdminRole from './views/Admin/AdminRole.vue'
import Role from './views/Admin/Role.vue'
import AdminPermissionPoint from './views/Admin/AdminPermissionPoint.vue'

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
        path: '/shopAuditLogs',
        component: ShopAuditLogs,
        name: '审核日志'
    }, {
        path: '/shopAuditDetail',
        component: ShopAuditDetail,
        name: '店铺审核详情',
        hidden: true
    },{ path: '/shopDetail',
        component: ShopDetail,
        name: '店铺详情',
        hidden: true
    },{ path: '/shopAppraiseDetail',
        component: ShopAppraiseDetail,
        name: '店铺评价详情',
        hidden: true
    }]
}, {
    path: '/',
    component: Home,
    name: '文章管理',
    iconCls: 'fa fa-rss', //图标样式class
    children: [{
        path: '/articleType',
        component: ArticleType,
        name: '文章分类'
    }, {
        path: '/articleList',
        component: ArticleList,
        name: '文章列表'
    }, {
        path: '/articleUpdate',
        component: ArticleEdit,
        name: '文章编辑',
        hidden: true
    }, {
        path: '/articleAdd',
        component: ArticleEdit,
        name: '文章新增',
        hidden: true
    }]
}, {
    path: '/',
    component: Home,
    name: '结算管理',
    iconCls: 'fa fa-money',
    children: [
        { path: '/settlement', component: Settlement, name: '结算模板' },
        { path: '/settlementRecord', component: SettlementRecord, name: '结算记录' }
    ]
}, {
    path: '/',
    component: Home,
    name: '评价标签管理',
    iconCls: 'fa fa-tag',
    children: [
        { path: '/shopTag', component: ShopTag, name: '店铺评价标签' },
        { path: '/goodsTag', component: GoodsTag, name: '商品评价标签' },
        { path: '/deliveryTag', component: DeliveryTag, name: '配送评价标签' }
    ]
}, {
    path: '/',
    component: Home,
    name: '',
    leaf: true, //只有一个节点
    iconCls: 'fa fa-users',
    children: [
        { 
        	path: '/agent', 
        	component: Agent, 
        	name: '代理商管理'
        },
        { 
			path: '/agent/region',
        	component: AgentRegion, 
        	name: '代理商区域管理',
        	hidden: true
        }
    ]
}, {
    path: '/',
    component: Home,
    name: '管理员管理',
    iconCls: 'fa fa-address-card-o',
    children: [
        { 
        	path: '/admin', 
        	component: Admin, 
        	name: '管理员列表'
        }, { 
        	path: '/admin/role', 
        	component: AdminRole, 
        	name: '角色管理',
        	hidden: true
        }, { 
        	path: '/role', 
        	component: Role, 
        	name: '角色列表' 
        }, { 
        	path: '/role/permissionPoint', 
        	component: AdminPermissionPoint, 
        	name: '权限管理',
        	hidden: true
        }
    ]
}, {
    path: '/',
    component: Home,
    name: '',
    leaf: true, //只有一个节点
    iconCls: 'fa fa-list-ol',
    children: [
        { path: '/adminLogs', component: AdminLogs, name: '日志管理' },
    ]
}, {
    path: '*',
    hidden: true,
    redirect: { path: '/404' }
}];

export default routes;