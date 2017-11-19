<template>
    <el-row class="lives-news">
        <el-row>
            <el-col class="title">
                <h3>订单管理</h3>
            </el-col>
        </el-row>
        <el-row>
            <el-form class="inline-form">
                <el-form-item label="搜索订单"></el-form-item>
            </el-form>
            <el-col :span="4">
                <el-input placeholder="请输入订单号" icon="search" v-model="searchContent" :on-icon-click="searchOrder">
                </el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-table :data="orderLists">
                    <el-table-column label="订单号" align="center">
                        <template scope="scope">{{scope.row.orderNum?scope.row.orderNum:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="订单名称" align="center">
                        <template scope="scope">{{scope.row.orderName?scope.row.orderName:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="下单人" align="center">
                        <template scope="scope">{{scope.row.orderContact.contactName?scope.row.orderContact.contactName:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="下单时间" align="center">
                        <template scope="scope">{{moment(scope.row.addTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
                    </el-table-column>
                    <el-table-column label="订单价格" align="center">
                        <template scope="scope">{{scope.row.orderPrice?formatMoney(scope.row.orderPrice)+'元':'0.00元'}}</template>
                    </el-table-column>
                    <el-table-column label="订单状态" align="center">
                        <template scope="scope">
                            <span v-if="scope.row.orderStatus=='CANCELLATION'" style="color:red;">{{formatOrderStatus(scope.row.orderStatus)}}</span>
                            <span v-else>{{formatOrderStatus(scope.row.orderStatus)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="店铺名称" align="center">
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
        return {
            searchContent: '',
            pageId: 1,
            pageSize: 20,
            counts: 0,
            orderLists: null
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getOrderLists();
    },
    methods: {
        //获取视频分类列表
        getOrderLists: function() {
            orderList({ params: { pageId: this.pageId, pageSize: this.pageSize,orderNum: this.searchContent } }).then(data => {
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
                    return '支付完成,等待发货';
                case 'SHIPPING':
                    return '配送中';
                case 'CANCELLATION':
                    return '已取消';
                case 'TRANSACT_FINISHED':
                    return '交易完成';
                default:
                    break;
            }
        },
        showOrderInfo: function(index, row){
            var orderId = row.orderId;
            this.$router.push('/orderDetail?orderId=' + orderId)
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