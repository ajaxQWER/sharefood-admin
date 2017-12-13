<template>
    <el-row class="lives-news">
        <el-row>
            <el-col class="title">
                <h3>店铺审核</h3>
            </el-col>
        </el-row>
        <el-row>
            <el-form class="inline-form" :inline="true">
                <el-form-item label="搜索店铺">
                    <el-input placeholder="请输入店铺名称" v-model="params.shopNameLike" @blur="searchShop" @keyup.enter.native="searchShop">
                    </el-input>
                </el-form-item>
                <el-form-item label="注册手机号">
                    <el-input placeholder="请输入店铺名称" v-model="params.phoneNum" @blur="searchShop" @keyup.enter.native="searchShop">
                    </el-input>
                </el-form-item>
		        <el-form-item label="省">
		            <el-select v-model.number="params.provinceId" placeholder="不限" @change="provinceChange">
					    <el-option v-for="(item,index) in provinceList" :key="index" :label="item.provinceName" :value="item.provinceId" />
					</el-select>
		        </el-form-item>
		        <el-form-item label="市">
		            <el-select v-model.number="params.cityId" placeholder="不限" @change="cityChange">
					    <el-option v-for="(item,index) in cityList" :key="index" :label="item.cityName" :value="item.cityId" />
					</el-select>
		        </el-form-item>
		        <el-form-item label="区">
		            <el-select v-model.number="params.areaId" placeholder="不限" @change="areaChange">
					    <el-option v-for="(item,index) in areaList" :key="index" :label="item.areaName" :value="item.areaId" />
					</el-select>
		        </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchShop">查询</el-button>
                    <el-button type="danger" @click="resetSearch">重置查询条件</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table :data="shopAuditLists" border>
                <el-table-column prop="detail.shopId" label="店铺ID" align="center" width="100px"></el-table-column>
                <el-table-column prop="detail.shopName" label="店铺名称" align="center" width="300px"></el-table-column>
                <el-table-column label="店铺行政区" align="center">
                    <el-table-column label="省" align="center" prop="detail.provinceName"></el-table-column>
                    <el-table-column label="市" align="center" prop="detail.cityName"></el-table-column>
                    <el-table-column label="区" align="center" prop="detail.areaName"></el-table-column>
                </el-table-column>
                <el-table-column prop="detail.phoneNum" label="注册手机号" align="center" width="140px"></el-table-column>
                <el-table-column label="店铺类型" align="center" width="120px">
                    <template slot-scope="scope">{{formatShopType(scope.row.detail.shopType)}}</template>
                </el-table-column>
                <el-table-column label="审核状态" align="center">
                    <el-table-column label="基本资料" align="center" width="150px">
                        <template slot-scope="scope">
                            {{formatAuditStatus(scope.row.shopAuditInformation.base)}}
                            <el-button class="audit-btn" size="small"type="primary" @click="getAuditbyId('base', scope.row)">审核</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="配送信息" align="center" width="150px">
                        <template slot-scope="scope">
                            {{formatAuditStatus(scope.row.shopAuditInformation.delivery)}}
                            <el-button class="audit-btn" size="small" type="primary" disabled @click="getAuditbyId('distribution', scope.row)">审核</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="资质信息" align="center" width="150px">
                        <template slot-scope="scope">
                            {{formatAuditStatus(scope.row.shopAuditInformation.qualification)}}
                            <el-button class="audit-btn" size="small" type="primary" @click="getAuditbyId('qualification', scope.row)">审核</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="结算信息" align="center" width="150px">
                        <template slot-scope="scope">
                            {{formatAuditStatus(scope.row.shopAuditInformation.settlement)}}
                            <el-button class="audit-btn" size="small" type="primary" @click="getAuditbyId('settlement', scope.row)">审核</el-button>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row>
            <!-- 分页 -->
            <el-col class="pagination">
                <el-pagination @current-change="currentChange" :current-page="params.pageId" :page-size="params.pageSize" layout="total, prev, pager, next" :total="counts">
                </el-pagination>
            </el-col>
        </el-row>

    </el-row>
