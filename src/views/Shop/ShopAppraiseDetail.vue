<template>
    <el-row class="appraise-detail">
        <el-row class="title">
            <h3>店铺评价详情</h3>
        </el-row>
        <el-row>
            <el-button type="primary" icon="arrow-left" @click="back">返回评价列表</el-button>
        </el-row>
        <el-row>
            <el-form v-if="appraiseObj">
                <el-form-item label="用户ID：">{{appraiseObj.userId}}</el-form-item>
                <el-form-item label="用户名称：">{{appraiseObj.userName}}</el-form-item>
                <el-form-item label="用户头像：">
                    <img :src="UPLOADURL + appraiseObj.avatorUrl + '/avator.png'" :alt="appraiseObj.userName" class="avator">
                </el-form-item>
                <el-form-item label="店铺ID：">{{appraiseObj.shopId}}</el-form-item>
                <el-form-item label="店铺名称：">{{appraiseObj.shopName}}</el-form-item>
                <el-form-item label="订单ID：">{{appraiseObj.orderId}}</el-form-item>
                <el-form-item label="订单名称：">{{appraiseObj.orderName}}</el-form-item>
                <el-form-item label="评价ID：">{{appraiseObj.shopAppraiseId}}</el-form-item>
                <el-form-item label="评价时间：">{{moment(appraiseObj.appraiseTime).format('YYYY-MM-DD HH:mm:ss')}}</el-form-item>
                <el-form-item label="评价内容：">{{appraiseObj.contentShopAppraise}}</el-form-item>
                <el-form-item label="评价时间：">{{moment(appraiseObj.appraiseTime).format('YYYY-MM-DD HH:mm:ss')}}</el-form-item>
                <el-form-item label="评价回复列表：">{{appraiseObj.contentShopAppraise}}</el-form-item>
                <el-form-item label="评价浏览量：">{{appraiseObj.appraisePageView}}</el-form-item>
                <el-form-item label="评价点赞量：">{{appraiseObj.appraisePraiseCount}}</el-form-item>
                <el-form-item label="配送评价：">
                    <div class="delivery">
                        <el-form-item label="评价id：">{{appraiseObj.deliveryAppraise.deliveryAppraiseId}}</el-form-item>
                        <el-form-item label="评价内容：">{{appraiseObj.deliveryAppraise.appraiseContent}}</el-form-item>
                        <el-form-item label="评价等级：">
                            <el-rate v-model="appraiseObj.deliveryAppraise.appraiseLevel" disabled text-color="#ff9900">
                            </el-rate>
                        </el-form-item>
                        <el-form-item label="评价时间：">{{moment(appraiseObj.deliveryAppraise.appraiseTime).format('YYYY-MM-DD HH:mm:ss')}}</el-form-item>
                        <el-form-item label="评价标签：">{{appraiseObj.deliveryAppraise.tagDeliveryAppraise}}</el-form-item>
                    </div>
                </el-form-item>
                <el-form-item label="商品评价：">
                    <el-table :data="appraiseObj.goodsAppraiseList" border style="width:1200px;">
                        <el-table-column prop="goodsId" label="商品id" align="center">
                        </el-table-column>
                        <el-table-column prop="goodsName" label="商品名称" align="center">
                        </el-table-column>
                        <el-table-column prop="appraiseContent" label="评价内容" align="center">
                        </el-table-column>
                        <el-table-column prop="appraiseLevel" label="评价等级" align="center">
                            <template slot-scope="scope">
                                <el-rate v-model="scope.row.appraiseLevel" disabled text-color="#ff9900">
                                </el-rate>
                            </template>
                        </el-table-column>
                        <el-table-column label="评价时间" align="center" prop="appraiseTime">
                            <template slot-scope="scope">{{moment(scope.row.appraiseTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
                        </el-table-column>
                        <el-table-column prop="tagGoodsAppraise" label="评价标签" align="center">
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="总评价星级：">
                    <el-rate v-model="appraiseObj.shopAppraise" disabled text-color="#ff9900">
                    </el-rate>
                </el-form-item>
                <el-form-item label="店铺评价图片URL列表：">
                	<img v-for="(item,index) in appraiseImg" :key="index" :src="UPLOADURL + item + '/evaluation.png'" alt="" class="appraiseImg">
                </el-form-item>
                <el-form-item label="评价标签：">{{appraiseObj.tagShopAppraise}}</el-form-item>
            </el-form>
        </el-row>
    </el-row>
</template>
<script>
import {
    findShopAppraiseById
} from '@/api/api'
export default {
    data: function() {
        return {
            shopAppraiseId: '',
            appraiseObj: null,
            appraiseImg: null
        }
    },
    created: function() {
        var id = this.$route.query.shopAppraiseId
        console.log(id);
        var params = {
            shopAppraiseId: id
        }
        findShopAppraiseById(params).then(res => {
            console.log(res);
            this.appraiseObj = res;
            this.appraiseImg = this.formatAppraiseImg(res.shopAppraiseImageUrl)
        })
    },
    methods: {
        back: function() {
            this.$router.back()
        },
        formatAppraiseImg: function(imgObj){
        	console.log(imgObj)
        	return imgObj.split(',');
        }
    }
}
</script>
<style scoped lang="scss">
.appraise-detail {
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
    .el-form-item {
        margin-bottom: 0;
    }
    .avator {
        height: 100px;
        vertical-align: middle;
    }
    .appraiseImg{
    	margin-right: 10px;;
    }
}
</style>