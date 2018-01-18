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
                    <el-input placeholder="请输入店铺名称" v-model="params.shopNameLike" @keyup.enter.native="searchShop">
                    </el-input>
                </el-form-item>
                <el-form-item label="注册手机号">
                    <el-input placeholder="请输入手机号" v-model="params.phoneNum" @keyup.enter.native="searchShop">
                    </el-input>
                </el-form-item>
                <el-form-item label="搜索代理商">
                    <el-input placeholder="请输代理商" v-model="params.agentNameLike" @keyup.enter.native="searchShop">
                    </el-input>
                </el-form-item>
		        <el-form-item label="省">
		            <el-select v-model.number="params.provinceId" placeholder="选择省" filterable>
					    <el-option v-for="(item,index) in provinceList" :key="index" :label="item.provinceName" :value="item.provinceId" />
					</el-select>
		        </el-form-item>
		        <el-form-item label="市">
		            <el-select v-model.number="params.cityId" placeholder="选择市" filterable>
					    <el-option v-for="(item,index) in cityList" :key="index" :label="item.cityName" :value="item.cityId" />
					</el-select>
		        </el-form-item>
		        <el-form-item label="区">
		            <el-select v-model.number="params.areaId" placeholder="选择区" @change="areaChange" filterable>
					    <el-option v-for="(item,index) in areaList" :key="index" :label="item.areaName" :value="item.areaId" />
					</el-select>
		        </el-form-item>
                <el-form-item label="基本资料">
                    <el-select v-model.number="params.base" placeholder="全部"  filterable>
                        <el-option v-for="(item,index) in InfoArr" :key="index" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="配送信息">
                    <el-select v-model.number="params.delivery" placeholder="全部"  filterable>
                        <el-option v-for="(item,index) in InfoArr" :key="index" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="资质信息">
                    <el-select v-model.number="params.qualification" placeholder="全部" filterable>
                        <el-option v-for="(item,index) in InfoArr" :key="index" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="结算信息">
                    <el-select v-model.number="params.settlement" placeholder="全部" filterable>
                        <el-option v-for="(item,index) in InfoArr" :key="index" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchShop">查询</el-button>
                    <el-button type="danger" @click="resetSearch">重置查询条件</el-button>
                    <el-button type="primary" @click="exportShop" :loading="downloading">店铺导出</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table :data="shopAuditLists" border :row-style="{fontSize:'12px'}">
                <el-table-column prop="detail.shopId" label="店铺ID" align="center" width="90px"></el-table-column>
                <el-table-column prop="detail.shopName" label="店铺名称" align="center"></el-table-column>
                <el-table-column label="店铺位置" align="center" width="180px">
                    <template slot-scope="scope">
                        {{scope.row.detail.provinceName}}-{{scope.row.detail.cityName}}-{{scope.row.detail.areaName}}<br>
                        {{scope.row.detail.address}}
                    </template>
                    <!-- <el-table-column label="省" align="center" prop="detail.provinceName"></el-table-column>
                    <el-table-column label="市" align="center" prop="detail.cityName"></el-table-column>
                    <el-table-column label="区" align="center" prop="detail.areaName"></el-table-column> -->
                </el-table-column>
                <el-table-column prop="detail.phoneNum" label="注册手机号" align="center" width="140px"></el-table-column>
                <el-table-column label="店铺类型" align="center" width="120px">
                    <template slot-scope="scope">{{formatShopType(scope.row.detail.shopType)}}</template>
                </el-table-column>
                <el-table-column prop="agent.agentName" label="代理商" align="center" width="140px"></el-table-column>
                <el-table-column label="审核状态" align="center">
                    <el-table-column label="基本资料" align="center" width="120px">
                        <template slot-scope="scope">
                            {{formatAuditStatus(scope.row.shopAuditInformation.base)}} <span v-if="scope.row.shopAuditInformation.base == 'UNADOPT' && scope.row.shopAuditInformation.baseId" class="reason" @click="showUnadoptReason(scope.row.shopAuditInformation.baseId)">原因</span>
                            <el-button class="audit-btn" size="mini"type="primary" @click="getAuditbyId('base', scope.row)">审核</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="配送信息" align="center" width="140px">
                        <template slot-scope="scope">
                            {{formatAuditStatus(scope.row.shopAuditInformation.delivery)}} <span v-if="scope.row.shopAuditInformation.delivery == 'UNADOPT' && scope.row.shopAuditInformation.deliveryId" class="reason" @click="showUnadoptReason(scope.row.shopAuditInformation.deliveryId)">原因</span><br>
                            <el-button class="audit-btn" size="mini" type="primary" disabled @click="getAuditbyId('distribution', scope.row)">审核</el-button>
                            <el-button class="audit-btn" size="mini" type="primary" @click="commitToDeliveryBtn(scope.row)">提交配送审核</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="资质信息" align="center" width="120px">
                        <template slot-scope="scope">
                            {{formatAuditStatus(scope.row.shopAuditInformation.qualification)}} <span v-if="scope.row.shopAuditInformation.qualification == 'UNADOPT' && scope.row.shopAuditInformation.qualificationId" class="reason" @click="showUnadoptReason(scope.row.shopAuditInformation.qualificationId)">原因</span>
                            <el-button class="audit-btn" size="mini" type="primary" @click="getAuditbyId('qualification', scope.row)">审核</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="结算信息" align="center" width="120px">
                        <template slot-scope="scope">
                            {{formatAuditStatus(scope.row.shopAuditInformation.settlement)}} <span v-if="scope.row.shopAuditInformation.settlement == 'UNADOPT' && scope.row.shopAuditInformation.settlementId" class="reason" @click="showUnadoptReason(scope.row.shopAuditInformation.settlementId)">原因</span>
                            <el-button class="audit-btn" size="mini" type="primary" @click="getAuditbyId('settlement', scope.row)">审核</el-button>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="操作" align="center" width="130px">
                    <template slot-scope="scope">
                         <el-button class="audit-btn" :disabled="!formatDisabledStatus(scope.row)" size="mini" type="primary" @click="pushToAudit(scope.row)">上线推送</el-button>
                         <el-button class="audit-btn" size="mini" type="primary" @click="showChangeAgentDialog(scope.row)">更换代理商</el-button>
                    </template>
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
        <el-dialog title="更换代理商" :visible.sync="changeAgentDialog" size="tiny" @close="closeChangeAgentDialog" class="dialog">
            <el-form label-width="120px">
                <el-form-item label="选择代理商">
                    <el-select v-model="agentId" placeholder="请选择代理商" filterable>
                        <el-option
                            v-for="(item,index) in agentLists"
                            :key="index"
                            :label="item.agentName"
                            :value="item.agentId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeChangeAgentDialog">取 消</el-button>
                <el-button type="primary" @click="changeAgentFn">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="审核不通过原因" :visible.sync="auditDetail" size="tiny" @close="closeAuditDetail" class="dialog">
            <el-form label-width="120px" v-if="unadoptReason" class="reason-form">
                <el-form-item label="店铺名称:">
                    <span class="unadopt-text">{{unadoptReason.shopName}}</span>
                </el-form-item>
                <el-form-item label="审核类型:">
                    <span class="unadopt-text">{{formatAuditType(unadoptReason.auditType)}}</span>
                </el-form-item>
                <el-form-item label="审核人:">
                    <span class="unadopt-text">{{unadoptReason.operatorName}}({{formatAduitorType(unadoptReason.operatorType)}})</span>
                </el-form-item>
                <el-form-item label="审核时间:">
                    <span class="unadopt-text">{{moment(unadoptReason.auditTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
                </el-form-item>
                <el-form-item label="原因:">
                    <span class="unadopt-text">{{unadoptReason.unauditReason?unadoptReason.unauditReason:'未填写'}}</span>
                </el-form-item>
                <el-form-item label="备注:">
                    <span class="unadopt-text">{{unadoptReason.auditRemark?unadoptReason.auditRemark:'无'}}</span>
                </el-form-item>
            </el-form>
        </el-dialog>
    </el-row>
</template>
<script>
import {
    getShopAuditList,
    commitToDelivery,
    auditPush,
    getAgentLists,
    changeAgent,
    getAuditLogDetail
} from '@/api/api'
import {
	getProvinceList,
	getCityList,
	getAreaList
} from '@/api/region'
import {
    exportShopList
} from '@/api/exportExcel'
export default {
    data: function() {
        return {
        	params: {
            	shopNameLike: '',
            	phoneNum: '',
				provinceId: '',
				cityId: '',
				areaId: '',
                base: '',
                qualification: '',
                settlement: '',
                delivery: '',
                agentNameLike: '',
	            pageId: 1,
	            pageSize: 20
        	},
            shopId: 0,
            agentId: null,
            counts: 0,
            shopAuditLists: null,
            provinceList: [],
			cityList: [],
			areaList: [],
            agentLists: [],
            changeAgentDialog: false,
            InfoArr: [{
                value: '',
                label: '全部'
            },{
                value: 'UN_COMMIT',
                label: '未提交'
            },{
                value: 'UN_AUDIT',
                label: '未审核'
            },{
                value: 'IN_THE_REVIEW',
                label: '审核中'
            },{
                value: 'ADOPT',
                label: '已通过'
            },{
                value: 'UNADOPT',
                label: '不通过'
            }],
            unadoptReason: null,
            auditDetail: false,
            jwt: sessionStorage.getItem('jwt'),
            downloading: false,
            EXCEL: null
        }
    },
    created: function() {
        this.getAuditLists();
		getProvinceList().then(data => {
            var list = [];
            list.push({
                provinceId: null,
                provinceName: "不限"
            })

            this.provinceList = [].concat(list, data);
		})
        this.params.pageId = parseInt(this.$route.query.pageId) || 1;
        var shopNameLike = this.$route.query.shopNameLike || '';
        var phoneNum = this.$route.query.phoneNum || '';
        var base = this.$route.query.base || '';
        var qualification = this.$route.query.qualification || '';
        var settlement = this.$route.query.settlement || '';
        var delivery = this.$route.query.delivery || '';
        var agentNameLike = this.$route.query.agentNameLike || '';
        var provinceId = parseInt(this.$route.query.provinceId) || '';
        var cityId = parseInt(this.$route.query.cityId) || '';
        var areaId = parseInt(this.$route.query.areaId) || '';
        this.params.shopNameLike = shopNameLike;
        this.params.phoneNum = phoneNum;
        this.params.provinceId = provinceId;
        this.params.cityId = cityId;
        this.params.areaId = areaId;
        this.params.base = base;
        this.params.qualification = qualification;
        this.params.settlement = settlement;
        this.params.delivery = delivery;
        this.params.agentNameLike = agentNameLike;
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
    },
    watch: {
        'params.provinceId': function(newVal, oldVal){
            if (oldVal) {
                this.params.cityId = null;
                this.params.areaId = null;

                this.cityList = [];
                this.areaList = [];
            }

            if (newVal){
                getCityList(newVal).then(data => {
                    var list = [];
                    list.push({
                        cityId: null,
                        cityName: "不限"
                    })

                    this.cityList = [].concat(list, data);
                })
            }
        },
        'params.cityId': function(newVal, oldVal){
            if (oldVal) {
                this.params.areaId = null;

                this.areaList = [];
            }

            if (newVal){
               getAreaList(newVal).then(data => {
                    var list = [];
                    list.push({
                        areaId: null,
                        areaName: "不限"
                    })

                    this.areaList = [].concat(list, data);
                })
            }
        },
        'params.base': function(newVal, oldVal){
            this.getAuditLists()
        },
        'params.qualification': function(newVal, oldVal){
            this.getAuditLists()
        },
        'params.settlement': function(newVal, oldVal){
            this.getAuditLists()
        },
        'params.delivery': function(newVal, oldVal){
            this.getAuditLists()
        }
    },
    methods: {
		areaChange: function(value) {
			this.params.areaId = value;
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
                case 'UN_COMMIT':
                    return '未提交';
                case 'UN_AUDIT':
                    return '未审核';
                case 'IN_THE_REVIEW':
                    return '审核中';
                case 'ADOPT':
                    return '已通过';
                case 'UNADOPT':
                    return '不通过';
                default:
                    return '-';
            }
        },
        //分页
        currentChange: function(val) {
            // this.$router.push('?pageId=' + val)
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
        },
        //提交配送审核
        commitToDeliveryBtn: function(row){
            if(!row.shopId){
                this.$message({
                    message: '店铺id错误',
                    type: 'error'
                })
                return;
            }
            this.$confirm('是否将该店铺提交蜂鸟审核?', '提交蜂鸟审核', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                commitToDelivery(row.shopId).then(() => {
                    this.$message({
                        message: '提交成功',
                        type: 'success'
                    })
                    this.getAuditLists()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });
            });
        },
        //提前上线操作
        formatDisabledStatus: function(row){
            return (row.shopAuditInformation.base == 'ADOPT' && row.shopAuditInformation.delivery == 'ADOPT' && row.shopAuditInformation.qualification == 'ADOPT' && row.shopAuditInformation.settlement == 'ADOPT')
        },
        pushToAudit: function(row){
            if(!row.shopId){
                this.$message({
                    message: '店铺ID无效',
                    type: 'error'
                })
                return;
            }
            this.$confirm('是否上线推送该店铺?', '上线推送', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                auditPush(row.shopId).then(() => {
                    this.$message({
                        message: '店铺上线推送成功！',
                        type: 'success'
                    })
                    this.getAuditLists();
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });
            });
        },
        //更换代理商
        showChangeAgentDialog: function(row){
            getAgentLists({params: {pageSize: 9999999}}).then(res => {
                this.agentLists = res.list;
                this.shopId = row.shopId;
                this.agentId = row.agentId;
                this.changeAgentDialog = true;
            })
        },
        closeChangeAgentDialog: function(){
            this.shopId = 0;
            this.agentId = null;
            this.changeAgentDialog = false;
        },
        changeAgentFn: function(){
            if(!this.agentId){
                this.$message({
                    type: 'error',
                    message: '请选择代理商'
                });
                return;
            }
            var params = {
                agentId: this.agentId,
                shopId: this.shopId
            }
            changeAgent(params).then(res => {
                this.getAuditLists();
                this.$message({
                    type: 'success',
                    message: '操作成功!'
                });
                this.closeChangeAgentDialog()
            })
        },
        showUnadoptReason: function(id){
            getAuditLogDetail(id).then(res => {
                console.log(res)
                this.unadoptReason = res;
                this.auditDetail = true;
            })
        },
        closeAuditDetail: function(){
            this.unadoptReason = null;
            this.auditDetail = false;
        },
        formatAduitorType: function(type){
            switch(type){
                case 'AGENT':
                    return '代理商';
                case 'ADMIN':
                    return '管理员';
                case 'SYSTEM':
                    return '系统';
            }
        },
        formatAuditType: function(type){
            switch(type){
                case 'BASE':
                    return '基本资料';
                case 'QUALIFICATION':
                    return '资质信息';
                case 'SETTLEMENT':
                    return '结算信息';
                case 'DISTRIBUTION':
                    return '配送信息';
                case 'BASE_CHANGE':
                    return '基本资料修改';
                case 'QUALIFICATION_CHANGE':
                    return '资质信息修改';
                case 'SETTLEMENT_CHANGE':
                    return '结算信息修改';
            }
        },
        exportShop: function(){
            if(this.EXCEL){
                this.chunkBlob(this.EXCEL.data);
                return;
            }
            if(this.downloading){
                this.$message({
                    type: 'error',
                    message: '正在导出中!'
                });
                return
            }
            this.downloading = !this.downloading;
            exportShopList().then(res => {
                this.EXCEL = res;
                this.chunkBlob(res.data)
            }).catch(e=>{
                this.$message({
                    type: 'error',
                    message: '导出出错，请稍后再试！'
                });
                this.downloading = false;
                console.log(e)
            })
        },
        chunkBlob: function(data){
            var blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'})
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = this.moment(new Date()).format('YYYY-MM-DD') + '店铺列表.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
            this.downloading = false;
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
    .reason{
        color: #ff0000;
        text-decoration: underline;
        cursor: pointer;
    }
    .reason-form .el-form-item .el-form-item__label{
        font-weight: bold;
    }
    .reason-form .el-form-item{
        margin-bottom: 0;
    }
    .unadopt-text{
        color: #000;
    }
}
</style>