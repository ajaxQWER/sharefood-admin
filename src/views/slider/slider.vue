<template>
    <el-row class="videoCategory">
        <el-col class="title">
            <h3>飞屏管理</h3>
        </el-col>
        <el-col>
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="showDialog"><i class="el-icon-plus el-icon--left"></i>添加飞屏</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col>
            <el-table :data="messageList">
                <el-table-column width="300px" prop="value" label="内容" align="center"></el-table-column>
                <el-table-column width="200px" label="创建时间" align="center">
                    <template scope="scope">
                        {{moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column label="是否显示" align="center">
                    <template scope="scope">
                        {{scope.row.display?'是':'否'}}
                    </template>
                </el-table-column>
                <el-table-column prop="weight" label="权重" align="center"></el-table-column>
                <el-table-column label="操作" width="280px" align="center">
                    <template scope="scope">
                        <el-button size="small" @click="handleUpdateMessage(scope.$index, scope.row)">修改</el-button>
                        <el-button size="small" type="danger" @click="handleDeleteMessage(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
        <!-- 分页 -->
        <el-col class="pagination">
            <el-pagination @current-change="currentChange" :current-page="pageId" :page-size="pageSize" layout="total, prev, pager, next" :total="counts">
            </el-pagination>
        </el-col>
        <!-- 修改 -->
        <el-dialog :title="isAdd?'新增飞屏':'修改飞屏'" :visible.sync="dialog" size="tiny" @close="closeDialog" class="dialog">
            <el-form :model="messageObj" label-width="100px" ref="messageObj">
                <el-form-item label="内容">
                    <el-input v-model="messageObj.value" auto-complete="off" placeholder="内容"></el-input>
                </el-form-item>
                <el-form-item label="是否展示">
                    <el-switch v-model="messageObj.display" on-text="是" off-text="否">
                    </el-switch>
                </el-form-item>
                <el-form-item label="权重" prop="weight">
                    <el-input-number size="small" v-model="messageObj.weight" :min="0"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="updateMessage">确 定</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>
<script>
import {
    getMessageLists,
    getMessageById,
    addMessage,
    updateMessageById,
    deleteMessageById
} from '@/api/api'
export default {
    data: function() {
        return {
            messageObj: {
                scrollingMessageId: '',
                display: true,
                value: '',
                weight: ''
            },
            isAdd: true,
            searchContent: '',
            pageId: 1,
            pageSize: 10,
            counts: 0,
            dialog: false,
            rowIndex: 0,
            messageList: null
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getLists();
    },
    methods: {
        //获取视频列表
        getLists: function() {
            getMessageLists({ params: { pageId: this.pageId, pageSize: this.pageSize } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.messageList = data.list;
            })
        },
        //点击添加视频按钮
        showDialog: function() {
            this.dialog = true;
        },
        //关闭弹窗层
        closeDialog: function() {
            this.messageObj = {
                scrollingMessageId: '',
                display: true,
                value: '',
                weight: ''
            }
        },
        //取消添加飞屏
        cancel: function() {
            this.dialog = false;
        },
        handleUpdateMessage: function(index,row){
            this.rowIndex = index;
            this.dialog = true;
            this.isAdd = false;
            this.messageObj = {
                scrollingMessageId: row.scrollingMessageId,
                display: row.display,
                value: row.value,
                weight: row.weight
            }
        },
        //添加飞屏
        updateMessage: function() {
            if(this.isAdd){
                addMessage(this.messageObj).then(()=>{
                    this.getLists();
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    })
                    this.dialog = false;
                })
            }else{
                updateMessageById(this.messageObj).then(data => {
                    console.log(data)
                    this.getLists()
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    })
                    this.dialog = false;
                })
            }
        },
        handleDeleteMessage: function(index,row){
            deleteMessageById(row).then(()=>{
                this.getLists();
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
            })
        },
        //分页
        currentChange: function(val) {
            this.$router.push('?page=' + val)
            this.pageId = val;
            this.getLists()
        }
    }
}
</script>
<style scoped lang="scss">
.videoCategory {
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
    .label-color {
        color: #ff0300;
    }
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 25%;
    }
}
</style>