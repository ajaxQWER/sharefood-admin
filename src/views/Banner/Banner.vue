<template>
    <el-row class="lives-news">
        <el-row class="title">
            <h3>banner管理</h3>
        </el-row>
        <el-row>
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="showAddDialog"><i class="el-icon-plus el-icon--left"></i>添加banner</el-button>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="show" placeholder="请选择" @change="getBannerLists">
                        <el-option
                                v-for="(item,index) in showLists"
                                :key="index"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table :data="bannerList" :row-style="{fontSize:'12px'}" border>
                <el-table-column prop="sortOrder" label="排序值" width="120px" align="center"></el-table-column>
                <el-table-column label="是否显示" align="center" width="100px">
                    <template slot-scope="scope">{{scope.row.show?'是':'否'}}</template>
                </el-table-column>
                <el-table-column label="缩略图" align="center">
                    <template slot-scope="scope"><img :src="formatImageUrl(scope.row.imageUrl)" alt="" class="thumb-img"></template>
                </el-table-column>
                <el-table-column prop="url" label="链接地址" width="180px" align="center"></el-table-column>
                <el-table-column label="操作" width="160px" align="center">
                    <template slot-scope="scope">
                        <el-button size="small" @click="updateVideoCategory(scope.$index, scope.row)">修改</el-button>
                        <el-button size="small" type="danger" @click="deleteVideoCategory(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <!-- 分页 -->
        <el-row class="pagination">
            <el-pagination @current-change="currentChange" :current-page="pageId" :page-size="pageSize" layout="total, prev, pager, next" :total="counts">
            </el-pagination>
        </el-row>
        <el-dialog :title="isAdd?'新增banner':'修改banner'" :visible.sync="addDialog" size="tiny" @close="closeaddDialog" class="dialog">
            <el-form :model="formInline" label-width="120px">
                <el-form-item label="排序值">
                    <el-input-number v-model.number="formInline.sortOrder" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item label="是否显示">
                    <el-switch v-model="formInline.show" on-text="是" off-text="否"></el-switch>
                </el-form-item>
                <el-form-item label="链接地址">
                    <el-input type="text" v-model="formInline.url" auto-complete="off" placeholder="链接地址"></el-input>
                </el-form-item>
                <el-form-item label="缩略图">
                    <el-upload class="avatar-uploader" :headers="uploadHeader" :action="BASEURL+'/commons/upload/banner'" :show-file-list="false" :on-success="handleAvatarSuccess">
                        <el-button size="small" type="primary" :loading="uploadLoading">点击上传banner</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div>
                <img v-if="formInline.imageUrl" :src="UPLOADURL+formInline.imageUrl" alt="" class="banner-thumb">
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAddCategory">取 消</el-button>
                <el-button type="primary" @click="addCategory" :loading="addLoading">确 定</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>
<script>
import {
    bannerList,
    addBanner,
    deleteBannerById,
    updateBannerById,
    uploadFiles
} from '@/api/api'
export default {
    data: function() {
        return {
            addLoading: false,
            addDialog: false,
            formInline: {
                bannerId: 0,
                imageUrl: "",
                show: true,
                sortOrder: 0,
                url: ""
            },
            pageId: 1,
            pageSize: 10,
            counts: 0,
            isAdd: true,
            uploadLoading: false,
            bannerList: null,
            show: '',
            showLists: [{
                label: '全部',
                value: ' '
            },{
                label: '显示',
                value: true
            },{
                label: '隐藏',
                value: false
            }],
            uploadHeader: {
                token: sessionStorage.getItem('jwt')
            }
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getBannerLists();
    },
    methods: {
        //获取视频分类列表
        getBannerLists: function() {
            bannerList({ params: { pageId: this.pageId, pageSize: this.pageSize, show: this.show } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.bannerList = data.list;
            })
        },
        //搜索
        searchCouponById: function() {
            // this.getBannerLists();
        },
        //显示添加弹窗
        showAddDialog: function() {
            this.addDialog = true;
        },
        //关闭添加弹窗
        closeaddDialog: function() {
            this.isAdd = true;
            this.addLoading = false;
            this.formInline = {
                bannerId: 0,
                imageUrl: "",
                show: true,
                sortOrder: 0,
                url: ""
            }
        },
        //添加分类
        addCategory: function() {
            this.addLoading = true;
            if (this.isAdd) {
                addBanner(this.formInline).then(data => {
                    this.getBannerLists();
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    })
                    this.addDialog = false;
                })
            } else {
                updateBannerById(this.formInline).then(data => {
                    this.getBannerLists()
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
        updateVideoCategory: function(index, row) {
            this.isAdd = false;
            this.addDialog = true;
            this.formInline = {
                bannerId: row.bannerId,
                imageUrl: row.imageUrl,
                show: row.show,
                sortOrder: row.sortOrder,
                url: row.url
            }
        },
        //通过id删除分类
        deleteVideoCategory: function(index, row) {
            this.$confirm('是否删除该分类?', '删除分类', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteBannerById(row).then(() => {
                    this.getBannerLists();
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
            this.getBannerLists()
        },
        formatImageUrl: function(url) {
            return this.UPLOADURL + url + '/banner.png';
        },
        handleAvatarSuccess: function(res){
            console.log(res)
            if(res.status){
                this.$message({
                    message: '上传banner成功',
                    type: 'success'
                })
                this.formInline.imageUrl = res.data.originalUrl;
            }else{
                this.$message({
                    message: '上传banner失败',
                    type: 'error'
                })
            }
        },
        //banner上传
        uploadBanner: function() {
            console.log(this.$refs.uploadBanner)
            var file = this.$refs.uploadBanner.uploadFiles[0].raw;
            var fd = new FormData();
            fd.append('file', file);
            fd.path = '/banner';
            this.uploadLoading = true;
            uploadFiles(fd).then(data => {
                // console.log(data)
                this.$message({
                    message: ' 上传banner成功',
                    type: 'success'
                })
                this.formInline.imageUrl = data.originalUrl;
                console.log(file)
                this.tempUrl = URL.createObjectURL(file);
                this.uploadLoading = false;
            }).catch(err=>{
                console.log(err)
                this.uploadLoading = false;
            })
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
    .thumb-img{
        width: 240px;
    }
    .banner-thumb {
        width: 100%;
        vertical-align: middle;
    }
}
</style>