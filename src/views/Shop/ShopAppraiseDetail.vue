<template>
    <el-row class="appraise-detail" v-loading="loading">
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
                        <el-form-item label="评价标签：">
                        	<div v-if="appraiseObj.deliveryAppraise.tagDeliveryAppraise">
	                        	<el-tag type="primary" v-for="(item,index) in appraiseObj.deliveryAppraise.tagDeliveryAppraise.split(',')" :key="index" class="tag">{{item}}</el-tag>
                        	</div>
                        	<div v-else>无</div>
                        </el-form-item>
                    </div>
                </el-form-item>
                <el-form-item label="商品评价：">
                    <el-table :data="appraiseObj.goodsAppraiseList" border>
                        <el-table-column prop="goodsAppraiseId" label="评价id" align="center" width="100px">
                        </el-table-column>
                        <el-table-column prop="goodsId" label="商品id" align="center" width="100px">
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
                        <el-table-column label="评价标签" align="center">
                        	<template slot-scope="scope">
                        	    <div v-if="scope.row.tagGoodsAppraise">
		                        	<el-tag type="primary" v-for="(item,index) in scope.row.tagGoodsAppraise.split(',')" :key="index" class="tag">{{item}}</el-tag>
	                        	</div>
	                        	<div v-else>无</div>
                        	</template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="总评价星级：">
                    <el-rate v-model="appraiseObj.shopAppraise" disabled text-color="#ff9900">
                    </el-rate>
                </el-form-item>
                <el-form-item label="店铺评价图片URL列表：">
                	<div v-if="appraiseImg">
                		<img v-for="(item,index) in appraiseImg" :key="index" :src="UPLOADURL + item + '/evaluation.png'" alt="" class="appraiseImg" @click="showBigImage(UPLOADURL + item)">
                	</div>
                	<div v-else>无</div>
                </el-form-item>
                <el-form-item label="评价标签：">
            	    <div v-if="appraiseObj.tagShopAppraise">
                    	<el-tag type="primary" v-for="(item,index) in appraiseObj.tagShopAppraise.split(',')" :key="index" class="tag">{{item}}</el-tag>
                	</div>
                	<div v-else>无</div>
                </el-form-item>
            </el-form>
        </el-row>
        <el-dialog :visible.sync="showImage" size="tiny" @close="closeDialog" class="dialog">
            <img :src="bigImageUrl" alt="" class="big-img" ref="bigImg">
            <div slot="footer" class="dialog-footer">
                <el-button @click="zoomOut"><i class="fa fa-search-minus"></i></el-button>
                <el-button @click="zoomIn"><i class="fa fa-search-plus"></i></el-button>
                <el-button @click="rotate"><i class="fa fa-rotate-left"></i></el-button>
            </div>
        </el-dialog>
    </el-row>
</template>
<script>
import {
    findShopAppraiseById
} from '@/api/api'
export default {
    data: function() {
        return {
        	loading: true,
            shopAppraiseId: '',
            appraiseObj: null,
            appraiseImg: null,
            showImage: false,
            bigImageUrl: '',
            rotateDeg: 0,
            zoom: 1
        }
    },
    created: function() {
        var id = this.$route.query.shopAppraiseId;
        var params = {
            shopAppraiseId: id
        }
        findShopAppraiseById(params).then(res => {
            // console.log(res);
            this.appraiseObj = res;
	        if(res.shopAppraiseImageUrl){
	            this.appraiseImg = this.formatAppraiseImg(res.shopAppraiseImageUrl)
	        }
	        this.loading = false;
        })
    },
    methods: {
        back: function() {
            this.$router.back()
        },
        formatAppraiseImg: function(imgObj){
        	console.log(imgObj)
        	return imgObj.split(',');
        },
        closeDialog: function(){
            this.showImage = false;
            this.bigImageUrl = '';
            this.rotateDeg = 0;
            this.zoom = 1;
            var img = this.$refs.bigImg;
            img.style.transform = 'rotate(0) scale(1)';
        },
        showBigImage: function(src){
            this.bigImageUrl = src;
            this.showImage = true;
        },
        rotate: function(){
            var img = this.$refs.bigImg;
            this.rotateDeg += 90;
            img.style.transform = 'rotate('+this.rotateDeg+'deg) scale('+this.zoom+')';
        },
        zoomIn: function(){
            var img = this.$refs.bigImg;
            if(this.zoom > 1.5){
                return;
            }
            this.zoom += 0.1;
            img.style.transform = 'rotate('+this.rotateDeg+'deg) scale('+this.zoom+')';
        },
        zoomOut: function(){
            var img = this.$refs.bigImg;
            if(this.zoom < 0.5){
                return;
            }
            this.zoom -= 0.1;
            img.style.transform = 'rotate('+this.rotateDeg+'deg) scale('+this.zoom+')';
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
    .delivery{
    	width: 500px;
    	display: inline-block;

    }
    .appraiseImg{
    	margin-right: 10px;;
    }
    .shop-model{
        img{
            cursor: -moz-zoom-in;
            cursor: -webkit-zoom-in;
            cursor: zoom-in;
        }
    }
    img{
        vertical-align: middle;
    }
    .big-img{
        width: 100%;
        height: 100%;
    }
    .dialog-footer{
        text-align: center;
        position: relative;
        z-index: 99999;
    }
    .tag{
    	margin: 0 5px;
    }
}
</style>