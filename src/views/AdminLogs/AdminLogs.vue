<template>
    <el-row class="lives-news">
        <el-col class="title">
            <h3>日志管理</h3>
        </el-col>
        <el-col>
            <el-table :data="logLists">
                <el-table-column label="用户名" align="center" prop="username"></el-table-column>
                <el-table-column label="日志ID" align="center" prop="adminLoggingId"></el-table-column>
                <el-table-column label="ip" align="center" prop="ip"></el-table-column>
                <el-table-column label="请求数据" width="500px" align="center" prop="data"></el-table-column>
                <el-table-column label="请求方法" align="center" prop="method"></el-table-column>
                <el-table-column label="请求地址" align="center" prop="uri"></el-table-column>
                <el-table-column label="操作时间" align="center">
                    <template slot-scope="scope">{{moment(scope.row.time).format('YYYY-MM-DD HH:mm:ss')}}</template>
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
    getAdminLogs
} from '@/api/api'
export default {
    data: function() {
        return {
            pageId: 1,
            pageSize: 10,
            counts: 0,
            logLists: null
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getUserLists();
    },
    methods: {
        //获取视频分类列表
        getUserLists: function() {
            getAdminLogs({ params: { pageId: this.pageId, pageSize: this.pageSize } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.logLists = data.list;
            })
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