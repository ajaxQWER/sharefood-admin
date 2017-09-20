<template>
    <el-row class="lives-news">
        <el-col class="title">
            <h3>悬赏管理</h3>
        </el-col>
        <el-col>
            <el-table :data="rewardData">
                <el-table-column label="操作" align="center" width="120px">
                    <template scope="scope">
                        <el-button type="primary" size="small" @click="showRewardPKArticle(scope.$index, scope.row)">查看竞赏文稿</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="title" width="200px" label="标题" align="center"></el-table-column>
                <el-table-column prop="content" width="280px" label="内容" align="center"></el-table-column>
                <el-table-column width="100px" label="类型" align="center">
                    <template scope="scope">
                        {{formatRewardType(scope.row.type)}}
                    </template>
                </el-table-column>
                <el-table-column width="100px" prop="amountPay" label="悬赏金额" align="center"></el-table-column>
                <el-table-column prop="createUser.username" width="120px" label="发布者" align="center"></el-table-column>
                <el-table-column prop="commentsNumber" label="评论数" align="center"></el-table-column>
                <el-table-column prop="praiseNumber" label="点赞数" align="center"></el-table-column>
                <el-table-column width="180px" label="创建时间" align="center">
                    <template scope="scope">
                        {{moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column width="100px" label="是否完成" align="center">
                    <template scope="scope">
                        {{scope.row.finish?'已完成':'未完成'}}
                    </template>
                </el-table-column>
                <el-table-column width="180px" label="完成时间" align="center">
                    <template scope="scope">
                        {{scope.row.finishTime?moment(scope.row.finishTime).format('YYYY-MM-DD HH:mm:ss'):''}}
                    </template>
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
    getRewardLists,
    getRewardById
} from '@/api/api'
export default {
    data: function() {
        return {
            rewardData: null,
            pageId: 1,
            pageSize: 10,
            counts: 0,
            rowIndex: 0,
            productDialog: false
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getLists();
    },
    methods: {
        //获取视频列表
        getLists: function() {
            getRewardLists({ params: { pageId: this.pageId, pageSize: this.pageSize } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.rewardData = data.list;
            })
        },
        formatRewardType: function(type) {
            switch (type) {
                case 'A':
                    return '个股诊断';
                    break;
                case 'B':
                    return '季度策略';
                    break;
                case 'C':
                    return '半年策略';
                    break;
                case 'D':
                    return '年度策略';
                    break;
                case 'E':
                    return '其他悬赏';
                    break;
                default:
                    break;
            }
        },
        //分页
        currentChange: function(val) {
            this.$router.push('?page=' + val)
            this.pageId = val;
            this.getLists()
        },
        showRewardPKArticle: function(index,row){
            console.log(row)
            this.$router.push('/rewardPK?rewardId='+row.rewardId+'&isFinish='+row.finish)
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