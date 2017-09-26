<template>
    <el-row class="lives-news">
        <el-col class="title">
            <h3>订单详情</h3>
        </el-col>
        <el-col>
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="back"><i class="el-icon--left el-icon-arrow-left"></i>返回列表</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col>
            <ul class="order-lists" v-if="orderLists">
                <li>订单号：{{orderLists.orderNum}}</li>
                <li>订单名称：{{orderLists.orderName}}</li>
                <li>订单价格：{{orderLists.orderPrice?formatMoney(orderLists.orderPrice):'0.00'}}元</li>
                <li>订单状态：{{formatOrderStatus(orderLists.orderStatus)}}</li>
                <li>订单支付SN号：{{orderLists.paymentSN}}</li>
                <li>订单备注：{{orderLists.orderContent}}</li>
                <li>订单添加时间：{{moment(orderLists.addTime).format('YYYY-MM-DD HH:mm:ss')}}</li>
                <li>用户信息详情：{{orderLists.contact}}</li>
                <li>优惠券详情：{{orderLists.coupon}}</li>
                <li>可使用优惠券数量：{{orderLists.couponNum}}</li>
                <li>优惠券序列号：{{orderLists.couponSNId}}</li>
                <li>订单完成时间：{{orderLists.finishTime}}</li>
                <li>是否支付完成：{{orderLists.isFinishPay}}</li>
                <li>是否包房：{{orderLists.isPrivateRoom}}</li>
                <li>订单商品：
                    <el-table :data="orderLists.orderGoods" style="width: 500px; margin-left: 20px;">
                        <el-table-column label="序号" type="index" width="100" align="center"></el-table-column>
                        <el-table-column property="goodsName" label="商品名称" align="center"></el-table-column>
                        <el-table-column property="goodsCount" label="商品数量" align="center"></el-table-column>
                        <el-table-column property="goodsPrice" label="商品价格" align="center"></el-table-column>
                    </el-table>
                </li>
                <li>订单支付时间：{{orderLists.payTime}}</li>
                <li>支付方式：{{orderLists.payment}}</li>
                <li>就餐人数：{{orderLists.repastNum}}</li>
                <li>就餐时间：{{orderLists.repastTime}}</li>
            </ul>
        </el-col>
    </el-row>
</template>
<script>
import {
    findOrderById
} from '@/api/api'
export default {
    data: function() {
        return {
            orderLists: null
        }
    },
    created: function() {
        var orderId = this.$route.query.orderId;
        if (orderId) {
            findOrderById({ orderId: orderId }).then(data => {
                console.log(data)
                this.orderLists = data;
            })
        } else {
            this.$alert('订单信息错误', '错误提示', {
                confirmButtonText: '确定',
                callback: () => {
                    this.back()
                }
            });
        }
    },
    methods: {
        back: function() {
            this.$router.back()
        },
        formatOrderStatus: function(status){
            switch(status){
                case 'WAIT_PAY':
                    return '等待支付';
                case 'PAYED':
                    return '支付完成,等待发货';
                case 'SHIPPING':
                    return '';
                case 'CONFIRM_RECEIVE_GOODS':
                    return '配送中';
                case 'TRANSACT_FINISHED':
                    return '交易完成';
                default:
                    break;
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
    .order-lists {
        list-style: none;
        padding-left: 20px;
        line-height: 2;
        font-size: 16px;
    }
}
</style>