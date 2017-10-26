<template>
    <el-row class="lives-news">
        <el-col class="title">
            <h3>用户管理</h3>
        </el-col>
        <el-col>
            <el-form :inline="true">
                <el-form-item label="搜索用户">
                    <el-input placeholder="请输入店铺名称" icon="search" v-model="searchContent" :on-icon-click="searchCouponById">
                    </el-input>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col>
            <el-table :data="shopAppraise">
                <el-table-column label="用户名" width="160px" align="center">
                    <template scope="scope">{{scope.row.userName?scope.row.userName:'-'}}</template>
                </el-table-column>
                <el-table-column label="订单id" width="100px" align="center">
                    <template scope="scope">{{scope.row.orderId?scope.row.orderId:'-'}}</template>
                </el-table-column>
                <el-table-column label="环境评价星级" width="160px" align="center">
                    <template scope="scope">{{scope.row.environmentShopAppraise?scope.row.environmentShopAppraise:'-'}}</template>
                </el-table-column>
                <el-table-column label="商品评价信息" width="160px" align="center">
                    <template scope="scope">{{scope.row.goodsAppraiseList?scope.row.goodsAppraiseList:'-'}}</template>
                </el-table-column>
                <el-table-column label="服务评价星级" width="120px" align="center">
                    <template scope="scope">{{scope.row.serviceShopAppraise?scope.row.serviceShopAppraise:'-'}}</template>
                </el-table-column>
                <el-table-column label="味道评价星级" width="120px" align="center">
                    <template scope="scope">{{scope.row.tasteShopAppraise?scope.row.tasteShopAppraise:'-'}}</template>
                </el-table-column>
                <el-table-column label="评价内容" align="center">
                    <template scope="scope">{{scope.row.contentShopAppraise?scope.row.contentShopAppraise:'-'}}</template>
                </el-table-column>
                <el-table-column label="评价时间" width="200px" align="center">
                    <template scope="scope">{{moment(scope.row.appraiseTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
                </el-table-column>
                <el-table-column label="评价浏览量" width="120px" align="center">
                    <template scope="scope">{{scope.row.appraisePageView?scope.row.appraisePageView:'-'}}</template>
                </el-table-column>
                <el-table-column label="评价点赞数" width="120px" align="center">
                    <template scope="scope">{{scope.row.appraisePraiseCount?scope.row.appraisePraiseCount:'-'}}</template>
                </el-table-column>
                <el-table-column label="评价时间" width="200px" align="center">
                    <template scope="scope">{{moment(scope.row.appraiseTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
                </el-table-column>
            </el-table>
        </el-col>
        <!-- 分页 -->
        <el-col class="pagination">
            <el-pagination @current-change="currentChange" :current-page="pageId" :page-size="pageSize" layout="total, prev, pager, next" :total="counts">
            </el-pagination>
        </el-col>
    </el-row>
</template>
<script>
import {
    shopAppraiseList,
    findShopAppraiseById
} from '@/api/api'
export default {
    data: function() {
        return {
            searchContent: '',
            pageId: 1,
            pageSize: 10,
            counts: 0,
            shopAppraise: null
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getShopAppraiseLists();
    },
    methods: {
        //获取视频分类列表
        getShopAppraiseLists: function() {
            shopAppraiseList({ params: { pageId: this.pageId, pageSize: this.pageSize, shopName: this.searchContent } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.shopAppraise = data.list;
            })
        },
        //搜索
        searchCouponById: function() {
            this.getShopAppraiseLists();
        },
        //分页
        currentChange: function(val) {
            this.$router.push('?page=' + val)
            this.pageId = val;
            this.getShopAppraiseLists()
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