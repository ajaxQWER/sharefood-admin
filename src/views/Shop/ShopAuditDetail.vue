<template>
    <el-row class="lives-news">
        <el-row class="title">
            <h3>店铺详情</h3>
        </el-row>
        <el-row>
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" icon="arrow-left" @click="back">返回审核列表</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row v-if="auditType=='base'" class="shop-detail">
            <h3>店铺基本信息</h3>
            <ul v-if="shopDetail">
                <li>店铺ID：{{shopDetail.detail.shopId}}</li>
                <li>店铺名称：{{shopDetail.detail.shopName}}</li>
                <li>店铺类型：{{formatShopType(shopDetail.detail.shopType)}}</li>
                <li>审核状态：{{formatAuditStaus(shopDetail.detail.audit)}}</li>
                <li>店铺地址：{{shopDetail.detail.provinceName}}-{{shopDetail.detail.cityName}}-{{shopDetail.detail.areaName}} {{shopDetail.detail.address}}</li>
                <li>店铺经度：{{shopDetail.detail.longitude}}</li>
                <li>店铺纬度：{{shopDetail.detail.latitude}}</li>
                <li>营业时间：{{shopDetail.detail.busBeginTime}}-{{shopDetail.detail.busEndTime}}</li>
                <li>配送费：{{shopDetail.detail.fee}}元</li>
                <li>送餐电话：{{shopDetail.detail.takeOutPhone}}</li>
                <li>店铺上架状态：{{shopDetail.detail.shelves?'上架':'下架'}}</li>
                <li>店铺注册手机号：{{shopDetail.detail.phoneNum}}</li>
                <li>店铺联系人：{{shopDetail.detail.name}}</li>
                <li>店铺分类：{{shopDetail.detail.shopCategoryName}}</li>
                <li>店铺logo：<img :src="formatImage(shopDetail.detail.logoUrl)" alt="" @click="showBigImage(UPLOADURL + shopDetail.detail.logoUrl)"></li>
                <li>店内照：<img :src="formatImage(shopDetail.detail.shopInnerUrl)" alt="" @click="showBigImage(UPLOADURL + shopDetail.detail.shopInnerUrl)"></li>
                <li>店铺门脸照：<img :src="formatImage(shopDetail.detail.shopFaceUrl)" alt="" @click="showBigImage(UPLOADURL + shopDetail.detail.shopFaceUrl)"></li>
                <li>店铺位置图：<div class="amap-container" v-if="shopDetail.detail">
                        <el-amap ref="amap" vid="amapDemo" class="amap" :zoom="zoom" :center="mapCenter">
                            <el-amap-marker v-for="(marker,index) in markers" :key="index" :position="marker.position" :title="marker.title"></el-amap-marker>
                        </el-amap>
                    </div>
                </li>
            </ul>
            <ul v-else>
                <li>无</li>
            </ul>
        </el-row>
        <el-row v-if="auditType=='qualification'" class="shop-detail">
            <h3>资质信息</h3>
            <h4>证件信息</h4>
            <div v-if="shopDetail">
                <ul v-if="shopDetail.document">
                    <li>证件类型：{{formatDocumentType(shopDetail.document.documentType)}}</li>
                    <li>证件号码：{{shopDetail.document.documentNum}}</li>
                    <li>证件正面照：<img :src="formatImage(shopDetail.document.fullFacePhotoUrl)" alt="" @click="showBigImage(UPLOADURL + shopDetail.document.fullFacePhotoUrl)"></li>
                    <li>证件手持正面照：<img :src="formatImage(shopDetail.document.handFullFacePhotoUrl)" alt="" @click="showBigImage(UPLOADURL + shopDetail.document.handFullFacePhotoUrl)"></li>
                    <li>证件反面照：<img :src="formatImage(shopDetail.document.reverseSideAsUrl)" alt="" @click="showBigImage(UPLOADURL + shopDetail.document.reverseSideAsUrl)"></li>
                    <li>附件：<img :src="formatImage(shopDetail.document.attachmentUrl)" alt="" @click="showBigImage(UPLOADURL + shopDetail.document.attachmentUrl)"></li>
                </ul>
                <ul v-else>
                    <li>无</li>
                </ul>
            </div>
            <h4>主体资质</h4>
            <div v-if="shopDetail">
                <ul v-if="shopDetail.subject">
                    <li>主体资质类型：{{formatSubjectDocument(shopDetail.subject.subjectDocument)}}</li>
                    <li>主体资质有效期：{{shopDetail.subject.longTerm ? '长期' : (moment(shopDetail.subject.beginTime).format("YYYY-MM-DD") + '至' + moment(shopDetail.subject.endTime).format("YYYY-MM-DD"))}}</li>
                    <li>资质照片：<img :src="formatImage(shopDetail.subject.businessUrl)" alt="" @click="showBigImage(UPLOADURL + shopDetail.subject.businessUrl)"></li>
                    <li>法定代表人 ：{{shopDetail.subject.legal}}</li>
                    <li>注册地址：{{shopDetail.subject.regAddress}}</li>
                    <li>注册号：{{shopDetail.subject.regNumber}}</li>
                    <li>单位名称：{{shopDetail.subject.unitName}}</li>
                    <li>附件：<img :src="formatImage(shopDetail.subject.attachmentUrl)" alt="" @click="showBigImage(UPLOADURL + shopDetail.subject.attachmentUrl)"></li>
                </ul>
                <ul v-else>
                    <li>无</li>
                </ul>
            </div>
            <h4>行业资质</h4>
            <div v-if="shopDetail">
                <ul v-if="shopDetail.industry">
                    <li>资质类型：{{formatIntelligence(shopDetail.industry.intelligence)}}</li>
                    <li>许可证有效期：{{shopDetail.industry.longTerm ? '长期' : (moment(shopDetail.industry.beginTime).format("YYYY-MM-DD") + '至' + moment(shopDetail.industry.endTime).format("YYYY-MM-DD"))}}</li>
                    <li>许可证照片：<img :src="formatImage(shopDetail.industry.foodUrl)" alt="" @click="showBigImage(UPLOADURL + shopDetail.industry.foodUrl)"></li>
                    <li>法定代表人：{{shopDetail.industry.legal}}</li>
                    <li>许可证地址：{{shopDetail.industry.licenseAddress}}</li>
                    <li>许可证编号：{{shopDetail.industry.licenseNumber}}</li>
                    <li>证件单位名称：{{shopDetail.industry.unitName}}</li>
                    <li>附件：<img :src="formatImage(shopDetail.industry.attachmentUrl)" alt="" @click="showBigImage(UPLOADURL + shopDetail.industry.attachmentUrl)"></li>
                </ul>
                <ul v-else>
                    <li>无</li>
                </ul>
            </div>
        </el-row>
        <el-row v-if="auditType=='settlement'" class="shop-detail">
            <h3>结算信息</h3>
            <ul v-if="shopDetail">
                <li>开户人名：{{shopDetail.openName}}</li>
                <li>银行卡号：{{shopDetail.bankNumber}}</li>
                <li>所属银行：{{shopDetail.bankHouse}}</li>
                <li>开户支行：{{shopDetail.openBank}}</li>
                <li>所属地：{{provinceName}}{{cityName}}</li>
            </ul>
            <el-row class="settlement">
                选择结算模板：
                <el-select v-model="settlementTemplateId" filterable placeholder="请选择结算模板">
                    <el-option
                      v-for="item in settlementTemplateList"
                      :key="item.settlementTemplateId"
                      :label="item.settlementTemplateName + ' - ' + item.percentageOfSettle"
                      :value="item.settlementTemplateId">
                    </el-option>
                  </el-select>
            </el-row>
        </el-row>
        <el-row>
            <span>审核操作：</span>
            <el-button type="primary" @click="pass">通过</el-button>
            <el-button type="danger" @click="showRegectDialog">拒绝</el-button>
        </el-row>
        <el-dialog :visible.sync="showImage" size="tiny" @close="closeDialog" class="dialog">
            <img :src="bigImageUrl" alt="" class="big-img" ref="bigImg">
            <div slot="footer" class="dialog-footer">
                <el-button @click="zoomOut"><i class="fa fa-search-minus"></i></el-button>
                <el-button @click="zoomIn"><i class="fa fa-search-plus"></i></el-button>
                <el-button @click="rotate"><i class="fa fa-rotate-left"></i></el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="rejectDialog" size="tiny" @close="closeRejectDialog" class="dialog" title="审核拒绝">
            <el-form label-width="80px">
                <el-form-item label="拒绝理由">
                    <el-input type="textarea" v-model="unauditReason"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="auditRemark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="closeRejectDialog">取消</el-button>
                <el-button type="primary" @click="reject">确定</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>
