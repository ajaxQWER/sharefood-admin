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
                            <el-amap-marker v-for="(marker,index) in markers" :key="index" :position="marker"></el-amap-marker>
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
                <el-form-item label="轮播图">
                    <el-upload ref="uploadCarousel" action="" :http-request="uploadCarousel" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :auto-upload="false">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog v-model="dialogVisible" size="tiny">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>
                <el-form-item label="缩略图">
                    <el-upload ref="uploadImage" action="" :http-request="uploadImage" :show-file-list="false">
                        <el-button size="small" type="primary">上传缩略图</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <img :src="UPLOADURL+shopModel.image" alt="" class="banner-thumb">
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="hadnleSaveShop">保存</el-button>
                    <el-button @click="back">返回</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>
<script>
import { addShop, findShopById, uploadFiles } from '@/api/api'
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
                address: '',
                carousel: [],
                image: ''
            },
            zoom: 14,
            mapCenter: [0, 0],
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
                    var lnglat = e.lnglat;
                    that.shopModel.longitude = lnglat.lng;
                    that.shopModel.latitude = lnglat.lat;
                    that.markers = [
                        [e.lnglat.lng, e.lnglat.lat]
                    ];
                    var geocoder = new AMap.Geocoder({
                        radius: 1000,
                        extensions: "all"
                    });
                    geocoder.getAddress([e.lnglat.lng, e.lnglat.lat], function(status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            if (result && result.regeocode) {
                                that.shopModel.address = result.regeocode.formattedAddress
                            }
                        }
                    });
                }
            },
            dialogImageUrl: '',
            dialogVisible: false
        }
    },
    created: function() {
        var shopId = this.$route.query.shopId;
        if(shopId){
            var params = {
                shopId: shopId
            }
            findShopById(params).then(data => {
                console.log(data)
                this.shopModel.name = data.name;
                this.shopModel.number = data.number;
                this.shopModel.beginTime = data.beginTime;
                this.shopModel.endTime = data.endTime;
                this.shopModel.introduce = data.introduce;
                this.shopModel.longitude = data.longitude;
                this.shopModel.latitude = data.latitude;
                this.shopModel.address = data.address;
                this.shopModel.carousel = data.carousel;
                this.shopModel.image = data.image;
                this.markers = [
                    [data.longitude, data.latitude]
                ];
            })
        }
    },
    methods: {
        back: function() {
            this.$router.back()
        },
        onSearchResult: function(pois) {
            if (pois.length > 0) {
                console.log(pois[0])
                this.markers = [
                    [pois[0].lng, pois[0].lat]
                ];
                this.shopModel.longitude = pois[0].lng;
                this.shopModel.latitude = pois[0].lat;
                this.shopModel.address = pois[0].name;
                this.mapCenter = [pois[0].lng, pois[0].lat];
            }
        },
        keyUpSearch: function() {
            return
            var that = this;
            var txt = this.shopModel.address;
            AMap.service(["AMap.PlaceSearch"], function() {
                var placeSearch = new AMap.PlaceSearch({});
                placeSearch.search(txt, function(status, result) {
                    that.markers = [];
                    if (status == 'complete' && result.info == 'OK') {
                        var latSum = 0;
                        var lngSum = 0;
                        if (result.poiList.pois.length > 0) {
                            result.poiList.pois.forEach((poi) => {
                                console.log(poi)
                                var { lng, lat } = poi.location;
                                lngSum += lng;
                                latSum += lat;
                                that.markers.push([poi.location.lng, poi.location.lat])
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
        },
        uploadCarousel: function() {
            var file = this.$refs.uploadCarousel.uploadFiles[0].raw;
            var fd = new FormData();
            fd.append('file', file);
            fd.path = '/shopCarousel';
            uploadFiles(fd).then(data => {
                this.shopModel.carousel.push(data.originalUrl);
            }).catch(err => {
                console.log(err)
            })
        },
        handlePictureCardPreview: function(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleRemove: function(file, fileList) {
            this.shopModel.carousel = [];
        },
        hadnleSaveShop: function() {
            this.$refs.uploadCarousel.submit()
            addShop(this.shopModel).then(data => {
                console.log(data)
            })
            console.log(this.shopModel)

        },
        //上传缩略图
        uploadImage: function() {
            var file = this.$refs.uploadImage.uploadFiles[0].raw;
            var fd = new FormData();
            fd.append('file', file);
            fd.path = '/shopImage';
            uploadFiles(fd).then(data => {
                this.$message({
                    message: ' 上传缩略图成功',
                    type: 'success'
                })
                this.shopModel.image = data.originalUrl;
            }).catch(err => {
                console.log(err)
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
    .banner-thumb {
        height: 320px;
        vertical-align: middle;
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