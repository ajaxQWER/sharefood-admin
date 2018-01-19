import ElementUI from 'element-ui'
import axios from 'axios';

var ajax = axios.create({
    baseURL: process.env.BASE_URL, //测试
    headers: {},
    responseType: 'blob', //返回数据的格式,其可选项是arraybuffer,blob,document,json,text,stream,默认值为json
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
    return res;
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

//结算记录导出
export const exportSettleRecord = params => {
    return ajax.get('admin/reconciliation/export', params)
}

//店铺列表导出
export const exportShopList = () => {
    return ajax.get('admin/shopDetail/export')
}
//待审核店铺导出
export const exportAuditShopList = () => {
    return ajax.get('admin/shopAudit/export')
}