<script>
import {
    passShopAudit,
    findShopAuditById,
    rejectShopAudit,
    getShopSettlementTemplateLists
} from '@/api/api'
import {
    getProvinceById,
    getCityById
} from '@/api/region'
export default {
    data: function() {
        var that = this;
        return {
            shopId: '',
            shopDetail: null,
            provinceName: '',
            cityName: '',
            settlementTemplateList: [],
            settlementTemplateId: '',
            showImage: false,
            bigImageUrl: '',
            rotateDeg: 0,
            picZoom: 1,
            auditType: '',
            rejectDialog: false,
            unauditReason: '',
            auditRemark: '',
            zoom: 15,
            mapCenter: [],
            markers: []
        }
    },
    created: function() {
        var shopId = parseInt(this.$route.query.shopId);
        this.shopId = shopId;
        var type = this.$route.query.type;
        if (!shopId) {
            this.$message({
                type: 'error',
                message: '店铺查询失败!'
            })
            setTimeout(() => {
                this.$router.back()
            }, 2500)
            return;
        }
        if(!type){
            this.$message({
                type: 'error',
                message: '审核类型无效!'
            })
            setTimeout(() => {
                this.$router.back()
            }, 2500)
            return;
        }
        this.auditType = type;
        this.getShopAuditDetail(type, shopId);
    },
    methods: {
        getShopAuditDetail: function(type, shopId) {
            findShopAuditById(type, shopId).then(res => {
                console.log(res)
                this.shopDetail = res;
                if(type == 'base'){
                    this.mapCenter = [res.detail.longitude, res.detail.latitude]
                    this.markers = [{position: [res.detail.longitude, res.detail.latitude], title: res.shopName}]
                }
                if(type == 'settlement'){
                    this.getSettlementList()
                    this.getProvinceName()
                    this.geCityName()
                }
            })
        },
        getSettlementList: function(){
            getShopSettlementTemplateLists().then(res => {
                console.log(res)
                this.settlementTemplateList = res;
            })
        },
        back: function(){
            this.$router.back()
        },
        formatImage: function(url){
            return this.UPLOADURL + url + '/goods.png'
        },
        formatShopType: function(type){
            switch(type){
                case 'RESERVE':
                    return '预定';
                case 'TAKEOUT':
                    return '外卖';
                case 'RESERVE_TAKEOUT':
                    return '预定加外卖';
                default:
                    return '-';
            }
        },
        formatAuditStaus: function(type){
            switch(type){
                case 'WAIT_AUDIT':
                    return '等待审核';
                case 'AUDIT_ADOPT':
                    return '审核通过';
                case 'AUDIT_UNADOPT':
                    return '审核不通过';
                default:
                    return '-';
            }
        },
        formatSubjectDocument: function(type){
            switch(type){
                case 'BUSINESS_LICENSE':
                    return '营业执照';
                case 'LEGAL_PERSON_CERTIFICATE_OF_INSTITUTION':
                    return '事业单位法人证书';
                case 'REGISTRATION_CERTIFICATE_OF_PRIVATE_NON_ENTERPRISE_UNITS':
                    return '民办非企业单位登记证书';
                case 'SOCIAL_ORGANIZATION_LEGAL_PERSON_REGISTRATION_CERTIFICATE':
                    return '社会团体法人登记证书';
                default:
                    return '-';
            }
        },
        formatDocumentType: function(type){
            switch(type){
                case 'ID_CARD':
                    return '身份证';
                case 'HONG_KONG_AND_MACAO_RESIDENTS_TRAVEL_TO_AND_FROM_THE_MAINLAND':
                    return '港澳居民来往内地通行证';
                case 'TAIWAN_COMPATRIOTS_CERTIFICATE':
                    return '台胞证';
                case 'PASSPORT':
                    return '护照';
                default:
                    return '-';
            }
        },
        formatIntelligence: function(type){
            switch(type){
                case 'FOOD_SERVICE_LICENSE':
                    return '餐饮服务许可证';
                case 'FOOD_BUSINESS_LICENSE':
                    return '食品经营许可证';
                case 'FOOD_CIRCULATION_LICENSE':
                    return '食品流通许可证';
                case 'TEMPORARY_PUBLICITY_CARDS_FOR_FOOD_VENDORS':
                    return '食品摊贩临时经营公示卡';
                case 'NATIONAL_INDUSTRIAL_PRODUCT_PRODUCTION_LICENSE':
                    return '全国工业产品生产许可证';
                case 'CLASSIFICATION_CERTIFICATE_REGISTRATION_CERTIFICATE_FOR_SMALL_AND_MICRO_CATERING':
                    return '小微餐饮分级证';
                case 'PERMIT_FOR_FOOD_PRODUCTION_AND_PROCESSING_WORKSHOP':
                    return '食品生产加工作坊准许证';
                case 'FOOD_WORKSHOP_PRODUCTION_LICENSE':
                    return '食品小作坊生产许可证';
                default:
                    return '-';
            }
        },
        getProvinceName: function(){
            if(!this.shopDetail.provinceId) {
            	return;
            }
            try{
                Region.province.info(this.shopDetail.provinceId).then(res => {
                    console.log(res)
                    this.provinceName = res.provinceName;
                })
            } catch(e) {
                console.log(e)
            }
        },
        geCityName: function(){
            if(this.shopDetail.cityId) {
            	return;
            }
            try{
                Region.city.info(this.shopDetail.cityId).then(res=>{
                    console.log(res)
                    this.cityName = res.cityName;
                })
            } catch(e) {
                console.log(e)
            }
        },
        pass: function(){
            if(this.auditType == 'settlement' && this.settlementTemplateId == ''){
                this.$message({
                    type: 'error',
                    message: '请选择结算模板'
                })
                return;
            }
            this.$prompt('添加审核备注', '提示').then(({ value })=>{
                console.log(value)
                var params = {
                    auditRemark: value,
                    shopId: this.shopId
                }
                console.log(params)
                if(this.auditType == 'settlement'){
                    params.settlementTemplateId = this.settlementTemplateId;
                }
                passShopAudit(this.auditType, params).then(res => {
                    if(res){
                        this.$message({
                            type: 'success',
                            message: '操作成功！'
                        })
                        setTimeout(() => {
                            this.back()
                        }, 2000)
                    }
                })
            }).catch(()=>{})
        },
        showRegectDialog: function(){
            this.rejectDialog = true;
        },
        reject: function(){
            if(this.unauditReason == ''){
                this.$message({
                    type: 'error',
                    message: '请输入拒绝理由'
                })
                return;
            }
            var params = {
                auditRemark: this.auditRemark,
                shopId: this.shopId,
                unauditReason: this.unauditReason
            }
            console.log(params)
            rejectShopAudit(this.auditType, params).then((res)=>{
                if(res){
                    this.$message({
                        type: 'success',
                        message: '操作成功！'
                    })
                    setTimeout(() => {
                        this.back()
                    }, 2000)
                }
            })
        },
        closeRejectDialog: function(){
            this.rejectDialog = false;
            this.unauditReason = '';
            this.auditRemark = '';
        },
        closeDialog: function(){
            this.showImage = false;
            this.bigImageUrl = '';
            this.rotateDeg = 0;
            this.picZoom = 1;
            var img = this.$refs.bigImg;
            img.style.transform = 'rotate(0) scale(1)';
        },
        showBigImage: function(src){
            this.bigImageUrl = src;
            this.showImage = true;
        },
        rotate: function(){
            var img = this.$refs.bigImg;
            this.rotateDeg += 90;
            img.style.transform = 'rotate('+this.rotateDeg+'deg) scale('+this.picZoom+')';
        },
        zoomIn: function(){
            var img = this.$refs.bigImg;
            if(this.picZoom > 1.5){
                return;
            }
            this.picZoom += 0.1;
            img.style.transform = 'rotate('+this.rotateDeg+'deg) scale('+this.picZoom+')';
        },
        zoomOut: function(){
            var img = this.$refs.bigImg;
            if(this.picZoom < 0.5){
                return;
            }
            this.picZoom -= 0.1;
            img.style.transform = 'rotate('+this.rotateDeg+'deg) scale('+this.picZoom+')';
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
    .label-color {
        color: red;
    }
    .shop-detail{
        img{
            cursor: -moz-zoom-in;
            cursor: -webkit-zoom-in;
            cursor: zoom-in;
        }
    }
    img{
        vertical-align: middle;
    }
    .big-img{
        width: 100%;
        height: 100%;
    }
    .dialog-footer{
        text-align: center;
        position: relative;
        z-index: 99999;
    }
    .settlement{
        margin: 15px 0;
    }
    .amap-container {
        width: 600px;
        height: 300px;
    }
}
</style>