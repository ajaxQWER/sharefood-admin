<template>
    <el-row class="lives-news">
        <el-row class="title">
            <h3>banner管理</h3>
        </el-row>
        <el-row>
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="showAddDialog"><i class="el-icon-plus el-icon--left"></i>添加banner</el-button>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="show" placeholder="请选择" @change="getBannerLists">
                        <el-option
                                v-for="(item,index) in showLists"
                                :key="index"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table :data="bannerList" :row-style="{fontSize:'12px'}" border style="width:1232px">
                <el-table-column label="Id" prop="bannerId" align="center" width="100px"></el-table-column>
                <el-table-column label="排序值"prop="sortOrder" align="center" width="100px"></el-table-column>
                <el-table-column label="状态" align="center" width="100px">
                    <template slot-scope="scope">{{scope.row.show?'显示':'隐藏'}}</template>
                </el-table-column>
                <el-table-column label="缩略图" align="center" width="320px">
                    <template slot-scope="scope"><img :src="formatImageUrl(scope.row.imageUrl)" alt="" class="thumb-img"></template>
                </el-table-column>
                <el-table-column label="类型" align="center" width="160px">
                    <template slot-scope="scope">
                        {{formatBannerType(scope.row.bannerType)}}
                        <div v-if="scope.row.bannerType== 'REDIRECT'">地址：{{scope.row.redirectUrl}}</div>
                        <div v-if="scope.row.bannerType== 'SHOP_INFO'">ID：{{scope.row.shopId}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="是否通用" align="center" width="120px">
                    <template slot-scope="scope">{{scope.row.common?'是':'否'}}</template>
                </el-table-column>
                <el-table-column label="所在地区" align="center" width="150px">
                    <template slot-scope="scope">{{scope.row.provinceId}}-{{scope.row.cityId}}-{{scope.row.areaId}}</template>
                </el-table-column>
                <el-table-column label="操作" width="180px" align="center">
                    <template slot-scope="scope">
                        <el-button size="small" @click="updateBanner(scope.$index, scope.row)">修改</el-button>
                        <el-button size="small" type="danger" @click="deleteBanner(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <!-- 分页 -->
        <el-row class="pagination">
            <el-pagination @current-change="currentChange" :current-page="pageId" :page-size="pageSize" layout="total, prev, pager, next" :total="counts">
            </el-pagination>
        </el-row>
        <el-dialog :title="isAdd?'新增banner':'修改banner'" :visible.sync="addDialog" size="tiny" @close="closeaddDialog" class="dialog">
            <el-form :model="formInline" label-width="80px">
                <el-form-item label="排序值">
                    <el-input-number v-model.number="formInline.sortOrder" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item label="是否显示">
                    <el-switch v-model="formInline.show" on-text="是" off-text="否"></el-switch>
                </el-form-item>
                <el-form-item label="是否通用">
                    <el-switch v-model="formInline.common" on-text="是" off-text="否"></el-switch>
                </el-form-item>
                <el-form-item label="选择地区" v-if="!formInline.common">
                    <el-select class="area-select" placeholder="省" v-model.number="addressObject.provinceId" filterable ref="province">
                        <el-option v-for="(item,index) in provinceList" :key="index" :label="item.provinceName" :value="item.provinceId"></el-option>
                    </el-select>
                    <el-select class="area-select" placeholder="市" v-model.number="addressObject.cityId" filterable ref="city">
                        <el-option v-for="(item,index) in cityList" :key="index" :label="item.cityName" :value="item.cityId"></el-option>
                    </el-select>
                    <el-select class="area-select" placeholder="区" v-model.number="addressObject.areaId" filterable ref="area">
                        <el-option v-for="(item,index) in areaList" :key="index" :label="item.areaName" :value="item.areaId"></el-option>
                    </el-select>
                    <el-button class="address-btn" type="primary" size="mini" @click="addAddress">添加</el-button>
                </el-form-item>
                <el-form-item label="地区列表" v-if="!formInline.common">
                    <div v-if="addressLists">
                        <div v-for="(item,index) in addressLists" :key="index">{{item.provinceName}}{{item.cityName}}{{item.areaName}}<el-button class="address-btn del-btn" type="danger" size="mini" @click="delAddress(index)">删除</el-button></div>
                    </div>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select placeholder="请选择类型" v-model="formInline.bannerType">
                        <el-option v-for="(item,index) in bannerType" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="链接地址" v-if="formInline.bannerType == 'REDIRECT'">
                    <el-input type="text" v-model="formInline.redirectUrl" auto-complete="off" placeholder="链接地址"></el-input>
                </el-form-item>
                <el-form-item label="店铺" v-if="formInline.bannerType == 'SHOP_INFO'">
                    <el-select placeholder="请选择店铺" v-model.number="formInline.shopId" filterable>
                        <el-option v-for="(item,index) in shopLists" :key="index" :label="item.detail.shopName" :value="item.shopId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="缩略图">
                    <el-upload class="avatar-uploader" :headers="uploadHeader" :action="BASEURL+'/commons/upload/banner'" :show-file-list="false" :on-success="handleAvatarSuccess">
                        <el-button size="small" type="primary" :loading="uploadLoading">点击上传banner</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div>
                <img v-if="formInline.imageUrl" :src="UPLOADURL+formInline.imageUrl" alt="" class="banner-thumb">
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAddBanner">取 消</el-button>
                <el-button type="primary" @click="addBanner" :loading="addLoading">确 定</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>
<script>
import {
    bannerList,
    addBanner,
    deleteBannerById,
    updateBannerById,
    uploadFiles,
    shopList
} from '@/api/api'
import {
    getProvinceList,
    getCityList,
    getAreaList
} from '@/api/region'
export default {
    data: function() {
        return {
            addLoading: false,
            addDialog: false,
            formInline: {
                bannerId: 0,
                bannerType: '',
                common: true,
                imageUrl: "",
                redirectUrl: '',
                shopId: null,
                show: true,
                sortOrder: 0,
                bannerAddresss: []
            },
            addressObject: {
                provinceId: null,
                cityId: null,
                areaId: null
            },
            pageId: 1,
            pageSize: 10,
            counts: 0,
            shopLists: null,
            isAdd: true,
            uploadLoading: false,
            bannerList: null,
            show: '',
            showLists: [{
                label: '全部',
                value: ' '
            },{
                label: '显示',
                value: true
            },{
                label: '隐藏',
                value: false
            }],
            uploadHeader: {
                token: sessionStorage.getItem('jwt')
            },
            bannerType: [{
                label: '无跳转',
                value: 'NOT_REDIRECT'
            },{
                label: '跳转',
                value: 'REDIRECT'
            },{
                label: '店铺',
                value: 'SHOP_INFO'
            }],
            provinceList: null,
            cityList: null,
            areaList: null,
            addressLists: [],
            provinceTempArr: [],
            cityTempArr: [],
            areaTempArr: []
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getBannerLists();
        this.getShopLists();
        getProvinceList().then(data => {
            this.provinceList = data;
        })
    },
    watch: {
        'addressObject.provinceId': function(newVal, oldVal){
            if (oldVal) {
                this.addressObject.cityId = null;
                this.addressObject.areaId = null;

                this.cityList = [];
                this.areaList = [];
            }

            if (newVal){
                getCityList(newVal).then(data => {

                    this.cityList = data;
                })
            }
        },
        'addressObject.cityId': function(newVal, oldVal){
            if (oldVal) {
                this.addressObject.areaId = null;

                this.areaList = [];
            }

            if (newVal){
               getAreaList(newVal).then(data => {
                    this.areaList = data;
                })
            }
        },
    },
    methods: {
        //获取banner列表
        getBannerLists: function() {
            bannerList({ params: { pageId: this.pageId, pageSize: this.pageSize, show: this.show } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.bannerList = data.list;
            })
        },
        //获取店铺列表
        getShopLists: function(){
            shopList({params: {pageSize: 999999}}).then(res => {
                this.shopLists = res.list;
            })
        },
        //显示添加弹窗
        showAddDialog: function() {
            this.addDialog = true;
        },
        //关闭添加弹窗
        closeaddDialog: function() {
            this.isAdd = true;
            this.addLoading = false;
            this.formInline = {
                bannerId: 0,
                bannerType: '',
                common: true,
                imageUrl: "",
                redirectUrl: '',
                shopId: null,
                show: true,
                sortOrder: 0,
                bannerAddresss: []
            }
            this.addressObject = {
                provinceId: null,
                cityId: null,
                areaId: null
            }
        },
        //添加banner
        addBanner: function() {
            this.addLoading = true;
            console.log(this.formInline)
            if (this.isAdd) {
                addBanner(this.formInline).then(data => {
                    this.getBannerLists();
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    })
                    this.addDialog = false;
                })
            } else {
                updateBannerById(this.formInline).then(data => {
                    this.getBannerLists()
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    })
                    this.addDialog = false;
                }).catch(err => {
                    console.error(err)
                })
            }
        },
        //取消添加banner
        cancelAddBanner: function() {
            this.addDialog = false;
        },
        //通过id修改banner
        updateBanner: function(index, row) {
            this.isAdd = false;
            this.addDialog = true;
            this.formInline = {
                bannerId: row.bannerId,
                bannerType: row.bannerType,
                common:  row.common,
                imageUrl: row.imageUrl,
                redirectUrl: row.redirectUrl,
                shopId: row.shopId,
                show: row.show,
                sortOrder: row.sortOrder,
                bannerAddresss: row.bannerAddresss || []
            }
        },
        //通过id删除banner
        deleteBanner: function(index, row) {
            this.$confirm('是否删除该banner?', '删除banner', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteBannerById(row).then(() => {
                    this.getBannerLists();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //分页
        currentChange: function(val) {
            this.$router.push('?page=' + val)
            this.pageId = val;
            this.getBannerLists()
        },
        formatImageUrl: function(url) {
            return this.UPLOADURL + url + '/banner.png';
        },
        handleAvatarSuccess: function(res){
            console.log(res)
            if(res.status){
                this.$message({
                    message: '上传banner成功',
                    type: 'success'
                })
                this.formInline.imageUrl = res.data.originalUrl;
            }else{
                this.$message({
                    message: '上传banner失败',
                    type: 'error'
                })
            }
        },
        //banner上传
        uploadBanner: function() {
            console.log(this.$refs.uploadBanner)
            var file = this.$refs.uploadBanner.uploadFiles[0].raw;
            var fd = new FormData();
            fd.append('file', file);
            fd.path = '/banner';
            this.uploadLoading = true;
            uploadFiles(fd).then(data => {
                // console.log(data)
                this.$message({
                    message: '上传banner成功',
                    type: 'success'
                })
                this.formInline.imageUrl = data.originalUrl;
                console.log(file)
                this.tempUrl = URL.createObjectURL(file);
                this.uploadLoading = false;
            }).catch(err=>{
                console.log(err)
                this.uploadLoading = false;
            })
        },
        formatBannerType: function(type){
            switch(type){
                case 'NOT_REDIRECT':
                    return '无跳转';
                case 'REDIRECT':
                    return '跳转';
                case 'SHOP_INFO':
                    return '店铺';
            }
        },
        addAddress: function(){
            if(!this.addressObject.provinceId){
                this.$message({
                    message: '请选择省',
                    type: 'error'
                })
                return;
            }

            //临时数组为了验证区域唯一
            if(this.provinceTempArr.indexOf(this.addressObject.provinceId) != -1 && this.cityTempArr.indexOf(this.addressObject.cityId) != -1 && this.areaTempArr.indexOf(this.addressObject.areaId) != -1){
                this.$message({
                    message: '该区域已存在，无法添加',
                    type: 'error'
                })
                return;
            }

            this.provinceTempArr.push(this.addressObject.provinceId)
            this.cityTempArr.push(this.addressObject.cityId)
            this.areaTempArr.push(this.addressObject.areaId)
            //添加到数组
            console.log()
            this.formInline.bannerAddresss.push({
                provinceId: this.addressObject.provinceId,
                cityId: this.addressObject.cityId,
                areaId: this.addressObject.areaId
            })
            //地区值
            var provinceName = this.$refs.province.query;
            var cityName = this.$refs.city.query;
            var areaName = this.$refs.area.query;
            var params = {
                provinceName: provinceName,
                cityName: cityName,
                areaName: areaName
            }
            //下方列表
            this.addressLists.push(params);

            //重置地区下拉
            this.addressObject = {
                provinceId: null,
                cityId: null,
                areaId: null
            }
        },
        delAddress: function(index){
            if(this.formInline.bannerAddresss.length == 1){
                return;
            }
            this.formInline.bannerAddresss.splice(index,1)
            this.addressLists.splice(index,1)
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
    .thumb-img{
        width: 100%;
    }
    .banner-thumb {
        width: 100%;
        vertical-align: middle;
    }
    .address-btn{
        margin: 0;
    }
    .area-select{
        width: 90px;
    }
    .area-div:not(:last-child){
        margin-bottom: 10px;
    }
    .del-btn{
        margin-left: 10px;
    }
}
</style>