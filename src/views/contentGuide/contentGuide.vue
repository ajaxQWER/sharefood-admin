<template>
    <el-row class="lives-news">
        <el-col class="title">
            <h3>内容导引</h3>
        </el-col>
        <el-col>
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="showDialog"><i class="el-icon-plus el-icon--left"></i>添加导引</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col>
            <el-table :data="contentGuideObj">
                <el-table-column prop="key" width="100px" label="标题" align="center"></el-table-column>
                <el-table-column prop="content" label="内容" align="center">
                    <template scope="scope">
                        <el-card class="box-card">
                            <div v-for="(val,index) of JSON.parse(scope.row.value)" :key="index" class="text-item">{{(index+1) + '、' + val.value}}</div>
                        </el-card>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160px" align="center">
                    <template scope="scope">
                        <el-button size="small" @click="handleUpdateContentGuide(scope.$index, scope.row)">修改</el-button>
                        <el-button type="danger" size="small" @click="handleDeleteContentGuide(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
        <!-- 分页 -->
        <el-col class="pagination">
            <el-pagination @current-change="currentChange" :current-page="pageId" :page-size="pageSize" layout="total, prev, pager, next" :total="counts">
            </el-pagination>
        </el-col>
        <el-dialog :title="isAdd?'新增导引':'修改导引'" :visible.sync="dialog" size="small" @close="closeDialog" class="dialog">
            <el-form :model="newGuideObj" label-width="100px" ref="newTeacher">
                <el-form-item label="标题">
                    <el-select v-model="newGuideObj.key" placeholder="请选择" v-if="isAdd">
                        <el-option
                          v-for="(item,index) in titleObj"
                          :key="index"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                    <el-input v-else v-model="newGuideObj.key" auto-complete="off" disabled></el-input>
                </el-form-item>
                <el-form-item v-for="(val, index) in newGuideObj.value" :label="'内容' + (index+1)" :key="val.key" :prop="'value.' + index + '.value'">
                    <el-input v-model="val.value" :placeholder="'内容'+(index+1)"></el-input>
                    <el-button @click.prevent="removeDomain(val)">删除</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="newContentGuide">新增内容</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="handleAddContentGuide">确 定</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>
<script>
import {
    getContentGuideLists,
    getContentGuideById,
    addContentGuide,
    deleteContentGuideByKey
} from '@/api/api'
export default {
    data: function() {
        return {
            newGuideObj: {
                key: '',
                value: [{ value: '' }]
            },
            titleObj: ['研究报告','主题精研','悬赏答疑','老师筛选','节目专栏'],
            contentGuideObj: null,
            pageId: 1,
            pageSize: 10,
            counts: 0,
            rowIndex: 0,
            isAdd: true,
            dialog: false
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getLists();
    },
    methods: {
        //获取视频列表
        getLists: function() {
            getContentGuideLists({ params: { pageId: this.pageId, pageSize: this.pageSize } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.contentGuideObj = data.list;
            })
        },
        showDialog: function() {
            this.dialog = true;
        },
        closeDialog: function() {
            this.isAdd = true;
            this.newGuideObj = {
                key: '',
                value: [{ value: '' }]
            }
        },
        //增加输入框
        newContentGuide: function() {
            this.newGuideObj.value.push({
                value: ''
            });
        },
        //删除输入框
        removeDomain: function(item) {
            var index = this.newGuideObj.value.indexOf(item)
            if (index !== -1) {
                this.newGuideObj.value.splice(index, 1)
            }
        },
        //添加内容导引
        handleAddContentGuide: function() {
            addContentGuide(this.newGuideObj).then(data => {
                this.$message({
                    type: 'success',
                    message: '添加成功'
                });
                this.getLists();
                this.dialog = false;
            })
        },
        //修改内容导引
        handleUpdateContentGuide: function(index, row) {
            this.rowIndex = index;
            this.dialog = true;
            this.isAdd = false;
            this.newGuideObj = {
                key: row.key,
                value: JSON.parse(row.value)
            }
        },
        handleDeleteContentGuide: function(index, row) {
            deleteContentGuideByKey(row).then(()=>{
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
        },
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
    .el-card {
        border: none;
        background-color: transparent;
        box-shadow: none;
    }
    .el-input {
        margin-right: 10px;
        vertical-align: top;
        width: 75%;
    }
    .text-item {
        text-align: left;
    }
}
</style>