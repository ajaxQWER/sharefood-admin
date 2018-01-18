<template>
    <el-row class="lives-news">
        <el-row>
            <el-col class="title">
                <h3>结算记录</h3>
            </el-col>
        </el-row>
        <el-row>
            <el-form class="inline-form" :inline="true" @sublimt.navite.prevent>
                <el-form-item>
                	<el-button type="primary" @click="showPopup">结算记录导出</el-button>
                </el-form-item>
                <el-form-item label="搜索记录">
                    <el-input placeholder="请输入流水号" icon="search" v-model="serialNumber" :on-icon-click="getDatas"></el-input>
                </el-form-item>
                <el-form-item label="是否到账">
                    <el-select v-model="arrivaled" @change="getDatas">
                        <el-option
                          label="全部"
                          value=" ">
                        </el-option>
                        <el-option
                          label="已到账"
                          :value="true">
                        </el-option>
                        <el-option
                          label="未到账"
                          :value="false">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="店铺名称">
                    <el-select v-model.number="shopId" filterable @change="getDatas">
                        <el-option
                            label="全部"
                            value=" ">
                        </el-option>
                        <el-option
                            v-for="(item,index) in shopLists"
                            :key="index"
                            :label="item.detail.shopName"
                            :value="item.shopId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="结算起始时间">
                    <el-date-picker
                          v-model="dateRange"
                          type="datetimerange"
                          placeholder="选择时间范围"
                          align="right"
                          range-separator="~"
                          @change="selectDateRange">
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-col>
                <el-table :data="SettlementRecordList" :row-style="{fontSize:'12px'}" border>
                    <el-table-column label="id" align="center" width="60px">
                        <template slot-scope="scope">{{scope.row.settlementRecordId?scope.row.settlementRecordId:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="流水号" align="center">
                        <template slot-scope="scope">{{scope.row.serialNumber?scope.row.serialNumber:'-'}}</template>
                    </el-table-column>
                    <el-table-column prop="shopName" label="店铺名称" align="center" width="160px"></el-table-column>
                    <el-table-column label="订单号" align="center">
                        <template slot-scope="scope">{{scope.row.orderNum?scope.row.orderNum:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="订单金额" align="center">
                        <template slot-scope="scope">{{scope.row.orderAmount?formatMoney(scope.row.orderAmount)+'元':'0.00元'}}</template>
                    </el-table-column>
                    <el-table-column label="配送费" align="center">
                        <template slot-scope="scope">{{scope.row.distributionFee?formatMoney(scope.row.distributionFee)+'元':'0.00元'}}</template>
                    </el-table-column>
                    <el-table-column label="代理商名称" align="center">
                        <template slot-scope="scope">{{scope.row.agentName?scope.row.agentName:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="是否到账" align="center" width="100px">
                        <template slot-scope="scope">{{scope.row.arrivaled?'已到账':'未到账'}}</template>
                    </el-table-column>
                    <el-table-column label="记录时间" align="center">
                        <template slot-scope="scope">{{moment(scope.row.recordTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
                    </el-table-column>
                    <el-table-column label="计划到账时间" align="center">
                        <template slot-scope="scope">{{moment(scope.row.planArrivalTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
                    </el-table-column>
                    <el-table-column label="实际到账时间" align="center">
                        <template slot-scope="scope">{{moment(scope.row.arrivalTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
                    </el-table-column>
                    <el-table-column label="费率" align="center" width="80px">
                        <template slot-scope="scope">{{scope.row.percentageOfSettle*100+'%'}}</template>
                    </el-table-column>
                    <el-table-column label="平台佣金" align="center">
                        <template slot-scope="scope">{{scope.row.platformAmount?formatMoney(scope.row.platformAmount)+'元':'0.00元'}}</template>
                    </el-table-column>
                    <el-table-column label="代理商佣金" align="center">
                        <template slot-scope="scope">{{scope.row.agentAmount?formatMoney(scope.row.agentAmount)+'元':'0.00元'}}</template>
                    </el-table-column>
                    <el-table-column label="商家佣金" align="center">
                        <template slot-scope="scope">{{scope.row.sellerAmount?formatMoney(scope.row.sellerAmount)+'元':'0.00元'}}</template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>

        <!-- 分页 -->
        <el-row>
            <el-col class="pagination">
                <el-pagination @current-change="currentChange" :current-page="pageId" :page-size="pageSize" layout="total, prev, pager, next" :total="counts">
                </el-pagination>
            </el-col>
        </el-row>
		<el-dialog title="结算信息导出" :visible.sync="dialog" size="tiny" @close="closeDialog" class="dialog">
		    <el-form label-width="120px">
		        <el-form-item label="选择日期">
		            <el-date-picker
				      v-model="settleLocalDate"
				      :editable="false"
				      type="date"
				      placeholder="选择结算日期"
				      @change="formatSettleDate">
				    </el-date-picker>
		        </el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
		        <el-button @click="cancel">取消</el-button>
		        <el-button type="primary" @click="exportExcel" :loading="downloading">导出</el-button>
		    </div>
		</el-dialog>
    </el-row>
</template>
<script>
import {
    getSettlementRecordLists,
    getSettlementRecordBySerialNumber,
    shopList
} from '@/api/api'
import {exportSettleRecord} from '@/api/exportExcel'
export default {
    data: function() {
        return {
            serialNumber: '',
            pageId: 1,
            pageSize: 20,
            counts: 0,
            dateRange: '',
            arrivaled: '',
            recordEndTime: '',
            recordBeginTime: '',
            dialog: false,
            jwt: sessionStorage.getItem('jwt'),
            settleLocalDate: '',
            SettlementRecordList: null,
            shopId: '',
            shopLists: null,
            downloading: false
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        shopList({params: {pageSize: 99999}}).then(res => {
            console.log(res)
            this.shopLists = res.list;
            this.getSettlementRecordLists();
        })
    },
    methods: {
        //获取视频分类列表
        getSettlementRecordLists: function() {
            getSettlementRecordLists({ params: { pageId: this.pageId, pageSize: this.pageSize, serialNumber: this.serialNumber, recordEndTime: this.recordEndTime, recordBeginTime: this.recordBeginTime, arrivaled: this.arrivaled, shopId: this.shopId } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.SettlementRecordList = data.list;
            })
        },
        //搜索
        getDatas: function() {
            this.getSettlementRecordLists();
        },
        //分页
        currentChange: function(val) {
            this.$router.push('?page=' + val)
            this.pageId = val;
            this.getSettlementRecordLists()
        },
        selectDateRange: function(value){
            if(!value){
                this.recordBeginTime = '';
                this.recordEndTime = '';
                this.getSettlementRecordLists();
                return;
            }
            var dateRange = value.split('~');
            this.recordBeginTime = dateRange[0];
            this.recordEndTime = dateRange[1];
            this.getSettlementRecordLists();
        },
        closeDialog: function(){
        	this.cancel()
        },
        cancel: function(){
        	this.dialog = false;
        	this.settleLocalDate = '';
        },
        showPopup: function(){
        	this.dialog = true;
        },
		formatSettleDate: function(value){
        	this.settleLocalDate = value;
		},
        exportExcel: function(){
            if(this.downloading){
                this.$message({
                    type: 'error',
                    message: '正在导出中!'
                });
                return
            }
            this.downloading = !this.downloading;
            exportSettleRecord({params: {settleLocalDate: this.settleLocalDate}}).then(res => {
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
            link.download = this.settleLocalDate + '结算记录';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
            this.downloading = false;
            this.closeDialog()
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
    .hidden-url{
    	display: none;
    }
}
</style>