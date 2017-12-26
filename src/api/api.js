import ElementUI from 'element-ui'
import axios from 'axios';

var ajax = axios.create({
    // baseURL: 'http://127.0.0.1:8080', //测试
    baseURL: process.env.BASE_URL, //测试
    // baseURL: 'http://api.gongxiangdiancan.com', //正式服
    headers: {},
    timeout: 15000,
    withCredentials: true, //cookie
    crossDomain: true //跨域
});

//添加一个请求拦截器
ajax.interceptors.request.use(function(config) {
    //在请求发出之前进行一些操作
    if (sessionStorage.getItem('jwt')) {
        config.headers.TOKEN = sessionStorage.getItem('jwt');
    }
    return config;
}, function(err) {
    console.error(err);
    ElementUI.Message.error({
        message: '请求发生错误,请稍后再试!',
        type: 'error'
    });
    //Do something with request error
    return Promise.reject(err);
});
//添加一个响应拦截器
ajax.interceptors.response.use(function(res) {
    //在这里对返回的数据进行处理
    if (!res.data.status) {
        if(res.data.errorCode==401){
            location.href = '/login'
        }
        ElementUI.Message.error({
            message: res.data.message,
            type: 'error'
        });
        throw new Error(res.data.message);
    }

    return (res.data.data?res.data.data:res.data.status);
}, function(err) {
    console.error(err);
    console.log('网络错误')
    ElementUI.Message.error({
        message: '网络请求错误,请稍后再试!',
        type: 'error'
    });
    //Do something with response error
    return Promise.reject(err);
})


//管理员
export const adminLogin = params => {
    return ajax.post('admin/adminMime/login', params);
};
export const updatePwd = params => {
    return ajax.post('admin/adminMime/secretkey', params);
};
export const getAdminInfo = params => {
    return ajax.get('admin/adminMime', params);
};
export const getAdminLogs = params => {
    return ajax.get('admin/adminLogging', params);
};

export const getAdmin = adminId => {
    return ajax.get('admin/admin/' + adminId);
};
export const getAdminList = params => {
    return ajax.get('admin/admin', params);
};
export const saveAdmin = admin => {
    return ajax.put('admin/admin', admin);
};
export const updateAdmin = admin => {
    return ajax.post('admin/admin/' + admin.adminId, admin);
};
export const updateAdminSecretkey = params => {
    return ajax.post('admin/admin/updateSecretkey/', params);
};
export const deleteAdmin = adminId => {
    return ajax.delete('admin/admin/' + adminId);
};



export const getRole = roleId => {
    return ajax.get('admin/role/' + roleId);
};
export const getRoleList = params => {
    return ajax.get('admin/role', params);
};
export const saveRole = role => {
    return ajax.put('admin/role', role);
};
export const updateRole = role => {
    return ajax.post('admin/role/' + role.roleId, role);
};
export const deleteRole = roleId => {
    return ajax.delete('admin/role/' + roleId);
};


export const getAdminRole = adminId => {
    return ajax.get('admin/adminRole/' + adminId);
};
export const updateAdminRole = (adminId, roleIds) => {
    return ajax.put('admin/adminRole/' + adminId, roleIds);
};

export const getRolePermissionPoint = roleId => {
    return ajax.get('admin/rolePermissionPoint/' + roleId);
};
export const updateRolePermissionPoint = (roleId, permissionPointKeyList) => {
    return ajax.put('admin/rolePermissionPoint/' + roleId, permissionPointKeyList);
};

export const getAllPermissionPoint = () => {
    return ajax.get('admin/permissionPoint');
};



//banner
export const bannerList = params => {
    return ajax.get('admin/banner', params);
};
export const addBanner = params => {
    return ajax.put('admin/banner', params);
};
export const deleteBannerById = params => {
    return ajax.delete('admin/banner/' + params.bannerId);
};
export const getBannerById = params => {
    return ajax.get('admin/banner/' + params.bannerId, params);
};
export const updateBannerById = params => {
    return ajax.post('admin/banner/' + params.bannerId, params);
};

//优惠券管理
export const coiponList = params => {
    return ajax.get('admin/coupon', params);
};
export const addCoupon = params => {
    return ajax.put('admin/coupon', params);
};
export const deleteCouponById = params => {
    return ajax.delete('admin/coupon/' + params.couponId);
};
export const findCouponById = params => {
    return ajax.get('admin/coupon/' + params.couponId, params);
};
export const updateCouponById = params => {
    return ajax.post('admin/coupon/' + params.couponId, params);
};

//商品管理
export const goodsList = params => {
    return ajax.get('admin/goods', params);
};
export const soldOutGoodsById = params => {
    return ajax.delete('admin/goods/' + params.goodsId);
};
export const putAwayGoodsById = params => {
    return ajax.post('admin/goods/' + params.goodsId, params);
};
export const findGoodsById = params => {
    return ajax.get('admin/goods/' + params.goodsId, params);
};


