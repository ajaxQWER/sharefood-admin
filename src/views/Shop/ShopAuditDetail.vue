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
        <el-row v-if="shopDetail">
            <h3>店铺基本信息</h3>
            <ul>
                <li>店铺ID：{{shopDetail.detail.shopId}}</li>
                <li>店铺名称：{{shopDetail.detail.shopName}}</li>
                <li>店铺类型：{{formatShopType(shopDetail.detail.shopType)}}</li>
                <li>审核状态：{{formatAuditStaus(shopDetail.detail.audit)}}</li>
                <li>店铺地址：{{shopDetail.detail.address}}</li>
                <li>营业时间：{{shopDetail.detail.busBeginTime}}-{{shopDetail.detail.busEndTime}}</li>
                <li>配送费：{{shopDetail.detail.fee}}</li>
                <li>送餐电话：{{shopDetail.detail.takeOutPhone}}</li>
                <li>店铺上架状态：{{shopDetail.detail.shelves?'上架':'下架'}}</li>
                <li>店铺注册手机号：{{shopDetail.detail.phoneNum}}</li>
                <li>店铺联系人：{{shopDetail.detail.name}}</li>
                <li>店铺分类：{{shopDetail.detail.shopCategoryName}}</li>
                <li>店铺logo：<img :src="UPLOADURL +'/'+ shopDetail.detail.logoUrl" alt=""></li>
                <li>店内照：<img :src="formatImage(shopDetail.detail.shopInnerUrl)" alt=""></li>
                <li>店铺门脸照：<img :src="shopDetail.detail.shopFaceUrl" alt=""></li>
            </ul>
            <h3>资质信息</h3>
            <h4 v-if="shopDetail.document">证件信息</h4>
            <ul v-if="shopDetail.document">
                <li>证件类型：{{formatDocumentType(shopDetail.document.documentType)}}</li>
                <li>证件号码：{{shopDetail.document.documentNum}}</li>
                <li>证件正面照：<img :src="formatImage(shopDetail.document.fullFacePhotoUrl)" alt=""></li>
                <li>证件手持正面照：<img :src="formatImage(shopDetail.document.handFullFacePhotoUrl)" alt=""></li>
                <li>证件反面照：<img :src="formatImage(shopDetail.document.reverseSideAsUrl)" alt=""></li>
            </ul>
            <h4 v-if="shopDetail.subject">主体资质</h4>
            <ul v-if="shopDetail.subject">
                <li>主体资质类型：{{formatSubjectDocument(shopDetail.subject.subjectDocument)}}</li>
                <li>主体资质有效期：{{shopDetail.subject.longTerm ? '长期' : (moment(shopDetail.subject.beginTime).format("YYYY-MM-DD") + '至' + moment(shopDetail.subject.endTime).format("YYYY-MM-DD"))}}</li>
                <li>资质照片：<img :src="formatImage(shopDetail.subject.businessUrl)" alt=""></li>
                <li>法定代表人 ：{{shopDetail.subject.legal}}</li>
                <li>注册地址：{{shopDetail.subject.regAddress}}</li>
                <li>注册号：{{shopDetail.subject.regNumber}}</li>
                <li>单位名称：{{shopDetail.subject.unitName}}</li>
            </ul>
            <h4 v-if="shopDetail.industry">行业资质</h4>
            <ul v-if="shopDetail.industry">
                <li>资质类型：{{formatIntelligence(shopDetail.industry.intelligence)}}</li>
                <li>许可证有效期：{{shopDetail.industry.longTerm ? '长期' : (moment(shopDetail.industry.beginTime).format("YYYY-MM-DD") + '至' + moment(shopDetail.industry.endTime).format("YYYY-MM-DD"))}}</li>
                <li>许可证照片：<img :src="formatImage(shopDetail.industry.foodUrl)" alt=""></li>
                <li>法定代表人：{{shopDetail.industry.legal}}</li>
                <li>许可证地址：{{shopDetail.industry.licenseAddress}}</li>
                <li>许可证编号：{{shopDetail.industry.licenseNumber}}</li>
                <li>证件单位名称：{{shopDetail.industry.unitName}}</li>
            </ul>
            <h3 v-if="shopDetail.settlement">结算信息</h3>
            <ul v-if="shopDetail.settlement">
                <li>银行卡号：{{shopDetail.settlement.bankNumber}}</li>
                <li>所属银行：{{shopDetail.settlement.bankHouse}}</li>
                <li>银行所在地：{{provinceName}}{{cityName}}</li>
                <li>开户支行：{{shopDetail.settlement.openBank}}</li>
            </ul>
        </el-row>
        <el-row class="settlement">
            <el-select v-model="settlementTemplateId" filterable placeholder="请选择">
                <el-option
                  v-for="item in settlementTemplateList"
                  :key="item.settlementTemplateId"
                  :label="item.settlementTemplateName + ' - ' + item.percentageOfSettle"
                  :value="item.settlementTemplateId">
                </el-option>
              </el-select>
        </el-row>
        <el-row>
            <span>审核操作：</span>
            <el-button type="primary" @click="pass">通过</el-button>
            <el-button type="danger" @click="reject">拒绝</el-button>
        </el-row>
    </el-row>
