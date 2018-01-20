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
                <li>店铺ID：{{orderLists.shopId}}</li>
                <li>店铺名称：{{orderLists.shopName}}</li>
                <li>店铺电话：{{orderLists.phoneNum}}</li>
                <li>订单ID：{{orderLists.orderId}}</li>
                <li>订单号：{{orderLists.orderNum}}</li>
                <li>订单名称：{{orderLists.orderName}}</li>
                <li>订单价格：{{orderLists.orderPrice?formatMoney(orderLists.orderPrice):'0.00'}}元</li>
                <li>订单原价：{{orderLists.originalPrice?formatMoney(orderLists.originalPrice):'0.00'}}元</li>
                <li>订单商品数量：{{orderLists.orderGoodsCount}}</li>
                <li>订单商品总价：{{formatMoney(orderLists.orderGoodsPrice) + '元'}}</li>
                <li>订单原商品总价：{{formatMoney(orderLists.originalGoodsPrice) + '元'}}</li>
                <li>订单优惠价格：{{orderLists.favourablePrice}}元</li>
                <li>订单状态：{{formatOrderStatus(orderLists.orderStatus)}}</li>
                <li v-if="orderLists.orderStatus=='CANCELLATION'">
                    <div>订单取消：
                        <p class="driver">取消原因：{{formatOrderCancelReason(orderLists.orderCancel.orderCancelReason)}}<br>
                        取消类型：{{formatOrderCancelType(orderLists.orderCancel.cancelType)}}<br>
                        原因描述：{{orderLists.orderCancel.cancelContent}}</p>
                    </div>
                </li>
                <li>订单备注：{{orderLists.orderContent?orderLists.orderContent:'-'}}</li>
                <li v-if="orderLists.receivingTimeoutTime">接单超时时间：{{moment(orderLists.receivingTimeoutTime).format('YYYY-MM-DD HH:mm:ss')}}</li>
                <li>订单类型：{{formatOrderType(orderLists.orderType)}}</li>
                <li v-if="orderLists.orderType == 'RESERVE'">
                    <div>预定订单信息：
                        <p class="driver">是否包房：{{orderLists.orderReserve.isPrivateRoom?'是':'否'}}<br>就餐人数：{{orderLists.orderReserve.repastNum}}<br>
                        就餐时间：{{orderLists.orderReserve.repastTime}}</p>
                    </div>
                </li>
                <li v-else>
                    <div>外卖订单信息：
                        <p class="driver">配送员姓名：{{orderLists.orderTakeout.carrierDriverName || '-'}}<br>
                        联系电话：{{orderLists.orderTakeout.carrierDriverphone || '-'}}<br>
                        配送时间：{{moment(orderLists.orderTakeout.deliveryTime).format('YYYY-MM-DD HH:mm:ss')}}<br>
                        配送方式：{{formatDeliveryType(orderLists.orderTakeout.distributionType)}}<br>
                        餐盒费：{{formatMoney(orderLists.orderTakeout.mealFee)}}元<br>
                        配送费：{{formatMoney(orderLists.orderTakeout.shippingFee)}}元<br>
                        原运费：{{formatMoney(orderLists.orderTakeout.originalFreight)}}元<br>
                        基本运费：{{formatMoney(orderLists.orderTakeout.baseFreight)}}元<br>
                        距离加价：{{formatMoney(orderLists.orderTakeout.distancePremium)}}元<br>
                        运费折扣比例：{{orderLists.orderTakeout.freightDiscount*100}}%<br>
                        时间加价：{{formatMoney(orderLists.orderTakeout.timePremium)}}元
                    </p>
                    </div>
                </li>
                <li v-if="orderLists.orderContact">
                    <div>联系人信息：
                        <p class="driver">联系人ID：{{orderLists.orderContact.contactId}}<br>联系人：{{orderLists.orderContact.contactName?orderLists.orderContact.contactName:'-'}}<br>
                        性别：{{formatGender(orderLists.orderContact.gender)}}<br>
                        联系电话：{{orderLists.orderContact.contactPhone?orderLists.orderContact.contactPhone:'-'}}<br>
                        地址：{{orderLists.orderContact.address?orderLists.orderContact.address:'-'}}<br>
                        简单地址：{{orderLists.orderContact.simpleAddress?orderLists.orderContact.simpleAddress:'-'}}<br>
                        详细地址：{{orderLists.orderContact.detailAddress?orderLists.orderContact.detailAddress:'-'}}<br>
                        经度：{{orderLists.orderContact.longitude?orderLists.orderContact.longitude:'-'}}<br>
                        纬度：{{orderLists.orderContact.latitude?orderLists.orderContact.latitude:'-'}}<br>
                        门牌号：{{orderLists.orderContact.houseNumber?orderLists.orderContact.houseNumber:'-'}}
                    </p>
                    </div>
                </li>
                <li v-if="orderLists.coupon">
                    <div>优惠券信息
                        <p class="driver">优惠券ID：{{orderLists.coupon.couponId}}<br>
                        优惠券名称：{{orderLists.coupon.couponName}}<br>
                        优惠券金额：{{orderLists.coupon.money}}<br>
                        </p>
                    </div>
                </li>
                <li>优惠券序列号：{{orderLists.couponSNId || '-'}}</li>
                <li>是否支付完成：{{orderLists.isFinishPay?'是':'否'}}</li>
                <li>是否退款：{{orderLists.isRefund?'是':'否'}}</li>
                <li>支付方式：{{formatPayType(orderLists.payment)}}</li>
                <li>订单支付SN号：{{orderLists.paymentSN}}</li>
                <li>订单添加时间：{{moment(orderLists.addTime).format('YYYY-MM-DD HH:mm:ss')}}</li>
                <li>订单支付时间：{{orderLists.payTime?moment(orderLists.payTime).format('YYYY-MM-DD HH:mm:ss'):'-'}}</li>
                <li>订单送达时间：{{moment(orderLists.deliveredTime).format('YYYY-MM-DD HH:mm:ss')}}</li>
                <li>订单完成时间：{{orderLists.finishTime?moment(orderLists.finishTime).format('YYYY-MM-DD HH:mm:ss'):'-'}}</li>
                <li>订单完成超时时间：{{orderLists.finishTimeoutTime?moment(orderLists.finishTimeoutTime).format('YYYY-MM-DD HH:mm:ss'):'-'}}</li>
                <!-- <li v-if="orderLists.orderTakeout.carrierDriverName">
                    <div>骑手信息：
                        <p class="driver">骑手名字：{{orderLists.orderTakeout.carrierDriverName}}</p>
                        <p class="driver">联系电话：{{orderLists.orderTakeout.carrierDriverphone}}</p>
                    </div>
                </li> -->
                <li v-if="orderLists.orderInvoiceInfo">
                    <div>订单发票信息：
                        <p class="driver">抬头：{{orderLists.orderInvoiceInfo.title || '-'}}<br>
                        发票类型：{{formatInvoiceType(orderLists.orderInvoiceInfo.invoiceType)}}<br>
                        税号：{{orderLists.orderInvoiceInfo.ein || '-'}}<br>
                        </p>
                    </div>
                </li>
                <li>订单活动：
                    <el-table :data="orderLists.orderActivitys" style="width: 800px; margin-left: 20px;">
                        <el-table-column label="序号" type="index" width="100" align="center"></el-table-column>
                        <el-table-column property="activityId" label="活动ID" align="center" width="80px"></el-table-column>
                        <el-table-column property="activityReduced" label="优惠金额" align="center" width="100px"></el-table-column>
                        <el-table-column label="活动类型" align="center">
                            <template slot-scope="scope">
                                {{formatActivityType(scope.row.activityType)}}
                            </template>
                        </el-table-column>
                        <el-table-column property="activityContent" label="内容描述" align="center"></el-table-column>
                    </el-table>
                </li>
                <li v-if="orderLists.orderGoods.length">订单商品：
                    <el-table :data="orderLists.orderGoods" style="width: 1200px; margin-left: 20px;">
                        <el-table-column label="序号" type="index" width="100" align="center"></el-table-column>
                        <el-table-column property="goodsName" label="商品名称" align="center"></el-table-column>
                        <el-table-column property="goodsId" label="商品ID" align="center" width="100px"></el-table-column>
                        <el-table-column property="goodsCount" label="数量" align="center" width="80px"></el-table-column>
                        <el-table-column label="商品价格" align="center">
                            <template slot-scope="scope">
                                {{scope.row.goodsPrice?formatMoney(scope.row.goodsPrice):'0.00'}}元
                            </template>
                        </el-table-column>
                        <el-table-column label="原价小计" align="center">
                            <template slot-scope="scope">
                                {{scope.row.oldAmount?formatMoney(scope.row.oldAmount):'0.00'}}元
                            </template>
                        </el-table-column>
                        <el-table-column label="现价小计" align="center">
                            <template slot-scope="scope">
                                {{scope.row.amount?formatMoney(scope.row.amount):'0.00'}}元
                            </template>
                        </el-table-column>
                        <el-table-column label="添加时间" align="center">
                            <template slot-scope="scope">
                                {{moment(scope.row.addTime).format('YYYY-MM-DD HH:mm:ss')}}
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
        },
        formatDeliveryType: function(type){
            switch(type){
                case 'SELF_DELIVERY_BY_MERCHANTS':
                    return '商家自送';
                case 'ANUBIS':
                    return '蜂鸟';
                case 'ARES':
                    return '蜂鹰配送';
                default:
                    return '-'
            }
        },
        formatGender: function(gender){
            switch(gender){
                case 'MALE':
                    return '先生';
                case 'FEMALE':
                    return '女士';
                case 'UNKNOW':
                    return '未知';
                default:
                    return '-'
            }
        },
        formatActivityType: function(type){
            switch(type){
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
        formatInvoiceType: function(type){
             switch(type){
                case 'COMPANY':
                    return '公司';
                case 'INDIVIDUAL':
                    return '个人';
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
        padding-left: 40px;
        margin: 0;
    }
}
</style>