<template>
    <el-row class="lives-news">
        <el-row>
            <el-col class="title">
                <h3>用户管理</h3>
            </el-col>
        </el-row>
        <el-row>
            <el-form class="inline-form" :inline="true" @sublimt.navite.prevent>
                <el-form-item label="搜索用户">
                    <el-input placeholder="请输入用户名" icon="search" v-model="searchContent" :on-icon-click="searchCouponById"></el-input>
                </el-form-item>
                <el-form-item label="用户注册起始时间">
                    <el-date-picker
                          v-model="dateRange"
                          type="datetimerange"
                          placeholder="选择时间范围"
                          align="right"
                          range-separator="~"
                          @change="selectDateRange">
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-col>
                <el-table :data="userLists">
                    <el-table-column label="用户名" width="160px" align="center">
                        <template slot-scope="scope">{{scope.row.username?scope.row.username:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="是否设置昵称" align="center">
                        <template slot-scope="scope">{{scope.row.initNicknameed?'是':'否'}}</template>
                    </el-table-column>
                    <el-table-column label="昵称" align="center">
                        <template slot-scope="scope">{{scope.row.nickname?scope.row.nickname:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="余额" align="center">
                        <template slot-scope="scope">{{scope.row.balance?formatMoney(scope.row.balance)+'元':'0.00元'}}</template>
                    </el-table-column>
                    <el-table-column label="积分" align="center">
                        <template slot-scope="scope">{{scope.row.integral}}</template>
                    </el-table-column>
                    <el-table-column label="优惠券数量" align="center">
                        <template slot-scope="scope">{{scope.row.couponNumber?scope.row.couponNumber:'0'}}</template>
                    </el-table-column>
                    <el-table-column label="注册时间" align="center">
                        <template slot-scope="scope">{{moment(scope.row.registrationTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
                    </el-table-column>
                    <el-table-column label="上次登录" align="center">
                        <template slot-scope="scope">{{moment(scope.row.lastLoginTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
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
    userList,
    findUserById
} from '@/api/api'
export default {
    data: function() {
        return {
            searchContent: '',
            pageId: 1,
            pageSize: 20,
            counts: 0,
            dateRange: '',
            registrationBeginTime: '',
            registrationEndTime: '',
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
            userList({ params: { pageId: this.pageId, pageSize: this.pageSize, usernameLike: this.searchContent, registrationBeginTime: this.registrationBeginTime, registrationEndTime: this.registrationEndTime } }).then(data => {
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
        },
        selectDateRange: function(value){
            if(!value){
                this.registrationBeginTime = '';
                this.registrationEndTime = '';
                this.getUserLists();
                return;
            }
            var dateRange = value.split('~');
            this.registrationBeginTime = dateRange[0];
            this.registrationEndTime = dateRange[1];
            this.getUserLists();
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