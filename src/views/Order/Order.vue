<template>
    <el-row class="lives-news">
        <el-row>
            <el-col class="title">
                <h3>订单管理</h3>
            </el-col>
        </el-row>
        <el-row>
            <el-form class="inline-form" :inline="true" @sublimt.navite.prevent>
                <el-form-item label="搜索订单号">
                    <el-input placeholder="请输入订单号" icon="search" v-model="orderNum" :on-icon-click="searchOrder">
                    </el-input>
                </el-form-item>
                <el-form-item label="店铺名称">
                    <el-input placeholder="请输入店铺名称" icon="search" v-model="orderShopNameLike" :on-icon-click="searchOrder">
                    </el-input>
                </el-form-item>
                <el-form-item label="下单人">
                    <el-input placeholder="请输入下单人名称" icon="search" v-model="orderContactNameLike" :on-icon-click="searchOrder">
                    </el-input>
                </el-form-item>
                <el-form-item label="联系人手机号">
                    <el-input placeholder="请输入下单联系人手机号" icon="search" v-model="orderPhoneLike" :on-icon-click="searchOrder">
                    </el-input>
                </el-form-item>
                <el-form-item label="订单状态">
                    <el-select v-model="orderStatus" placeholder="请选择订单状态" @change="searchOrder">
                        <el-option
                          v-for="(item,index) in orderStatusList"
                          :key="index"
                          :label="item.key"
                          :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订单取消原因">
                    <el-select v-model="cancelType" placeholder="请选择订单取消原因" @change="searchOrder">
                        <el-option
                          v-for="(item,index) in cancelTypeArr"
                          :key="index"
                          :label="item.key"
                          :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="支付方式">
                    <el-select v-model="payment" placeholder="请选择订单支付方式" @change="searchOrder">
                        <el-option
                          label="全部"
                          value=" ">
                        </el-option>
                        <el-option
                          label="余额"
                          value="BALANCE">
                        </el-option>
                        <el-option
                          label="支付宝"
                          value="ALIPAY">
                        </el-option>
                        <el-option
                          label="微信"
                          value="WX">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订单起始时间">
                    <el-date-picker
                          v-model="dateRange"
                          type="datetimerange"
                          placeholder="选择时间范围"
                          align="right"
                          range-separator="~"
                          @change="selectDateRange">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetForm('ruleForm')">重置查询条件</el-button>
                    <el-button type="primary" @click="searchOrder" :disabled="autoFresh">更新订单数据</el-button>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="autoFresh">10秒自动更新订单</el-checkbox>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-col>
                <el-table :data="orderLists">
                    <el-table-column label="订单id" align="center">
                        <template scope="scope">{{scope.row.orderId?scope.row.orderId:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="订单号" align="center">
                        <template scope="scope">{{scope.row.orderNum?scope.row.orderNum:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="订单名称" align="center">
                        <template scope="scope">{{scope.row.orderName?scope.row.orderName:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="下单人" width="100px" align="center">
                        <template scope="scope">{{scope.row.orderContact.contactName?scope.row.orderContact.contactName:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="联系人手机号" width="140px" align="center">
                        <template scope="scope">{{scope.row.orderContact.contactPhone?scope.row.orderContact.contactPhone:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="下单时间" align="center">
                        <template scope="scope">{{moment(scope.row.addTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
                    </el-table-column>
                    <el-table-column label="订单价格" align="center">
                        <template scope="scope">{{scope.row.orderPrice?formatMoney(scope.row.orderPrice)+'元':'0.00元'}}</template>
                    </el-table-column>
                    <el-table-column label="支付方式" align="center">
                        <template scope="scope">{{formatPayment(scope.row.payment)}}</template>
                    </el-table-column>
                    <el-table-column label="支付完成" align="center">
                        <template scope="scope">{{scope.row.isFinishPay?'已支付':'未支付'}}</template>
                    </el-table-column>
                    <el-table-column label="订单状态" align="center">
                        <template scope="scope">
                            <span v-if="scope.row.orderStatus=='CANCELLATION'" style="color:red;">{{formatOrderStatus(scope.row.orderStatus)}}</span>
                            <span v-else>{{formatOrderStatus(scope.row.orderStatus)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="拒单原因" align="center">
                        <template scope="scope">
                            {{formatCancelType(scope.row.orderCancel.cancelType)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="店铺名称" width="240px" align="center">
                        <template scope="scope">{{scope.row.shopName?scope.row.shopName:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="操作" width="160px" align="center">
                        <template scope="scope">
                            <el-button size="small" type="primary" @click="showOrderInfo(scope.$index, scope.row)">查看详情</el-button>
                        </template>
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

    </el-row>
</template>
<script>
import {
    orderList,
    findOrderById
} from '@/api/api'
export default {
    data: function() {
        var _this = this;
        return {
            orderNum: '',
            pageId: 1,
            pageSize: 20,
            counts: 0,
            orderLists: null,
            orderStatus: '',
            orderShopNameLike: '',
            orderPhoneLike: '',
            dateRange: '',
            orderTimeBeginTime: '',
            orderTimeEndTime: '',
            orderContactNameLike: '',
            payment: '',
            autoFresh: false,
            interVal: null,
            orderStatusList: [{
                key: '全部订单',
                value: ''
            },{
                key: '交易完成',
                value: 'TRANSACT_FINISHED'
            },{
                key: '订单取消',
                value: 'CANCELLATION'
            },{
                key: '已送达',
                value: 'DELIVERED'
            },{
                key: '配送中',
                value: 'SHIPPING'
            },{
                key: '取货中',
                value: 'PICKUPING'
            },{
                key: '等待取货',
                value: 'WAIT_PICKUP'
            },{
                key: '商家接单',
                value: 'MERCHANT_CONFIRM_RECEIPT'
            },{
                key: '等待商家接单',
                value: 'PAYED'
            },{
                key: '等待支付',
                value: 'WAIT_PAY'
            }],
            cancelType: '',
            cancelTypeArr: [{
                key: '全部',
                value: ' '
            },{
                key: '用户取消',
                value: 'USER'
            },{
                key: '商家取消',
                value: 'SHOP'
            },{
                key: '支付超时',
                value: 'WAIT_PAY_TIMEOUT'
            },{
                key: '接单超时',
                value: 'RECEIVING_TIMEOUT'
            },{
                key: '配送拒绝',
                value: 'DELIVERY_REJECT'
            }]
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getOrderLists();
    },
    watch: {
        autoFresh: function(val, oldVal){
            if(val){
                this.interVal = setInterval(() => {
                   this.getOrderLists();
                }, 10000)
            }else{
                clearInterval(this.interVal)
                this.interVal = null;
            }
        }
    },
    destroyed: function(){
        clearInterval(this.interVal)
        this.interVal = null;
    },
    methods: {
        //获取视频分类列表
        getOrderLists: function() {
            orderList({ params: { pageId: this.pageId, pageSize: this.pageSize,orderNum: this.orderNum, orderStatus: this.orderStatus, orderShopNameLike: this.orderShopNameLike, orderTimeBeginTime: this.orderTimeBeginTime, orderTimeEndTime: this.orderTimeEndTime, orderContactNameLike: this.orderContactNameLike,orderPhoneLike: this.orderPhoneLike, payment: this.payment, cancelType: this.cancelType } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.orderLists = data.list;
            })
        },
        //搜索
        searchOrder: function() {
            this.getOrderLists();
        },
        //分页
        currentChange: function(val) {
            this.$router.push('?page=' + val)
            this.pageId = val;
            this.getOrderLists()
        },
        formatOrderStatus: function(status){
            switch(status){
                case 'WAIT_PAY':
                    return '等待支付';
                case 'PAYED':
                    return '等待商家接单';
                case 'SHIPPING':
                    return '配送中';
                case 'CANCELLATION':
                    return '订单取消';
                case 'TRANSACT_FINISHED':
                    return '交易完成';
                case 'MERCHANT_CONFIRM_RECEIPT':
                    return '商家接单';
                case 'WAIT_PICKUP':
                    return '等待取货';
                case 'PICKUPING':
                    return '取货中';
                case 'DELIVERED':
                    return '已送达';
                default:
                    break;
            }
        },
        showOrderInfo: function(index, row){
            var orderId = row.orderId;
            this.$router.push('/orderDetail?orderId=' + orderId)
        },
        selectDateRange: function(value){
            if(!value){
                this.orderTimeBeginTime = '';
                this.orderTimeEndTime = '';
                this.getOrderLists();
                // this.orderTimeEndTime = '';
                return;
            }
            var dateRange = value.split('~');
            this.orderTimeBeginTime = dateRange[0];
            this.orderTimeEndTime = dateRange[1];
            this.getOrderLists();
        },
        resetForm: function(formName) {
            this.orderNum = '';
            this.orderStatus = '';
            this.orderShopNameLike = '';
            this.dateRange = '';
            this.orderTimeBeginTime = '';
            this.orderTimeEndTime = '';
            this.orderContactNameLike = '';
            this.orderPhoneLike = '';
            this.getOrderLists();
        },
        formatPayment: function(status){
            switch(status){
                case 'WX':
                    return '微信';
                case 'ALIPAY':
                    return '支付宝';
                case 'BALANCE':
                    return '余额';
                default:
                    break;
            }
        },
        formatCancelType: function(type){
            switch(type){
                case 'USER':
                    return '用户取消';
                case 'SHOP':
                    return '商家取消';
                case 'WAIT_PAY_TIMEOUT':
                    return '支付超时';
                case 'RECEIVING_TIMEOUT':
                    return '接单超时';
                case 'DELIVERY_REJECT':
                    return '配送拒绝';
                default:
                    return '-'
            }
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
}
</style>