</template>
<script>
import {
    passShopAudit,
    findShopAuditById,
    rejectShopAudit,
    getProvinceById,
    getCityById,
    getSettlementTemplateLists
} from '@/api/api'
export default {
    data: function() {
        return {
            shopDetail: null,
            provinceName: '',
            cityName: '',
            settlementTemplateList: [],
            settlementTemplateId: ''
        }
    },
    created: function() {
        var shopId = parseInt(this.$route.query.shopId);
        this.getSettlementList()
        if (!shopId) {
            this.$message({
                type: 'error',
                message: '店铺查询失败'
            })
            setTimeout(() => {
                this.$router.push('/shopAudit')
            }, 2500)
            return;
        }
        this.getShopAuditDetail(shopId);
    },
    methods: {
        getShopAuditDetail: function(shopId) {
            findShopAuditById(shopId).then(res => {
                console.log(res)
                this.shopDetail = res;
                this.getProvinceName()
                this.geCityName()
            }).catch(err => {
                console.log(err)
                setTimeout(() => {
                    this.$router.push('/shopAudit')
                }, 2500)
            })
        },
        getSettlementList: function(){
            getSettlementTemplateLists({params: {pageSize: 9999}}).then(res => {
                console.log(res)
                this.settlementTemplateList = res.list;
            })
        },
        back: function(){
            this.$router.push('/shopAudit')
        },
        formatImage: function(url){
            return this.UPLOADURL + url
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
            try{
                getProvinceById(this.shopDetail.settlement.provinceId).then(res=>{
                    this.provinceName = res.provinceName;
                }).catch(err=>{
                    console.log(err)
                })
            } catch(e) {
                console.log(e)
            }
        },
        geCityName: function(){
            try{
                getCityById(this.shopDetail.settlement.cityId).then(res=>{
                    this.cityName = res.cityName;
                }).catch(err=>{
                    console.log(err)
                })
            } catch(e) {
                console.log(e)
            }
        },
        pass: function(){
            var params = {
                settlementTemplateId: this.settlementTemplateId,
                shopId: this.shopDetail.shopId
            }
            passShopAudit(params).then(res=>{
                if(res){
                    this.$message({
                        type: 'success',
                        message: '操作成功！'
                    })
                    this.back()
                }
            })
        },
        reject: function(){
            this.$prompt('请输入拒绝理由', '审核不通过').then(({ value })=>{
                var params = {
                    shopId: this.shopDetail.shopId,
                    unauditReason: value
                }
                rejectShopAudit(params).then((res)=>{
                    if(res){
                        this.$message({
                            type: 'success',
                            message: '操作成功！'
                        })
                        this.back()
                    }
                })
            }).catch(()=>{})
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
    img{
        vertical-align: middle;
        height: 120px;
    }
    .settlement{
        margin: 15px 0;
    }
}
</style>