<template>
    <el-row class="lives-news">
        <el-col class="title">
            <h3>文章分类</h3>
        </el-col>
        <el-col>
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="showAddDialog"><i class="el-icon-plus el-icon--left"></i>添加文章分类</el-button>
                </el-form-item>
                <el-form-item>
                    <el-input placeholder="请输入文章分类名称" icon="search" v-model="searchContent" :on-icon-click="searchArticleTypeByName">
                    </el-input>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col>
            <el-table :data="ArticleType">
                <el-table-column label="分类ID" width="160px" align="center">
                    <template scope="scope">{{scope.row.articleCategoryId?scope.row.articleCategoryId:'-'}}</template>
                </el-table-column>
                <el-table-column label="分类名称" align="center">
                    <template scope="scope">{{scope.row.articleCategoryName?scope.row.articleCategoryName:'-'}}</template>
                </el-table-column>
                <el-table-column label="上级分类ID" align="center">
                    <template scope="scope">{{scope.row.parentId}}</template>
                </el-table-column>
                <el-table-column label="排序值" align="center">
                    <template scope="scope">{{scope.row.sortOrder}}</template>
                </el-table-column>
                <el-table-column label="操作" width="160px" align="center">
                    <template scope="scope">
                        <el-button size="small" @click="updateArticleCategory(scope.$index, scope.row)">修改</el-button>
                        <el-button size="small" type="danger" @click="deleteArticleCategory(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
        <el-dialog :title="isAdd ? '新增分类' : '修改分类'" :visible.sync="addDialog" size="tiny" @close="closeaddDialog" class="dialog">
            <el-form :model="formInline" label-width="120px">
                <el-form-item label="分类名称">
                    <el-input type="text" v-model="formInline.articleCategoryName" auto-complete="off" placeholder="分类名称"></el-input>
                </el-form-item>
                <el-form-item label="上级分类">
		            <el-select v-model="formInline.parentId" @change="handleChange" placeholder="请选择">
		            	<el-option label="无" value="0"></el-option>
    					<el-option v-for="item in AllArticleType" :label="item.articleCategoryName" :value="item.articleCategoryId">
    					</el-option>
					</el-select>
                </el-form-item>
                <el-form-item label="排序值">
                    <el-input-number v-model="formInline.sortOrder" @change="handleChange" :min="0"></el-input-number>
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
    getArticleCategoryList,
    getArticleCategoryAll,
    addArticleCategory,
    deleteArticleCategoryById,
    updateArticleCategoryById
} from '@/api/api'
export default {
    data: function() {
        return {
            addLoading: false,
            addDialog: false,
            formInline: {
                articleCategoryId: 0,
                articleCategoryName: "",
                parentId: '',
                sortOrder: 0
            },
            searchContent: '',
            pageId: 1,
            pageSize: 10,
            counts: 0,
            isAdd: true,
            ArticleType: null,
            AllArticleType: null
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getArticleType();
        this.getArticleTypeAll();
    },
    methods: {
        //获取视频分类列表
        getArticleType: function() {
            getArticleCategoryList({ params: { pageId: this.pageId, pageSize: this.pageSize, articleCategoryName: this.searchContent } }).then(data => {
                this.counts = data.count;
                this.ArticleType = data.list;
            })
        },
        getArticleTypeAll : function() {
        	getArticleCategoryAll({}).then(data => {
                this.AllArticleType = data;
        	})
        },
        //搜索
        searchArticleTypeByName: function() {
            this.getArticleType();
        },
        //显示添加弹窗
        showAddDialog: function() {
            this.addDialog = true;
        },
        //关闭添加弹窗
        closeaddDialog: function() {
            this.isAdd = true;
            this.formInline = {
                articleCategoryId: 0,
                articleCategoryName: "",
                parentId: '',
                sortOrder: 0
            }
        },
        //添加分类
        addCategory: function() {
            if (this.isAdd) {
                addArticleCategory(this.formInline).then(data => {
                    this.getArticleType();
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    })
                    this.addDialog = false;
                }).catch(err => {
                    console.error(err)
                })
            } else {
                updateArticleCategoryById(this.formInline).then(data => {
                    this.getArticleType()
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    })
                    this.addDialog = false;
                }).catch(err => {
                    console.error(err)
                })
            }
        },
        //取消添加分类
        cancelAddCategory: function() {
            this.addDialog = false;
        },
        //通过id修改分类的名称
        updateArticleCategory: function(index, row) {
            this.isAdd = false;
            this.addDialog = true;
            this.formInline = {
                articleCategoryId: row.articleCategoryId,
                articleCategoryName: row.articleCategoryName,
                parentId: row.parentId,
                sortOrder: row.sortOrder
            }
        },
        //通过id删除分类
        deleteArticleCategory: function(index, row) {
            this.$confirm('是否删除该分类?', '删除分类', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteArticleCategoryById(row.articleCategoryId).then(() => {
                    this.getArticleType();
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
        //分页
        currentChange: function(val) {
            this.$router.push('?page=' + val)
            this.pageId = val;
            this.getArticleType()
        },
        handleChange: function(){

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