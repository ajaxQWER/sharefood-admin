<template>
    <el-row class="lives-news">
        <el-col class="title">
            <h3>用户管理</h3>
        </el-col>
        <el-col>
            <el-form :inline="true">
                <el-form-item label="搜索用户">
                    <el-input placeholder="请输入用户名" icon="search" v-model="searchContent" :on-icon-click="searchCouponById">
                    </el-input>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col>
            <el-table :data="userLists">
                <el-table-column label="用户名" width="160px" align="center">
                    <template scope="scope">{{scope.row.username?scope.row.username:'-'}}</template>
                </el-table-column>
                <el-table-column label="是否设置昵称" align="center">
                    <template scope="scope">{{scope.row.initNicknameed?'是':'否'}}</template>
                </el-table-column>
                <el-table-column label="昵称" align="center">
                    <template scope="scope">{{scope.row.nickname?scope.row.nickname:'-'}}</template>
                </el-table-column>
                <el-table-column label="余额" align="center">
                    <template scope="scope">{{scope.row.balance?scope.row.balance:'-'}}</template>
                </el-table-column>
                <el-table-column label="积分" align="center">
                    <template scope="scope">{{scope.row.integral?scope.row.integral:'-'}}</template>
                </el-table-column>
                <el-table-column label="优惠券数量" align="center">
                    <template scope="scope">{{scope.row.couponNumber?scope.row.couponNumber:'-'}}</template>
                </el-table-column>
                <el-table-column label="注册时间" align="center">
                    <template scope="scope">{{moment(scope.row.registrationTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
                </el-table-column>
                <el-table-column label="上次登录" align="center">
                    <template scope="scope">{{moment(scope.row.lastLoginTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
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
    userList,
    findUserById
} from '@/api/api'
export default {
    data: function() {
        return {
            searchContent: '',
            pageId: 1,
            pageSize: 10,
            counts: 0,
            userLists: null
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getUserLists();
    },
    methods: {
        //获取视频分类列表
        getUserLists: function() {
            userList({ params: { pageId: this.pageId, pageSize: this.pageSize, usernameLike: this.searchContent } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.userLists = data.list;
            })
        },
        //搜索
        searchCouponById: function() {
            this.getUserLists();
        },
        //分页
        currentChange: function(val) {
            this.$router.push('?page=' + val)
            this.pageId = val;
            this.getUserLists()
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