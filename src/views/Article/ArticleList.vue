<template>
    <el-row class="lives-news">
        <el-col class="title">
            <h3>文章列表</h3>
        </el-col>
        <el-col>
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="showAddDialog"><i class="el-icon-plus el-icon--left"></i>添加文章</el-button>
                </el-form-item>
                <el-form-item label="文章标题">
                    <el-input placeholder="请输入文章标题" icon="search" v-model="searchContent" :on-icon-click="searchArticleByName">
                    </el-input>
                </el-form-item>
                <el-form-item label="文章分类">
		            <el-select v-model="articleCategoryId" @change="searchArticleByName" placeholder="请选择">
		            	<el-option label="不限制" value=""></el-option>
    					<el-option v-for="item in articleCategoryList" :label="item.articleCategoryName" :value="item.articleCategoryId">
    					</el-option>
					</el-select>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col>
            <el-table :data="articleLists">
                <el-table-column label="文章ID" width="160px" align="center">
                    <template scope="scope">{{scope.row.articleId?scope.row.articleId:'-'}}</template>
                </el-table-column>
                <el-table-column label="文章分类" width="160px" align="center">
                    <template scope="scope">{{scope.row.articleCategoryName?scope.row.articleCategoryName:'-'}}</template>
                </el-table-column>
                <el-table-column label="文章标题" width="240px" align="center">
                    <template scope="scope">{{scope.row.articleTitle?scope.row.articleTitle:'-'}}</template>
                </el-table-column>
                <el-table-column label="文章内容" align="center">
                    <template scope="scope">{{scope.row.articleContent?scope.row.articleContent:'-'}}</template>
                </el-table-column>
                <el-table-column label="操作" width="160px" align="center">
                    <template scope="scope">
                        <el-button size="small" @click="updateArticle(scope.$index, scope.row)">修改</el-button>
                        <el-button size="small" type="danger" @click="deleteArticle(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
        <el-dialog :title="isAdd?'新增文章':'修改文章'" :visible.sync="addDialog" size="tiny" @close="closeaddDialog" class="dialog">
            <el-form :model="formInline" label-width="120px">
                <el-form-item label="文章标题">
                    <el-input type="text" v-model="formInline.articleTitle" auto-complete="off" placeholder="文章标题"></el-input>
                </el-form-item>
                <el-form-item label="文章内容">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="formInline.articleContent" auto-complete="off" placeholder="文章内容"></el-input>
                </el-form-item>
                <el-form-item label="所属分类">
                    <el-select v-model.number="formInline.articleCategoryId" filterable placeholder="请选择">
                        <el-option v-for="item in articleCategoryList" :key="item.articleCategoryId" :label="item.articleCategoryName" :value="item.articleCategoryId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAddArticle">取 消</el-button>
                <el-button type="primary" @click="submitArticle" :loading="addLoading">确 定</el-button>
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
    getArticleList,
    addArticle,
    deleteArticleById,
    updateArticleById
} from '@/api/api'
export default {
    data: function() {
        return {
            formInline: {
                articleId: 0,
                articleCategoryId: '',
                articleTitle: '',
                articleContent: ''
            },
            isAdd: true,
            addDialog: false,
            addLoading: false,
            searchContent: '',
            pageId: 1,
            pageSize: 10,
            counts: 0,
            articleLists: null,
            articleCategoryList: [],
            articleCategoryId: null
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getArticleLists();
        this.getArticleTypeAll();
    },
    methods: {
        //获取视频分类列表
        getArticleLists: function() {
        	var params = {
        		pageId : this.pageId,
        		pageSize : this.pageSize
        	}
        	
        	if (this.searchContent.length){
        		params.articleTitle = this.searchContent;
        	}
        	
        	if (!isNaN(parseInt(this.articleCategoryId))) {
        		params.articleCategoryId = this.articleCategoryId;
        	}
        	
            getArticleList({ params: params }).then(data => {
                this.counts = data.count;
                this.articleLists = data.list;
            })
        },
        getArticleTypeAll: function(){
        	getArticleCategoryAll({}).then(data => {
                this.articleCategoryList = data;
        	})
        },
        showAddDialog: function() {
            this.addDialog = true;
            this.isAdd = true;
        },
        //搜索
        searchArticleByName: function() {
            this.getArticleLists();
        },
        //分页
        currentChange: function(val) {
            this.$router.push('?page=' + val)
            this.pageId = val;
            this.getArticleLists()
        },
        updateArticle: function(index, row){
            this.isAdd = false;
            this.addDialog = true;
            this.formInline = {
                articleId: row.articleId,
                articleCategoryId: row.articleCategoryId,
                articleTitle: row.articleTitle,
                articleContent: row.articleContent
            }
        },
        deleteArticle: function(index, row){
            this.$confirm('是否删除该文章?', '删除文章', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteArticleById(row.articleId).then(() => {
                    this.getArticleLists();
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
        closeaddDialog: function(){
            this.isAdd = true;
            this.addDialog = false;
            this.formInline = {
                articleId: 0,
                articleCategoryId: '',
                articleTitle: '',
                articleContent: ''
            }
        },
        cancelAddArticle: function(){
            this.isAdd = false;
        },
        submitArticle: function(){
            console.log(this.formInline)
            this.addLoading = true;
            if(this.isAdd){
                addArticle(this.formInline).then(() => {
                    this.getArticleLists();
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    })
                    this.addDialog = false;
                    this.addLoading = false;
                })
            }else{
                updateArticleById(this.formInline).then(data => {
                    this.getArticleLists()
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    })
                    this.addDialog = false;
                    this.addLoading = false;
                })
            }
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