import ElementUI from 'element-ui'
import axios from 'axios';

var ajax = axios.create({
    baseURL: '//region.gongxiangdiancan.com', //测试
    headers: {},
    withCredentials: true, //cookie
    crossDomain: true //跨域
});

//添加一个响应拦截器
ajax.interceptors.response.use(function(res) {
    //在这里对返回的数据进行处理
    if (!res.data.status) {
        ElementUI.Message.error({
            message: res.data.message,
            type: 'error'
        });
        throw new Error(res.data.message);
    }

    return (res.data.data ? res.data.data : res.data.status);
}, function(err) {
    console.error(err);
    ElementUI.Message.error({
        message: '网络错误,请稍后再试!',
        type: 'error'
    });
    //Do something with response error
    return Promise.reject(err);
})


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
