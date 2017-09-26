import ElementUI from 'element-ui'
import axios from 'axios';
import Qs from 'Qs'

var ajax = axios.create({
    baseURL: 'http://47.92.68.45:18080',
    headers: {},
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

    return res.data.data;
}, function(err) {
    console.error(err);
    ElementUI.Message.error({
        message: '响应发生错误,请稍后再试!',
        type: 'error'
    });
    //Do something with response error
    return Promise.reject(err);
})


//管理员
export const adminLogin = params => {
    return ajax.post('admin/admin/login', params);
};
export const updatePwd = params => {
    return ajax.post('admin/admin/secretkey', params);
};
export const getAdminInfo = params => {
    return ajax.get('admin/admin', params);
};

//banner
export const bannerList = params => {
    return ajax.get('admin/banner', params);
};
export const addBanner = params => {
    return ajax.put('admin/banner', params);
};
export const deleteBannerById = params => {
    return ajax.delete('admin/banner/' + params.bannerId, params);
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
    return ajax.delete('admin/coupon/' + params.couponId, params);
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
    return ajax.delete('admin/goods/' + params.goodsId, params);
};
export const putAwayGoodsById = params => {
    return ajax.post('admin/goods/' + params.goodsId, params);
};
export const findGoodsById = params => {
    return ajax.get('admin/goods/' + params.goodsId, params);
};


//店铺
export const shopList = params => {
    return ajax.get('admin/shopDetail', params);
};
export const findShopById = params => {
    return ajax.get('admin/shopDetail/' + params.shopId, params);
};
export const soldOut = params => {
    return ajax.delete('admin/shopDetail/' + params.shopId, params);
};
export const putAway = params => {
    return ajax.post('admin/shopDetail/' + params.shopId, params);
};

//店铺分类
export const shopCategoryList = params => {
    return ajax.get('admin/shopCategory', params);
};
export const addShopCategory = params => {
    return ajax.put('admin/shopCategory', params);
};
export const deleteShopCategoryById = params => {
    return ajax.delete('admin/shopCategory/' + params.shopCategoryId, params);
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


//文件上传 前台文件需要设置一个path属性
export const uploadFiles = params => {
    return ajax.post('commons/upload' + params.path, params);
};

