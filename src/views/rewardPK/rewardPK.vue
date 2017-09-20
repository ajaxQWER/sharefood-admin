<template>
    <el-row class="lives-news">
        <el-col class="title">
            <h3>产品订单</h3>
        </el-col>
        <el-col>
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" icon="arrow-left" @click="back">返回竞赏列表</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col>
            <el-table :data="rewardPKLists">
                <el-table-column prop="name" label="老师名称" align="center"></el-table-column>
                <el-table-column prop="createTime" label="参赏时间" align="center">
                    <template scope="scope">
                        {{moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column prop="thumbUpNumber" width="100px" label="点赞数" align="center"></el-table-column>
                <el-table-column prop="win" width="100px" label="是否获赏" align="center">
                    <template scope="scope">
                        {{scope.row.win?'是':'否'}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="280px" align="center">
                    <template scope="scope">
                        <el-button size="small" @click="handleUpdate(scope.$index, scope.row)">修改点赞</el-button>
                        <el-button v-if="!isFinish" size="small" type="danger" @click="handleSetWin(scope.$index, scope.row)">设置获赏</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
        <!-- 分页 -->
        <el-col class="pagination">
            <el-pagination @current-change="currentChange" :current-page="pageId" :page-size="pageSize" layout="total, prev, pager, next" :total="counts">
            </el-pagination>
        </el-col>
        <el-dialog title="修改点赞数" :visible.sync="dialog" size="tiny" @close="closeDialog" class="dialog">
            <el-form :model="params" label-width="100px" ref="userObj">
                <el-form-item label="点赞数">
                   <el-input-number v-model="params.thumbUpNumber" @change="handleChange" :min="0"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="setUps">确 定</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>
<script>
import {
    getRewardPKArticleList,
    updateRewardPKArticleList,
    setRewardPKFinish
} from '@/api/api'
export default {
    data: function() {
        return {
            params: {
                rewardId: 0,
                thumbUpNumber: 0,
                rewardPKId: 0
            },
            isFinish: false,
            pageId: 1,
            pageSize: 10,
            counts: 0,
            dialog: false,
            rewardPKLists: null
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        var rewardId = parseInt(this.$route.query.rewardId);
        var isFinish = this.$route.query.isFinish
        if (!rewardId) {
            this.$router.back()
        }
        this.isFinish = isFinish;
        this.params.rewardId = rewardId;
        this.getLists();
    },
    methods: {
        //获取视频列表
        getLists: function() {
            getRewardPKArticleList({ rewardId: this.params.rewardId, pageId: this.pageId, pageSize: this.pageSize }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.rewardPKLists = data.list;
            })
        },
        handleUpdate: function(index, row) {
            this.dialog = true;
            this.params = {
                rewardId: row.rewardId,
                rewardPKId: row.rewardPKId,
                thumbUpNumber: row.thumbUpNumber
            }
        },
        handleChange: function(val){
            this.params.thumbUpNumber = val;
        },
        closeDialog: function(){
            this.params = {
                rewardId: 0,
                rewardPKId: 0,
                thumbUpNumber: 0
            }
        },
        cancel: function(){
            this.dialog = false;
        },
        setUps: function(){
            console.log(this.params)
            updateRewardPKArticleList(this.params).then(data => {
                this.getLists()
                this.$message({
                    message: '修改成功',
                    type: 'success'
                })
                this.dialog = false;
            })
        },
        handleSetWin: function(index, row) {
            setRewardPKFinish(this.params).then(()=>{
                this.getLists()
                this.$message({
                    message: '设置成功',
                    type: 'success'
                })
                this.dialog = false;
            })
        },
        //分页
        currentChange: function(val) {
            this.$router.push('?page=' + val)
            this.pageId = val;
            this.getLists()
        },
        back: function() {
            this.$router.back()
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