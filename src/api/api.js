import ElementUI from 'element-ui'
import axios from 'axios';
import Qs from 'Qs'

var ajax = axios.create({
    baseURL: 'http://api.sharestock.cn',
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
        if(res.data.errorCode){
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

//后台登录
export const adminLogin = params => {
    return ajax.post('admin/admin/login', params);
};
export const updatePwd = params => {
    return ajax.post('admin/admin/secretkey', params);
};

//视频分类管理
/**
 * getVideoCategoryLists 获取视频分类列表
 * getVideoCategoryById 通过id查询视频分类详情
 * addVideoCategory 新增视频分类
 * deleteVideoCategoryById 通过id删除视频分类
 * updateVideoCategoryById 通过id修改视频分类
 */
export const getVideoCategoryLists = params => {
    return ajax.get('admin/videoCategory', params);
};
export const getVideoCategoryById = params => {
    return ajax.get('admin/videoCategory/' + params.categoryId, params);
};
export const addVideoCategory = params => {
    return ajax.put('admin/videoCategory', params);
};
export const deleteVideoCategoryById = params => {
    return ajax.delete('admin/videoCategory/' + params);
};
export const updateVideoCategoryById = params => {
    return ajax.post('admin/videoCategory/' + params.categoryId, params);
};
/**
 * getVideoLists 获取视频列表
 * addVideo 新增视频
 * deleteVideoById 通过id删除视频
 * getVideoById 通过id查询视频详情
 * updateVideoById 通过id修改视频
 */
//视频管理
export const getVideoLists = params => {
    return ajax.get('admin/video', params);
};
export const addVideo = params => {
    return ajax.put('admin/video', params);
};
export const deleteVideoById = params => {
    return ajax.delete('admin/video/' + params.videoId);
};
export const getVideoById = params => {
    return ajax.get('admin/video/' + params.videoId);
};
export const updateVideoById = params => {
    return ajax.post('admin/video/' + params.videoId, params);
};


//老师管理
/**
 * getTeacherLists 获取老师列表
 * addTeacher 新增老师
 * deleteTeacherById 通过id删除老师
 * getTeacherById 通过id获取老师详情
 * updateTeacherById 通过id修改老师
 */
export const getTeacherLists = params => {
    return ajax.get('admin/teacher', params);
};
export const addTeacher = params => {
    return ajax.put('admin/teacher', params);
};
export const deleteTeacherById = params => {
    return ajax.delete('admin/teacher/' + params.userId);
};
export const getTeacherById = params => {
    return ajax.get('admin/teacher/' + params.userId);
};
export const updateTeacherById = params => {
    return ajax.post('admin/teacher/' + params.userId, params);
};

//产品管理
/**
 * getProductLists 获取产品列表
 * addProduct 新增产品
 * deleteProductById 通过id删除产品
 * getProductById 通过id获取产品详情
 * updateProductById 通过id修改产品
 */

export const getProductLists = params => {
    return ajax.get('admin/product', params);
};
export const addProduct = params => {
    return ajax.put('admin/product', params);
};
export const deleteProductById = params => {
    return ajax.delete('admin/product/' + params.productId, params);
};
export const getProductById = params => {
    return ajax.get('admin/product/' + params.productId, params);
};
export const updateProductById = params => {
    return ajax.post('admin/product/' + params.productId, params);
};

//订单管理
/**
 * getOrderLists 获取产品订单列表
 * getOrderById 通过id获取产品订单详情
 * getRechargeOrder 获取充值订单列表
 * getRechargeOrderById 通过id获取充值订单详情
 * exportProductOrder 导出产品订单
 * exportRechargeOrder 导出充值订单
 * getrankingOrder 龙虎榜订单
 */

export const getproductOrder = params => {
    return ajax.get('admin/productOrder', params);
};
export const getproductOrderById = params => {
    return ajax.get('admin/productOrder/' + params.productOrderId, params);
};
// export const exportProductOrder = () => {
//     return ajax.get('admin/productOrder/export');
// };
export const getRechargeOrder = params => {
    return ajax.get('admin/rechargeOrder', params);
};
export const getRechargeOrderById = params => {
    return ajax.get('admin/rechargeOrder/' + params.RechargeOrderId, params);
};
// export const exportRechargeOrder = () => {
//     return ajax.get('admin/productOrder/export');
// };
export const getrankingOrder = params => {
    return ajax.get('admin/rankingOrder', params);
};
export const getrankingOrderById = params => {
    return ajax.get('admin/rankingOrder/' + params.rankingOrderId, params);
};


//悬赏管理
/**
 * getRewardLists 获取悬赏列表
 * getRewardById 通过id获取悬赏详情
 */

export const getRewardLists = params => {
    return ajax.get('admin/reward', params);
};
export const getRewardById = params => {
    return ajax.get('admin/reward/' + params.rewardId, params);
};

//内容导引
/**
 * getContentGuideLists 查询列表
 * getContentGuideById 通过id获取详情
 * addContentGuide 增加内容导引
 */

export const getContentGuideLists = params => {
    return ajax.get('admin/contentGuide', params);
};
export const getContentGuideById = params => {
    return ajax.get('admin/contentGuide/' + params.key, params);
};
export const addContentGuide = params => {
    return ajax.put('admin/contentGuide', params);
};
export const deleteContentGuideByKey = params => {
    return ajax.delete('admin/contentGuide/' + params.key, params);
};

//banner
/**
 * getBannerLists 查询banner列表
 * addBanner 增加banner
 * deleteBannerById 通过id删除banner
 * getBannerById 通过id获取banner详情
 * updateBannerById 通过id修改banner
 */

export const getBannerLists = params => {
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

//用户管理
/**
 * getUserLists 查询用户列表
 * getUserById 通过id获取用户详情
 * updateUserInfoById 通过用户id修改用户信息
 * updateUserPwdById 通过id修改用户信息
 */

export const getUserLists = params => {
    return ajax.get('admin/user', params);
};
export const getUserById = params => {
    return ajax.get('admin/user/' + params.userId, params);
};
export const updateUserInfoById = params => {
    return ajax.post('admin/user/' + params.userId, params);
};
export const updateUserPwdById = params => {
    return ajax.post('admin/user/' + params.userId + '/secretkey', params);
};

//飞屏管理
/**
 * getMessageLists 查询飞屏列表
 * getMessageById 通过id获取飞屏详情
 * addMessage 新增飞屏
 * updateMessageById 通过id修改飞屏信息
 * deleteMessageById 通过id删除飞屏信息
 */

export const getMessageLists = params => {
    return ajax.get('admin/scrollingMessage', params);
};
export const getMessageById = params => {
    return ajax.get('admin/scrollingMessage/' + params.scrollingMessageId, params);
};
export const addMessage = params => {
    return ajax.put('admin/scrollingMessage', params);
};
export const updateMessageById = params => {
    return ajax.post('admin/scrollingMessage/' + params.scrollingMessageId, params);
};
export const deleteMessageById = params => {
    return ajax.delete('admin/scrollingMessage/' + params.scrollingMessageId, params);
};

//竞赏文稿管理
/**
 * getRewardPKArticleList 获取竞赏文稿列表
 * updateRewardPKArticleList 修改竞赏文稿
 * setRewardPKFinish 设置完成
 */
export const getRewardPKArticleList = params => {
    return ajax.get('admin/rewardPk/' + params.rewardId, params);
};
export const updateRewardPKArticleList = params => {
    return ajax.post('admin/rewardPk/' + params.rewardId + '/' + params.rewardPKId, params);
};
export const setRewardPKFinish = params => {
    return ajax.post('admin/rewardPk/' + params.rewardId + '/' + params.rewardPKId + '/finish', params);
};

//龙虎榜
/**
 * 
 */
export const getRankList = params => {
    return ajax.get('admin/ranking', params);
};
export const addRank = params => {
    return ajax.put('admin/ranking', params);
};
export const updateRankById = params => {
    return ajax.post('admin/ranking/' + params.rankingId, params);
};
export const deleteRankById = params => {
    return ajax.delete('admin/ranking/' + params.rankingId, params);
};

//证书
export const getCertificateList = params => {
    return ajax.get('admin/certificate', params);
};


//文件上传 前台文件需要设置一个path属性
export const uploadFiles = params => {
    return ajax.post('commons/upload' + params.path, params);
};