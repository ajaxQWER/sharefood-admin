import ElementUI from 'element-ui'
import axios from 'axios';
import Qs from 'Qs'

var ajax = axios.create({
    baseURL: 'http://47.92.68.45:18080',
    // baseURL: 'http://sdk.guerlab.net',
    // baseURL: 'http://192.168.31.10:8080',
    headers: {
        // 'TOKEN': sessionStorage.getItem('jwt')
        // 'Accept': '*/*',
        // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    // transformRequest: [function(data) {
    //     return Qs.stringify(data);
    // }],
    // `transformResponse`选项允许我们在数据传送到`then/catch`方法之前对数据进行改动
    // transformResponse: [function(res) {
    //     //在这里根据自己的需求改变数据
    //     var data = JSON.parse(res)
    //     if(data.status){
    //         return data.data;
    //     }else{
    //         ElementUI.Message.error({
    //           message: data.message,
    //           type: 'error'
    //         });
    //     }
    // }],
    withCredentials: true, //cookie
    crossDomain: true //跨域
});

//添加一个请求拦截器
ajax.interceptors.request.use(function(config) {
    //在请求发出之前进行一些操作
    if (sessionStorage.getItem('jwt')) {
        config.headers.TOKEN = sessionStorage.getItem('jwt');
    }
    // if (config.method === 'post') {
    //     config.transformRequest = [function(data) {
    //         return Qs.stringify(data)
    //     }]
    // }

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

//网站后台admin

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

//商品列表
export const goodsList = params => {
    return ajax.get('admin/goods', params);
};
export const findGoodsById = params => {
    return ajax.get('admin/goods/' + params.goodsId, params);
};

//商品分类
export const goodsCateGoryList = params => {
    return ajax.get('admin/goodsCategory', params);
};
export const addGoodsCateGory = params => {
    return ajax.put('admin/goodsCategory', params);
};
export const deleteGoodsCateGory = params => {
    return ajax.put('admin/goodsCategory/' + params.goodsCategoryId, params);
};
export const findGoodsCateGoryById = params => {
    return ajax.get('admin/goodsCategory/' + params.goodsCategoryId, params);
};
export const updateGoodsCategoryById = params => {
    return ajax.post('admin/goodsCategory/' + params.goodsCategoryId, params);
};

//店铺
export const shopList = params => {
    return ajax.get('admin/shopDetail', params);
};
export const addShop = params => {
    return ajax.put('admin/shopDetail/' + params.shopId, params);
};
export const findShopById = params => {
    return ajax.get('admin/shopDetail/' + params.shopId, params);
};

//店铺分类
export const shopCategoryList = params => {
    return ajax.get('admin/shopCategory', params);
};
export const addShopCateGory = params => {
    return ajax.put('admin/ShopCateGory', params);
};
export const deleteShopCateGory = params => {
    return ajax.put('admin/ShopCateGory/' + params.ShopCateGoryId, params);
};
export const findShopCateGoryById = params => {
    return ajax.get('admin/ShopCateGory/' + params.ShopCateGoryId, params);
};
export const updateShopCateGoryById = params => {
    return ajax.post('admin/ShopCateGory/' + params.ShopCateGoryId, params);
};

//文件上传 前台文件需要设置一个path属性
export const uploadFiles = params => {
    return ajax.post('commons/upload' + params.path, params);
};