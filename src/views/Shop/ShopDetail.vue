<template>
    <el-row class="lives-news">
        <el-row class="title">
            <h3>店铺详情</h3>
        </el-row>
        <el-row>
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="back"><i class="el-icon--left el-icon-arrow-left"></i>返回</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row v-if="shopModel">
            <el-row v-if="shopModel.detail">
                <h3>基础信息</h3>
                <el-form label-width="120px">
                    <el-form-item label="店铺名称" class="label">{{shopModel.detail.shopName}}</el-form-item>
                    <el-form-item label="负责人" class="label">{{shopModel.detail.name}}</el-form-item>
                    <el-form-item label="注册账号" class="label">{{shopModel.detail.phoneNum}}</el-form-item>
                    <el-form-item label="配送电话" class="label">{{shopModel.detail.takeOutPhone}}</el-form-item>
                    <el-form-item label="地址" class="label">{{shopModel.detail.address}}</el-form-item>
                    <el-form-item label="店铺类型" class="label">{{formatShopType(shopModel.detail.shopType)}}</el-form-item>
                    <el-form-item label="是否支持开票" class="label">{{shopModel.detail.canDrawInvoice?'是':'否'}}</el-form-item>
                    <el-form-item label="营业时间" class="label">{{shopModel.detail.busBeginTime}}-{{shopModel.detail.busEndTime}}</el-form-item>
                    <el-form-item label="冻结金额" class="label">{{shopModel.detail.accountFrozen + '元'}}</el-form-item>
                    <el-form-item label="可提现金额" class="label">{{shopModel.detail.amountWithdrawal + '元'}}</el-form-item>
                    <el-form-item label="可用余额" class="label">{{shopModel.detail.availableBalance + '元'}}</el-form-item>
                    <el-form-item label="店铺分类" class="label">{{shopModel.detail.shopCategoryName}}</el-form-item>
                    <el-form-item label="店铺上架状态" class="label">{{shopModel.detail.shelves?'上架':'下架'}}</el-form-item>
                    <el-form-item label="店铺营业状态" class="label">{{shopModel.detail.operatingState?'上架':'下架'}}</el-form-item>
                    <el-form-item label="审核状态" class="label">{{formatAuditStatus(shopModel.detail.audit)}}</el-form-item>
                    <el-form-item label="配送审核状态" class="label">{{formatAnubisStatus(shopModel.detail.deliveryAuditStatus)}}</el-form-item>
                    <el-form-item label="最低配送金额" class="label">{{shopModel.detail.minDeliveryPrice + '元'}}</el-form-item>
                    <el-form-item label="人均消费" class="label">{{shopModel.detail.preConsumption + '元'}}</el-form-item>
                    <el-form-item label="活动列表" class="label">
                        <el-table :data="shopModel.detail.shopActive" style="width: 800px;">
                            <el-table-column width="80px" property="activityId" label="活动ID" align="center"></el-table-column>
                            <el-table-column width="160px" property="activityName" label="活动名称" align="center"></el-table-column>
                            <el-table-column width="120px" property="activityType" label="活动类型" align="center">
                                <template scope="scope">
                                    {{formatActivityType(scope.row.activityType)}}
                                </template>
                            </el-table-column>
                            <el-table-column label="开始时间" align="center">
                                <template scope="scope">
                                    {{scope.row.beginTime?moment(scope.row.beginTime).format('YYYY-MM-DD'):'长期'}}
                                </template>
                            </el-table-column>
                            <el-table-column label="结束时间" align="center">
                                <template scope="scope">
                                    {{scope.row.endTime?moment(scope.row.endTime).format('YYYY-MM-DD'):'长期'}}
                                </template>
                            </el-table-column>
                            <el-table-column label="是否可用" align="center">
                                <template scope="scope">
                                    {{scope.row.isValid?'可用':'不可用'}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row v-if="shopModel.document">
                <h3>证件信息</h3>
                <el-form label-width="120px">
                    <el-form-item label="证件类型" class="label">{{formatDocumentType(shopModel.document.documentType)}}</el-form-item>
                    <el-form-item label="真实姓名" class="label">{{shopModel.document.readyName}}</el-form-item>
                    <el-form-item label="证件号码" class="label">{{shopModel.document.documentNum}}</el-form-item>
                    <el-form-item label="手持证件正面照"><img :src="UPLOADURL + shopModel.document.handFullFacePhotoUrl + '/goods.png'" alt="" @click="showBigImage(UPLOADURL + shopModel.document.handFullFacePhotoUrl)"></el-form-item>
                    <el-form-item label="正面照"><img :src="UPLOADURL + shopModel.document.fullFacePhotoUrl + '/goods.png'" alt="" @click="showBigImage(UPLOADURL + shopModel.document.fullFacePhotoUrl)"></el-form-item>
                    <el-form-item label="反面照"><img :src="UPLOADURL + shopModel.document.reverseSideAsUrl + '/goods.png'" alt="" @click="showBigImage(UPLOADURL + shopModel.document.reverseSideAsUrl)"></el-form-item>
                </el-form>
            </el-row>
            <el-row v-if="shopModel.subject">
                <h3>主体资质</h3>
                <el-form label-width="120px">
                    <el-form-item label="资质类型" class="label">{{formatSubjectDocument(shopModel.subject.subjectDocument)}}</el-form-item>
                    <el-form-item label="单位名称" class="label">{{shopModel.subject.unitName}}</el-form-item>
                    <el-form-item label="企业法人" class="label">{{shopModel.subject.legal}}</el-form-item>
                    <el-form-item label="注册地址" class="label">{{shopModel.subject.regAddress}}</el-form-item>
                    <el-form-item label="资质编号" class="label">{{shopModel.subject.regNumber}}</el-form-item>
                    <el-form-item label="照片"><img :src="UPLOADURL + shopModel.subject.businessUrl + '/goods.png'" alt="" @click="showBigImage(UPLOADURL + shopModel.subject.businessUrl)"></el-form-item>
                </el-form>
            </el-row>
            <el-row v-if="shopModel.industry">
                <h3>行业资质</h3>
                <el-form label-width="120px">
                    <el-form-item label="资质类型" class="label">{{formatIntelligence(shopModel.industry.intelligence)}}</el-form-item>
                    <el-form-item label="单位名称" class="label">{{shopModel.industry.unitName}}</el-form-item>
                    <el-form-item label="企业法人" class="label">{{shopModel.industry.legal}}</el-form-item>
                    <el-form-item label="注册地址" class="label">{{shopModel.industry.licenseAddress}}</el-form-item>
                    <el-form-item label="资质编号" class="label">{{shopModel.industry.licenseNumber}}</el-form-item>
                    <el-form-item label="照片"><img :src="UPLOADURL + shopModel.industry.foodUrl + '/goods.png'" alt="" @click="showBigImage(UPLOADURL + shopModel.industry.foodUrl)"></el-form-item>
                </el-form>
            </el-row>
            <el-row v-if="shopModel.settlement">
                <h3>结算信息</h3>
                <el-form label-width="120px">
                    <el-form-item label="开户人名" class="label">{{shopModel.settlement.openName}}</el-form-item>
                    <el-form-item label="银行卡号" class="label">{{shopModel.settlement.bankNumber}}</el-form-item>
                    <el-form-item label="所属地" class="label">{{provinceName}}-{{cityName}}</el-form-item>
                    <el-form-item label="开户行" class="label">{{shopModel.settlement.openBank}}</el-form-item>
                </el-form>
            </el-row>
        </el-row>
        <el-dialog :visible.sync="showImage" @close="closeDialog" class="dialog">
            <img :src="bigImageUrl" alt="" width="100%">
        </el-dialog>
    </el-row>
</template>
<script>
import { findShopById,getProvinceById,getCityById } from '@/api/api'
export default {
    data: function() {
        return {
            shopModel: null,
            provinceName: '',
            cityName: '',
            showImage: false,
            bigImageUrl: ''
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
                this.shopModel = data;
                if(data.settlement && data.settlement.provinceId){
                    this.getProvindeName(data.settlement.provinceId)
                }
                if(data.settlement && data.settlement.cityId){
                    this.getCityName(data.settlement.cityId)
                }
            })
        }
    },
    methods: {
        back: function() {
            this.$router.back()
        },
        formatAnubisStatus: function(auditType){
            switch(auditType){
                case 'UN_COMMIT,':
                    return '未提交';
                case 'UN_AUDIT':
                    return '未审核';
                case 'IN_THE_REVIEW':
                    return '审核中';
                case 'ADOPT':
                    return '审核通过';
                case 'UNADOPT':
                    return '审核不通过';
            }
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
        formatAuditStatus: function(type){
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
        formatActivityType: function(type){
            switch (type) {
                case 'FIRST':
                    return '首单立减';
                case 'DELGOLD':
                    return '购满就减';
                case 'COMPLIMENTARY':
                    return '购满就送';
                case 'SPECIALPRICES':
                    return '特价商品';
                case 'SALE':
                    return '折扣商品';
                case 'SPECIFIC':
                    return '其他';
            }
        },
        getProvindeName: function(provinceId){
            getProvinceById(provinceId).then(res => {
                this.provinceName = res.provinceName;
            })
        },
        getCityName: function(cityId){
            getCityById(cityId).then(res => {
                this.cityName = res.cityName;
            })
        },
        closeDialog: function(){
            this.showImage = false;
            this.bigImageUrl = '';
        },
        showBigImage: function(src){
            this.bigImageUrl = src;
            this.showImage = true;
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
    .label{
        color: #48576a;
        margin-bottom: 0;
    }
    img{
        vertical-align: middle;
        cursor: pointer;
    }
}
</style>