</template>
<script>
import {
	getProvinceList,
	getCityList,
	getAreaList,
    getShopAuditList
} from '@/api/api'
export default {
    data: function() {
        return {
        	params: {
            	shopNameLike: '',
            	phoneNum: '',
				provinceId: '',
				cityId: '',
				areaId: '',
	            pageId: 1,
	            pageSize: 20
        	},
            counts: 0,
            shopAuditLists: null,
            provinceList: [],
			cityList: [],
			areaList: []
        }
    },
    created: function() {
		getProvinceList().then(data => {
			this.provinceList = data
		})
        this.pageId = parseInt(this.$route.query.page) || 1;
        var shopNameLike = this.$route.query.shopNameLike || '';
        var phoneNum = this.$route.query.phoneNum || '';
        var provinceId = parseInt(this.$route.query.provinceId) || '';
        var cityId = parseInt(this.$route.query.cityId) || '';
        var areaId = parseInt(this.$route.query.areaId) || '';
        this.params.shopNameLike = shopNameLike;
        this.params.phoneNum = phoneNum;
        this.params.provinceId = provinceId;
        this.params.cityId = cityId;
        this.params.areaId = areaId;
        if(provinceId) {
            getCityList(provinceId).then(data => {
                this.cityList = data;
            })
        }
        if(cityId){
            getAreaList(cityId).then(data => {
                this.areaList = data;
            })
        }
        this.getAuditLists();
    },
    methods: {
		provinceChange: function(value) {
            if(value){
    			// this.params.provinceId = value;
                getCityList(value).then(data => {
                    this.params.cityId = data[0].cityId;
                    this.cityList = data;
                })
            }
		},
		cityChange: function(value) {
            if(value){
    			// this.params.cityId = value;
				getAreaList(value).then(data => {
                    this.params.areaId = data[0].areaId;
					this.areaList = data;
				})
            }
		},
		areaChange: function(value) {
			this.params.areaId = value;
        	// this.getAuditLists();
		},
        getAuditLists: function() {
            getShopAuditList({ params: this.params }).then(data => {
                var str = '?';
                for(var key in this.params){
                    if(this.params[key]){
                        str += key + '=' + this.params[key] + '&'
                    }
                }
                this.$router.push(str)
                console.log(data)
                this.counts = data.count;
                this.shopAuditLists = data.list;
            })
        },
        //搜索
        searchShop: function() {
            this.getAuditLists();
        },
        getAuditbyId: function(type,row){
            this.$router.push({path: '/shopAuditDetail',query: {shopId:row.shopId, type: type}})
        },
        formatShopType: function(type){
            switch(type){
                case 'TAKEOUT':
                    return '外卖';
                case 'RESERVE':
                    return '预定';
                case 'RESERVE_TAKEOUT':
                    return '预定加外卖';
            }
        },
        formatAuditStatus: function(auditType){
            switch(auditType){
                case 'UN_COMMIT,':
                    return '未提交';
                case 'UN_AUDIT':
                    return '未审核';
                case 'IN_THE_REVIEW':
                    return '审核中';
                case 'ADOPT':
                    return '通过';
                case 'UNADOPT':
                    return '不通过';
                default:
                    return '-';
            }
        },
        //分页
        currentChange: function(val) {
            this.$router.push('?page=' + val)
            this.params.pageId = val;
            this.getAuditLists()
        },
        resetSearch: function(){
            this.params = {
                shopNameLike: '',
                phoneNum: '',
                provinceId: '',
                cityId: '',
                areaId: '',
                pageId: 1,
                pageSize: 20
            }
            this.getAuditLists()
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
    .label-color{
        color: red;
    }
    .audit-btn{
        margin: 5px;
    }
}
</style>