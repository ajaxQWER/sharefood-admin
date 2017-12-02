<template>
    <el-row class="lives-news">
        <el-row>
            <el-col class="title">
                <h3>店铺分类管理</h3>
            </el-col>
        </el-row>
        <el-row class="search-row">
            <el-form class="inline-form" :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="showAddDialog"><i class="el-icon-plus el-icon--left"></i>添加分类</el-button>
                </el-form-item>
                <el-form-item label="搜索分类名称"></el-form-item>
            </el-form>
            <el-col :span="4">
                <el-input placeholder="请输入分类名称" icon="search" v-model="searchContent" :on-icon-click="searchShopCategory">
                </el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-table :data="shopCategoryLists">
                    <el-table-column prop="shopCategoryName" label="分类名称" align="center"></el-table-column>
                    <el-table-column prop="sortOrder" label="排序值" align="center"></el-table-column>
                    <el-table-column label="图标" align="center">
                        <template slot-scope="scope">
                            <img :src="UPLOADURL + scope.row.icon + '/goods.png'" :alt="scope.row.shopCategoryName" class="icon-img">
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="160px" align="center">
                        <template slot-scope="scope">
                            <el-button size="small" @click="updateShopCategory(scope.$index, scope.row)">修改</el-button>
                            <el-button size="small" type="danger" @click="deleteShopCategory(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-dialog :title="isAdd?'新增店铺分类':'修改店铺分类'" :visible.sync="addDialog" size="tiny" @close="closeaddDialog" class="dialog">
                <el-form :model="formInline" ref="formInline" label-width="120px">
                    <el-form-item label="分类名称" prop="categoryName">
                        <el-input type="text" v-model="formInline.shopCategoryName" auto-complete="off" placeholder="分类名称"></el-input>
                    </el-form-item>
                    <el-form-item label="排序值" prop="categoryName">
                        <el-input-number v-model="formInline.sortOrder" :min="1"></el-input-number>
                    </el-form-item>
                    <el-form-item label="分类图标">
                        <el-upload class="avatar-uploader" :headers="uploadHeader" :action="BASEURL+'/commons/upload/categorylogo'" :show-file-list="false" :on-success="handleUploadSuccess">
                            <el-button size="small" type="primary">上传图标</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item>
                        <img v-if="formInline.icon" :src="UPLOADURL+formInline.icon" alt="" class="banner-thumb">
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelAddCategory">取 消</el-button>
                    <el-button type="primary" @click="addCategory" :loading="addLoading">确 定</el-button>
                </div>
            </el-dialog>
        </el-row>
        <el-row>
            <!-- 分页 -->
            <el-col class="pagination">
                <el-pagination @current-change="currentChange" :current-page="pageId" :page-size="pageSize" layout="total, prev, pager, next" :total="counts">
                </el-pagination>
            </el-col>
        </el-row>

    </el-row>
</template>
<script>
import {
    shopCategoryList,
    addShopCategory,
    deleteShopCategoryById,
    updateShopCategoryById,
    uploadFiles
} from '@/api/api'
export default {
    data: function() {
        return {
            addLoading: false,
            addDialog: false,
            formInline: {
                shopCategoryName: '',
                sortOrder: 0,
                icon: ''
            },
            searchContent: '',
            pageId: 1,
            pageSize: 10,
            counts: 0,
            isAdd: true,
            shopCategoryLists: null,
            uploadHeader: {
                token: sessionStorage.getItem('jwt')
            }
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getCategoryLists();
    },
    methods: {
        //获取视频分类列表
        getCategoryLists: function() {
            shopCategoryList({ params: { pageId: this.pageId, pageSize: this.pageSize, shopCategoryName: this.searchContent } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.shopCategoryLists = data.list;
            })
        },
        //搜索
        searchShopCategory: function() {
            this.getCategoryLists();
        },
        //显示添加弹窗
        showAddDialog: function() {
            this.addDialog = true;
        },
        //关闭添加弹窗
        closeaddDialog: function() {
            this.isAdd = true;
            this.formInline = {
                shopCategoryName: '',
                sortOrder: 0,
                icon: ''
            };
        },
        //添加分类
        addCategory: function() {
            console.log(this.isAdd)
            console.log(this.formInline)
            if (this.isAdd) {
                addShopCategory(this.formInline).then(data => {
                    this.getCategoryLists();
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    })
                    this.addDialog = false;
                })
            } else {
                updateShopCategoryById(this.formInline).then(data => {
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
        },
        //取消添加分类
        cancelAddCategory: function() {
            this.addDialog = false;
        },
        //通过id修改分类的名称
        updateShopCategory: function(index, row) {
            this.isAdd = false;
            this.addDialog = true;
            this.formInline = {
                shopCategoryId: row.shopCategoryId,
                shopCategoryName: row.shopCategoryName,
                sortOrder: row.sortOrder,
                icon: row.icon
            }

        },
        //通过id删除分类
        deleteShopCategory: function(index, row) {
            this.$confirm('是否删除该分类?', '删除分类', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log(123)
                deleteShopCategoryById(row).then(() => {
                    this.getCategoryLists();
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
        uploadImage: function() {
            var file = this.$refs.uploadImage.uploadFiles[0].raw;
            var fd = new FormData();
            fd.append('file', file);
            fd.path = '/categorylogo';
            uploadFiles(fd).then(data => {
                this.$message({
                    message: ' 上传图标成功',
                    type: 'success'
                })
                this.formInline.icon = data.originalUrl;
            }).catch(err => {
                console.log(err)
            })
        },
        handleUploadSuccess: function(res){
            console.log(res)
            if(res.status){
                this.$message({
                    message: '上传分类图标成功',
                    type: 'success'
                })
                this.formInline.icon = res.data.originalUrl;
            }else{
                this.$message({
                    message: '上传分类图标失败',
                    type: 'error'
                })
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
    .icon-img{
        width: 60px;
    }
    .banner-thumb{
        width: 150px;
    }
    .search-row {
        margin: 15px 0;
    }
}
</style>