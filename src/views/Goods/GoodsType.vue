<template>
    <el-row class="lives-news">
        <el-col class="title">
            <h3>视频分类管理</h3>
        </el-col>
        <el-col>
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="showAddDialog"><i class="el-icon-plus el-icon--left"></i>添加分类</el-button>
                </el-form-item>
                <el-form-item>
                    <el-input placeholder="请输入分类名称" icon="search" v-model="searchContent" :on-icon-click="searchVideoCategoryById">
                    </el-input>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col>
            <el-table :data="videoCategoryLists">
                <el-table-column prop="categoryId" label="分类ID" align="center">
                </el-table-column>
                <el-table-column prop="categoryName" label="分类名称" align="center"></el-table-column>
                <el-table-column prop="parentId" label="父级ID" align="center">
                </el-table-column>
                <el-table-column label="操作" width="160px" align="center">
                    <template scope="scope">
                        <el-button size="small" @click="updateVideoCategory(scope.$index, scope.row)">修改</el-button>
                        <el-button size="small" type="danger" @click="deleteVideoCategory(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
        <el-dialog :title="isAdd?'新增视频分类':'修改视频分类'" :visible.sync="addDialog" size="tiny" @close="closeaddDialog" class="dialog">
            <el-form :model="formInline" :rules="rules" ref="formInline">
                <el-form-item label="分类名称" prop="categoryName">
                    <el-input type="text" v-model="formInline.categoryName" auto-complete="off" placeholder="分类名称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAddCategory">取 消</el-button>
                <el-button type="primary" @click="addCategory" :loading="addLoading">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 分页 -->
        <el-col class="pagination">
            <el-pagination @current-change="currentChange" :current-page="pageId" :page-size="pageSize" layout="total, prev, pager, next" :total="counts">
            </el-pagination>
        </el-col>
    </el-row>
</template>
<script>
import {
    getVideoCategoryLists,
    addVideoCategory,
    deleteVideoCategoryById,
    updateVideoCategoryById
} from '@/api/api'
export default {
    data: function() {
        var checkCategoryName = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('分类名称不能为空'));
            } else {
                if (this.formInline.categoryName !== '') {
                    callback();
                }
            }
        };
        return {
            addLoading: false,
            addDialog: false,
            formInline: {
                categoryName: '',
                parentId: 0,
                categoryId: 0
            },
            searchContent: '',
            pageId: 1,
            pageSize: 10,
            counts: 0,
            isAdd: true,
            rules: {
                name: [{
                    validator: checkCategoryName,
                    trigger: 'blur'
                }]
            },
            videoCategoryLists: null
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getCategoryLists();
    },
    methods: {
        //获取视频分类列表
        getCategoryLists: function() {
            getVideoCategoryLists({ params: { pageId: this.pageId, pageSize: this.pageSize, categoryNameLike: this.searchContent } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.videoCategoryLists = data.list;
            })
        },
        //搜索
        searchVideoCategoryById: function() {
            this.getCategoryLists();
        },
        //显示添加弹窗
        showAddDialog: function() {
            this.addDialog = true;
        },
        //关闭添加弹窗
        closeaddDialog: function() {
            this.formInline.categoryName = '';
            this.isAdd = true;
        },
        //添加分类
        addCategory: function() {
            this.$refs['formInline'].validate((valid) => {
                if (valid) {
                    if (this.isAdd) {
                        addVideoCategory(this.formInline).then(data => {
                            // if (this.videoCategoryLists.length < this.pageSize) {
                            //     this.videoCategoryLists.push(data);
                            // }
                            // this.counts += 1;
                            this.getCategoryLists();
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            })
                            this.addDialog = false;
                        })
                    } else {
                        updateVideoCategoryById(this.formInline).then(data => {
                            this.getCategoryLists()
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            })
                            this.addDialog = false;
                        }).catch(err => {
                            console.error(err)
                        })
                    }
                }
            })
        },
        //取消添加分类
        cancelAddCategory: function() {
            this.addDialog = false;
        },
        //通过id修改分类的名称
        updateVideoCategory: function(index, row) {
            this.isAdd = false;
            this.addDialog = true;
            this.formInline = {
                parentId: row.parentId,
                categoryId: row.categoryId,
                categoryName: row.categoryName
            }

        },
        //通过id删除分类
        deleteVideoCategory: function(index, row) {
            this.$confirm('是否删除该分类?', '删除分类', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteVideoCategoryById(row.categoryId).then(data => {
                    if (this.videoCategoryLists.length <= this.pageSize && this.counts <= this.pageSize) {
                        this.videoCategoryLists.splice(index, 1);
                        this.counts -= 1;
                    } else {
                        this.getCategoryLists();
                    }
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //格式化分类名称显示
        formatCategoryName: function(name){
            switch (name) {
                case '1':
                    return ''
                    break;
                default:
                    // statements_def
                    break;
            }
        },
        //分页
        currentChange: function(val) {
            this.$router.push('?page=' + val)
            this.pageId = val;
            this.getCategoryLists()
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