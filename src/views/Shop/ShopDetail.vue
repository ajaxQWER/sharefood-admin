<template>
    <el-row class="lives-news">
        <el-col class="title">
            <h3>新增店铺</h3>
        </el-col>
        <el-col>
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="back"><i class="el-icon--left el-icon-arrow-left"></i>返回</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col>
            <el-form :model="shopModel" label-width="120px">
                <el-form-item label="店铺名称">
                    <el-input type="text" v-model="shopModel.name" auto-complete="off" placeholder="店铺名称"></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input type="text" v-model="shopModel.number" auto-complete="off" placeholder="联系电话"></el-input>
                </el-form-item>
                <el-form-item label="营业时间">
                    <el-time-picker v-model="shopModel.beginTime" type="datetime" placeholder="开始时间"></el-time-picker>-
                    <el-time-picker v-model="shopModel.endTime" type="datetime" placeholder="结束时间"></el-time-picker>
                </el-form-item>
                <el-form-item label="位置信息">
                    <div class="amap-page-container">
                        <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
                        <el-amap vid="amapDemo" :plugin="plugin" class="amap-demo" :zoom="zoom" :center="mapCenter" :events="events">
                            <el-amap-marker v-for="(marker,index) in markers" :key="index" :position="marker" :title="marker.title"></el-amap-marker>
                        </el-amap>
                    </div>
                </el-form-item>
                <el-form-item label="经度">
                    <el-input type="text" v-model="shopModel.longitude" auto-complete="off" placeholder="经度" disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="纬度">
                    <el-input type="text" v-model="shopModel.latitude" auto-complete="off" placeholder="纬度" disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="位置">
                    <el-input type="text" v-model="shopModel.address" auto-complete="off" placeholder="位置" @change="keyUpSearch" ref="searchText"></el-input>
                </el-form-item>
                <el-form-item label="介绍">
                    <el-input type="textarea" v-model="shopModel.introduce" auto-complete="off" placeholder="介绍"></el-input>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>
<script>
export default {
    data: function() {
        var that = this;
        return {
            shopModel: {
                name: '',
                number: '',
                beginTime: '',
                endTime: '',
                introduce: '',
                longitude: 0,
                latitude: 0,
                address: ''
            },
            zoom: 14,
            mapCenter: [0, 0],
            address: '',
            searchOption: {
                city: '全国',
                citylimit: false
            },
            markers: [],
            plugin: [{
                pName: 'ToolBar'
            }, {
                pName: 'Geolocation',
                events: {
                    init(o) {
                        // o 是高德地图定位插件实例
                        o.getCurrentPosition((status, result) => {
                            if (result && result.position) {
                                that.shopModel.longitude = result.position.lng;
                                that.shopModel.latitude = result.position.lat;
                                that.mapCenter = [result.position.lng, result.position.lat];
                                that.shopModel.address = result.formattedAddress
                                that.$nextTick();
                            }
                        });
                    }
                }
            }],
            events: {
                click: function(e) {
                    console.log(e)
                    var lnglat = e.lnglat;
                    that.shopModel.longitude = lnglat.lng;
                    that.shopModel.latitude = lnglat.lat;
                    // 这里通过高德 SDK 完成。
                    var geocoder = new AMap.Geocoder({
                        radius: 1000,
                        extensions: "all"
                    });
                    geocoder.getAddress([lnglat.lng, lnglat.lat], function(status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            if (result && result.regeocode) {
                                console.log(result)
                                var marker = {
                                    position: [e.lnglat.lng, e.lnglat.lat],
                                    title: result.regeocode.formattedAddress
                                }
                                that.markers = [marker]
                                that.shopModel.address = result.regeocode.formattedAddress;
                                that.$nextTick();
                            }
                        }
                    });
                }
            },
        }
    },
    methods: {
        back: function() {
            this.$router.back()
        },
        onSearchResult: function(pois) {
            var latSum = 0;
            var lngSum = 0;
            if (pois.length > 0) {
                pois.forEach(poi => {
                    console.log(poi)
                    var { lng, lat } = poi;
                    lngSum += lng;
                    latSum += lat;
                    this.markers.push([poi.lng, poi.lat]);
                    var marker = {
                        position: [poi.lng,poi.lat],
                        title: poi.name
                    }
                    this.markers.push(marker)
                });
                var center = {
                    lng: lngSum / pois.length,
                    lat: latSum / pois.length
                };
                this.mapCenter = [center.lng, center.lat];
            }
        },
        keyUpSearch: function() {
            var that = this;
            var txt = this.shopModel.address;
            AMap.service(["AMap.PlaceSearch"], function() {
                var placeSearch = new AMap.PlaceSearch({});
                placeSearch.search(txt, function(status, result) {
                    that.markers = [];
                    if (status == 'complete' && result.info == 'OK') {
                        var latSum = 0;
                        var lngSum = 0;
                        if(result.poiList.pois.length > 0){
                            result.poiList.pois.forEach((poi) => {
                                console.log(poi)
                                var { lng, lat } = poi.location;
                                lngSum += lng;
                                latSum += lat;
                                var marker = {
                                    position: [poi.location.lng,poi.location.lat],
                                    title: poi.name
                                }
                                that.markers.push(marker)
                                var center = {
                                    lng: lngSum / result.poiList.pois.length,
                                    lat: latSum / result.poiList.pois.length
                                };
                                that.mapCenter = [center.lng, center.lat];
                            })
                            
                        }
                    }
                })
            })
        }
    }
}
</script>
<style scoped lang="scss">
.lives-news {
    .title {
        font-size: 12px;
        border-bottom: 1px solid #eaeaea;
        margin-bottom: 5px;
        h3 {
            display: inline-block;
            padding: 5px 0;
            margin: 0;
            font-weight: normal;
            color: #23b7e5;
            border-bottom: 1px solid #23b7e5;
        }
    }
    .amap-demo {
        height: 500px;
    }

    .search-box {
        position: absolute;
        top: 20px;
        left: 80px;
    }

    .amap-page-container {
        position: relative;
    }
}
</style>