//店铺
export const shopList = params => {
    return ajax.get('admin/shop', params);
};
export const findShopById = params => {
    return ajax.get('admin/shop/' + params.shopId, params);
};
export const putAway = params => {
    return ajax.post('admin/shop/onShelves', params);
};
export const soldOut = params => {
    return ajax.post('admin/shop/offShelves', params);
};
//设置店铺置顶
export const setToperClass = (shopId, toperClass) => {
    return ajax.post('admin/shop/topper/' + shopId + '/' + toperClass);
};
//重新审核店铺
export const reAdoptShopById = shopId => {
    return ajax.post('admin/shop/batchUnAdopt/' + shopId);
};


export const sellerList = params => {
    return ajax.get('admin/seller', params);
};
export const findSellerById = sellerId => {
    return ajax.get('admin/seller/' + sellerId);
};
export const updateSecretkey = params => {
    return ajax.post('admin/seller/updateSecretkey', params);
};
export const updateSellerName = params => {
    return ajax.post('admin/seller/updateSellerName', params);
};


//店铺分类
export const shopCategoryList = params => {
    return ajax.get('admin/shopCategory', params);
};
export const addShopCategory = params => {
    return ajax.put('admin/shopCategory', params);
};
export const deleteShopCategoryById = params => {
    return ajax.delete('admin/shopCategory/' + params.shopCategoryId);
};
export const findShopCategoryById = params => {
    return ajax.get('admin/shopCategory/' + params.shopCategoryId, params);
};
export const updateShopCategoryById = params => {
    return ajax.post('admin/shopCategory/' + params.shopCategoryId, params);
};

//用户管理
export const userList = params => {
    return ajax.get('admin/user', params);
};
export const findUserById = params => {
    return ajax.get('admin/user/' + params.userId, params);
};

//订单管理
export const orderList = params => {
    return ajax.get('admin/order', params);
};
export const findOrderById = params => {
    return ajax.get('admin/order/' + params.orderId, params);
};

//店铺评价
export const shopAppraiseList = params => {
    return ajax.get('admin/shopAppraise', params);
};
export const findShopAppraiseById = params => {
    return ajax.get('admin/shopAppraise/' + params.shopAppraiseId, params);
};

//店铺审核
export const getShopAuditList = params => {
    return ajax.get('admin/shopAudit', params);
};
export const passShopAudit = (type,params) => {
    return ajax.post('admin/shopAudit/' + type + '/pass', params);
};
export const findShopAuditById = (type, shopId) => {
    return ajax.get('admin/shopAudit/' + type + '/get/' + shopId);
};
export const rejectShopAudit = (type,params) => {
    return ajax.post('admin/shopAudit/' + type + '/unpass', params);
};
//提交资料给蜂鸟审核
export const commitToDelivery = shopId => {
    return ajax.post('admin/shopAudit/distribution/commit/' + shopId);
};
//店铺审核上线推送
export const auditPush = shopId => {
    return ajax.post('admin/shopAudit/auditPush/' + shopId);
};

//地区
export const getProvinceById = provinceId => {
    return ajax.get('commons/region/info/province/' + provinceId);
};
export const getCityById = cityId => {
    return ajax.get('commons/region/info/city/' + cityId);
};
export const getProvinceList = () => {
    return ajax.get('commons/region/province');
};
export const getCityList = provinceId => {
    return ajax.get('commons/region/city/' + provinceId);
};
export const getAreaList = cityId => {
    return ajax.get('commons/region/area/' + cityId);
};

//文章管理
//文章分类
export const getArticleCategoryList = parms => {
    return ajax.get('admin/articleCategory', parms);
};
export const getArticleCategoryAll = parms => {
    return ajax.get('admin/articleCategory/all', {});
};
export const addArticleCategory = params => {
    return ajax.put('admin/articleCategory', params);
};
export const deleteArticleCategoryById = id => {
    return ajax.delete('admin/articleCategory/' + id);
};
export const getArticleCategoryById = id => {
    return ajax.get('admin/articleCategory/' + id);
};
export const updateArticleCategoryById = params => {
    return ajax.post('admin/articleCategory/' + params.articleCategoryId, params);
};
//文章详情
export const getArticleList = parms => {
    return ajax.get('admin/article', parms);
};
export const addArticle = params => {
    return ajax.put('admin/article', params);
};
export const deleteArticleById = id => {
    return ajax.delete('admin/article/' + id);
};
export const getArticleById = id => {
    return ajax.get('admin/article/' + id);
};
export const updateArticleById = params => {
    return ajax.post('admin/article/' + params.articleId, params);
};

