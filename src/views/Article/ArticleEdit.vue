<template>
    <el-row class="lives-news">
        <el-col class="title">
            <h3>{{isAdd ? '新增' : '修改'}}文章</h3>
        </el-col>
        <el-col>
            <el-form :model="formInline" label-width="120px">
                <el-form-item label="文章标题">
                    <el-input type="text" v-model="formInline.articleTitle" auto-complete="off" placeholder="文章标题"></el-input>
                </el-form-item>
                <el-form-item label="所属分类">
                    <el-select v-model.number="formInline.articleCategoryId" filterable placeholder="请选择">
                    	<el-option label="请选择" value=""></el-option>
                        <el-option v-for="item in articleCategoryList" :key="item.articleCategoryId" :label="item.articleCategoryName" :value="item.articleCategoryId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="跳转链接">
                    <el-input type="text" v-model="formInline.jumpUrl" auto-complete="off" placeholder="跳转链接"></el-input>
                </el-form-item>
                <el-form-item class="quill-box" label="文章内容">
                    <quill-editor class="quill" v-model="formInline.articleContent" ref="myQuillEditor" :options="editorOption">
				    </quill-editor>
                </el-form-item>
                <el-form-item>
                    <el-button @click="gotoList">取 消</el-button>
                    <el-button type="primary" @click="update">保 存</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>
<script>
import {
    getArticleCategoryAll,
    getArticleById,
    addArticle,
    updateArticleById
} from '@/api/api'
import { 
	quillEditor 
} from 'vue-quill-editor'
export default {
	components: {
    	quillEditor
  	},
    data: function() {
        return {
            formInline: {
                articleId: 0,
                articleCategoryId: '',
                articleTitle: '',
                articleContent: '',
                jumpUrl: null
            },
            editorOption :{
            },
            articleCategoryList : [],
            isAdd : false
        }
    },
    created: function() {
        this.isAdd = this.$route.path.indexOf("Update") == -1;
        this.getArticleTypeAll();
        this.getInfo();
    },
    methods: {
        getArticleTypeAll: function(){
        	getArticleCategoryAll({}).then(data => {
                this.articleCategoryList = data;
        	})
        },
        getInfo: function(){
        	if (!this.isAdd){
	        	getArticleById(this.$route.query.articleId).then(data => {
	        		this.formInline = data
	        	})
        	}
        },
        update : function(){
        	if (this.isAdd) {
	            addArticle(this.formInline).then(data => {
	                this.$message({
	                    message: '添加成功',
	                    type: 'success'
	                })
	                this.gotoList();
	            })
        	} else {
	            updateArticleById(this.formInline).then(data => {
	                this.$message({
	                    message: '修改成功',
	                    type: 'success'
	                })
	                this.gotoList();
	            })
        	}
        },
        gotoList: function(){
           	this.$router.push({path: '/articleList'})
        }
    }
}
</script>
<style scoped lang="scss">
.quill-box {
	height: 400px;
	.quill {
		height: 300px;
	}
}
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