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
                <li>订单id：{{orderLists.orderId}}</li>
                <li>订单号：{{orderLists.orderNum}}</li>
                <li>订单名称：{{orderLists.orderName}}</li>
                <li>订单价格：{{orderLists.orderPrice?formatMoney(orderLists.orderPrice):'0.00'}}元</li>
                <li>订单状态：{{formatOrderStatus(orderLists.orderStatus)}}</li>
                <li v-if="orderLists.orderStatus=='CANCELLATION'">取消类型：{{formatOrderCancelType(orderLists.orderCancel.cancelType)}}</li>
                <li v-if="orderLists.orderStatus=='CANCELLATION'">取消原因：{{formatOrderCancelReason(orderLists.orderCancel.orderCancelReason)}}</li>
                <li>订单类型：{{formatOrderType(orderLists.orderType)}}</li>
                <!-- <li>订单支付SN号：{{orderLists.paymentSN}}</li> -->
                <li>订单备注：{{orderLists.orderContent?orderLists.orderContent:'-'}}</li>
                <li>订单添加时间：{{moment(orderLists.addTime).format('YYYY-MM-DD HH:mm:ss')}}</li>
                <li>联系人：{{orderLists.orderContact.contactName?orderLists.orderContact.contactName:'-'}}</li>
                <li>联系电话：{{orderLists.orderContact.contactPhone?orderLists.orderContact.contactPhone:'-'}}</li>
                <li>地址：{{orderLists.orderContact.address?orderLists.orderContact.address:'-'}}</li>
                <!-- <li>优惠券详情：{{orderLists.coupon}}</li> -->
                <!-- <li>可使用优惠券数量：{{orderLists.couponNum}}</li> -->
                <li>优惠券序列号：{{orderLists.couponSNId}}</li>
                <li>是否支付完成：{{orderLists.isFinishPay?'是':'否'}}</li>
                <li>订单支付时间：{{orderLists.payTime?moment(orderLists.payTime).format('YYYY-MM-DD HH:mm:ss'):'-'}}</li>
                <li>订单完成时间：{{orderLists.finishTime?moment(orderLists.finishTime).format('YYYY-MM-DD HH:mm:ss'):'-'}}</li>
                <li>支付方式：{{formatPayType(orderLists.payment)}}</li>
                <li v-if="orderLists.orderTakeout.carrierDriverName">
                    <div>骑手信息：
                        <p class="driver">骑手名字：{{orderLists.orderTakeout.carrierDriverName}}</p>
                        <p class="driver">联系电话：{{orderLists.orderTakeout.deliveryTime}}</p>
                    </div>
                </li>
                <li v-if="orderLists.orderType == 'RESERVE'">就餐人数：{{orderLists.repastNum}}人</li>
                <li v-if="orderLists.orderType == 'RESERVE'">就餐时间：{{moment(orderLists.repastTime).format('YYYY-MM-DD HH:mm:ss')}}</li>
                <li>是否包房：{{orderLists.isPrivateRoom?'是':'否'}}</li>
                <li v-if="orderLists.orderGoods.length">订单商品：
                    <el-table :data="orderLists.orderGoods" style="width: 800px; margin-left: 20px;">
                        <el-table-column label="序号" type="index" width="100" align="center"></el-table-column>
                        <el-table-column property="goodsName" label="商品名称" align="center"></el-table-column>
                        <el-table-column property="goodsCount" label="商品数量" align="center"></el-table-column>
                        <el-table-column property="goodsPrice" label="商品价格" align="center">
                            <template scope="scope">
                                {{scope.row.goodsPrice?formatMoney(scope.row.goodsPrice):'0.00'}}元
                            </template>
                        </el-table-column>
                    </el-table>
                </li>
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
                    return '新订单';
                case 'SHIPPING':
                    return '配送中';
                case 'CANCELLATION':
                    return '已取消';
                case 'TRANSACT_FINISHED':
                    return '已完成';
                case 'MERCHANT_CONFIRM_RECEIPT':
                    return '已接单';
                case 'WAIT_PICKUP':
                    return '待取货';
                case 'PICKUPING':
                    return '取货中';
                case 'DELIVERED':
                    return '已送达';
                default:
                    break;
            }
        },
	    formatOrderCancelType: function (cancelType) {
		    switch(cancelType){
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
				    break;
		    }
	    },
	    formatOrderCancelReason: function (cancelReason) {
		    switch(cancelReason){
			    case 'TEMPORARY_EMERGENCY':
				    return '临时有事，我不想要了';
			    case 'WRONG_INFORMATION':
				    return '信息错误，我想重新点';
			    case 'PAYMENT_PROBLEMS':
				    return '支付遇到问题';
			    case 'OTHER':
				    return '其他原因';
			    case 'CLICK_ERRORLY':
				    return '点错了，我想重新点';
			    default:
				    break;
		    }
	    },
        formatPayType: function(type){
            switch(type){
                case 'WX':
                    return '微信';
                case 'ALIPAY':
                    return '支付宝';
                case 'BALANCE':
                    return '余额';
                default:
                    return '-'
            }
        },
        formatOrderType: function(type){
            switch(type){
                case 'TAKEOUT':
                    return '外卖';
                case 'RESERVE':
                    return '预定';
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
    .order-lists {
        list-style: none;
        padding-left: 20px;
        line-height: 2;
        font-size: 16px;
    }
    .driver{
        padding-left: 20px;
        margin: 0;
    }
}
</style>