//结算模板
export const getShopSettlementTemplateLists = () => {
    return ajax.get('admin/shopAudit/SettlementTemplate');
};
export const getAgentSettlementTemplateLists = () => {
    return ajax.get('admin/agent/SettlementTemplate');
};
export const getAllSettlementTemplateLists = params => {
    return ajax.get('admin/settlementTemplate', params);
};
export const addSettlementTemplate = params => {
    return ajax.put('admin/settlementTemplate', params);
};
export const deleteSettlementTemplateById = id => {
    return ajax.delete('admin/settlementTemplate/' + id);
};
export const findOneBySettlementTemplateId = id => {
    return ajax.get('admin/settlementTemplate/' + id);
};
export const updateSettlementTemplateId = params => {
    return ajax.post('admin/settlementTemplate/' + params.settlementTemplateId, params);
};

//结算记录
export const getSettlementRecordLists = params => {
    return ajax.get('admin/settlementRecord', params);
};
export const getSettlementRecordBySerialNumber = serialNumber => {
    return ajax.get('admin/settlementRecord/' + serialNumber);
};

//代理商
export const getAgentLists = params => {
    return ajax.get('admin/agent', params);
};
export const addAgent = params => {
    return ajax.put('admin/agent', params);
};
export const updateAgentPassword = params => {
    return ajax.post('admin/agent/updateSecretkey', params);
};
export const findAgentById = agentId => {
    return ajax.get('admin/agent/' + agentId);
};
export const updateAgentById =  params => {
    return ajax.post('admin/agent/' + params.agentId, params);
};

export const getAgentRegion = agentId => {
    return ajax.get('admin/agentRegion/' + agentId);
};
export const updateAgentRegion = (agentId, data) => {
    return ajax.put('admin/agentRegion/' + agentId, data);
};
//更换代理商
export const changeAgent =  params => {
    return ajax.post('admin/shopDetail/changeAgent', params);
};


//订单打印
export const getPrinterLogs = params => {
    return ajax.get('admin/orderPrinterLog', params);
};
export const printerLogsById = orderId => {
    return ajax.post('admin/orderPrinterLog/print/' + orderId);
};
export const getPrinterLogById = orderId => {
    return ajax.get('admin/orderPrinterLog/' + orderId);
};

//评价标签管理
//店铺评价
export const getShopAppraiseTagLists = params => {
    return ajax.get('admin/shopAppraiseTag', params);
};
export const addShopAppraiseTag = params => {
    return ajax.put('admin/shopAppraiseTag', params);
};
export const deleteShopAppraiseTag = shopAppraiseTagId => {
    return ajax.delete('admin/shopAppraiseTag/' + shopAppraiseTagId);
};
export const getShopAppraiseTagById = shopAppraiseTagId => {
    return ajax.get('admin/shopAppraiseTag/' + shopAppraiseTagId);
};
export const updateShopAppraiseTagById = params => {
    return ajax.post('admin/shopAppraiseTag/' + params.shopAppraiseTagId, params);
};
//商品评价
export const getGoodsAppraiseTagLists = params => {
    return ajax.get('admin/goodsAppraiseTag', params);
};
export const addGoodsAppraiseTag = params => {
    return ajax.put('admin/goodsAppraiseTag', params);
};
export const deleteGoodsAppraiseTag = goodsAppraiseTagId => {
    return ajax.delete('admin/goodsAppraiseTag/' + goodsAppraiseTagId);
};
export const getGoodsAppraiseTagById = goodsAppraiseTagId => {
    return ajax.get('admin/goodsAppraiseTag/' + goodsAppraiseTagId);
};
export const updateGoodsAppraiseTagById = params => {
    return ajax.post('admin/goodsAppraiseTag/' + params.goodsAppraiseTagId, params);
};
//配送评价
export const getDeliveryAppraiseTagLists = params => {
    return ajax.get('admin/deliveryAppraiseTag', params);
};
export const addDeliveryAppraiseTag = params => {
    return ajax.put('admin/deliveryAppraiseTag', params);
};
export const deleteDeliveryAppraiseTag = deliveryAppraiseTagId => {
    return ajax.delete('admin/deliveryAppraiseTag/' + deliveryAppraiseTagId);
};
export const getDeliveryAppraiseTagById = deliveryAppraiseTagId => {
    return ajax.get('admin/deliveryAppraiseTag/' + deliveryAppraiseTagId);
};
export const updateDeliveryAppraiseTagById = params => {
    return ajax.post('admin/deliveryAppraiseTag/' + params.deliveryAppraiseTagId, params);
};

//审核记录日志
export const getAuditLogList = params => {
    return ajax.get('admin/auditLogging', params);
};

//取消订单
export const cancelOrderBySystem = params => {
    return ajax.put('admin/order/orderCancel', params);
};



//文件上传 前台文件需要设置一个path属性
export const uploadFiles = params => {
    return ajax.post('commons/upload' + params.path, params);
};

