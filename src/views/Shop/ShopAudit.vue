<template>
    <el-row class="lives-news">
        <el-row>
            <el-col class="title">
                <h3>店铺审核</h3>
            </el-col>
        </el-row>
        <el-row>
            <el-form class="inline-form">
                <el-form-item label="搜索店铺"></el-form-item>
            </el-form>
            <el-col :span="4">
                <el-input placeholder="请输入店铺名称" icon="search" v-model="searchContent" :on-icon-click="searchShopCategory">
                </el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-table :data="shopAuditLists">
                    <el-table-column prop="shopId" label="店铺ID" align="center"></el-table-column>
                    <el-table-column prop="shopName" label="店铺名称" align="center"></el-table-column>
                    <el-table-column prop="phoneNum" label="注册手机号" align="center"></el-table-column>
                    <el-table-column label="店铺类型" align="center">
                        <template scope="scope">{{formatShopType(scope.row.shopType)}}</template>
                    </el-table-column>
                    <el-table-column label="审核状态" align="center">
                        <template scope="scope">{{formatAuditStatus(scope.row.audit)}}</template>
                    </el-table-column><el-table-column label="配送审核状态" align="center">
                    <template scope="scope">{{formatDeliveryAuditStatus(scope.row.deliveryAuditStatus)}}</template>
                </el-table-column>
                    <el-table-column label="操作" width="200px" align="center">
                        <template scope="scope">
                            <el-button size="small" type="primary" @click="getAuditbyId(scope.$index, scope.row)">审核</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row>
            <!-- 分页 -->
            <el-col class="pagination">
                <el-pagination @current-change="currentChange" :current-page="pageId" :page-size="pageSize" layout="total, prev, pager, next" :total="counts">
                </el-pagination>
            </el-col>
        </el-row>

    </el-row>
</template>
<script>
import {
    getShopAuditList
} from '@/api/api'
export default {
    data: function() {
        return {
            searchContent: '',
            pageId: 1,
            pageSize: 10,
            counts: 0,
            shopAuditLists: null
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getAuditLists();
    },
    methods: {
        //获取视频分类列表
        getAuditLists: function() {
            getShopAuditList({ params: { pageId: this.pageId, pageSize: this.pageSize, shopNameLike: this.searchContent } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.shopAuditLists = data.list;
            })
        },
        //搜索
        searchShopCategory: function() {
            this.getAuditLists();
        },
        getAuditbyId: function(inde,row){
            this.$router.push({path: '/shopAuditDetail',query: {shopId:row.shopId}})
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
                case 'WAIT_AUDIT':
                    return '等待审核';
                case 'AUDIT_ADOPT':
                    return '审核通过';
                case 'AUDIT_UNADOPT':
                    return '审核不通过';
            }
        },
        formatDeliveryAuditStatus: function(auditType){
            switch(auditType){
                case 'UN_COMMIT,':
                    return '未提交';
                case 'UN_AUDIT':
                    return '未审核';
                case 'IN_THE_REVIEW':
                    return '审核中';
                case 'ADOPT':
                    return '审核通过';
                case 'UNADOPT':
                    return '审核不通过';
            }
        },
        //分页
        currentChange: function(val) {
            this.$router.push('?page=' + val)
            this.pageId = val;
            this.getAuditLists()
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
}
</style>