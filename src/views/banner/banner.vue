<template>
    <el-row class="videoCategory">
        <el-col class="title">
            <h3>banner管理</h3>
        </el-col>
        <el-col>
            <el-col>
                <el-form :inline="true">
                    <el-form-item>
                        <el-button type="primary" @click="showDialog"><i class="el-icon-plus el-icon--left"></i>添加banner</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col>
                <el-table :data="bannerList">
                    <el-table-column prop="sortOrder" label="排序值" align="center"></el-table-column>
                    <el-table-column prop="title" label="标题" align="center"></el-table-column>
                    <el-table-column prop="type" width="100px" label="类型" align="center"></el-table-column>
                    <el-table-column prop="url" label="地址" align="center"></el-table-column>
                    <el-table-column width="320px" label="缩略图" align="center">
                        <template scope="scope">
                            <img :src="DOWNLOADURL+scope.row.originalUrl" alt="" class="banner-thumb">
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="160px" align="center">
                        <template scope="scope">
                            <el-button size="small" @click="handleUpdateBanner(scope.$index, scope.row)">修改</el-button>
                            <el-button size="small" type="danger" @click="handleDeleteBanner(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-col>
        <!-- 分页 -->
        <el-col class="pagination">
            <el-pagination @current-change="currentChange" :current-page="pageId" :page-size="pageSize" layout="total, prev, pager, next" :total="counts">
            </el-pagination>
        </el-col>
        <!-- 修改banner -->
        <el-dialog :title="isAdd?'新增banner':'修改banner'" :visible.sync="dialog" size="tiny" @close="closeDialog" class="dialog">
            <el-form :model="bannerObj" label-width="100px" ref="newVideo">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="bannerObj.title" auto-complete="off" placeholder="标题"></el-input>
                </el-form-item>
                <el-form-item label="是否跳转" prop="bannerType">
                    <el-switch v-model="jump" on-text="是" off-text="否">
                    </el-switch>
                </el-form-item>
                <el-form-item label="跳转链接" prop="url" v-show="jump">
                    <el-input v-model="bannerObj.url" auto-complete="off" placeholder="跳转链接"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-radio class="radio" v-model="bannerObj.type" label="pc" checked>pc端</el-radio>
                    <el-radio class="radio" v-model="bannerObj.type" label="wap">移动端</el-radio>
                </el-form-item>
                <el-form-item label="排序值" prop="sortOrder">
                    <el-input-number size="small" v-model="bannerObj.sortOrder" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="上传" prop="sortOrder">
                    <el-upload ref="uploadBanner" action="" :http-request="uploadBanner" :show-file-list="false">
                        <el-button size="small" type="primary">点击上传banner</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div>
                <img :src="DOWNLOADURL+bannerObj.originalUrl" alt="" class="banner-thumb">
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="add">确 定</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>
<script>
import {
    getBannerLists,
    addBanner,
    deleteBannerById,
    getBannerById,
    updateBannerById,
    uploadFiles
} from '@/api/api'
export default {
    data: function() {
        return {
            bannerObj: {
                bannerId: '',
                type: 'pc',
                sortOrder: '',
                originalUrl: '',
                title: '',
                url: ''
            },
            isAdd: true,
            jump: false,
            searchContent: '',
            pageId: 1,
            pageSize: 10,
            counts: 0,
            dialog: false,
            rowIndex: 0,
            bannerList: null
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getLists();
    },
    methods: {
        //获取视频列表
        getLists: function() {
            getBannerLists({ params: { pageId: this.pageId, pageSize: this.pageSize } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.bannerList = data.list;
            })
        },
        //点击添加视频按钮
        showDialog: function() {
            this.dialog = true;
        },
        //关闭弹窗层
        closeDialog: function() {
            //置空this.bannerObj
            this.isAdd = true;
            this.jump = false;
            this.$refs.uploadBanner.clearFiles(); //清空上传文件列表
            this.bannerObj = {
                bannerId: '',
                type: 'pc',
                sortOrder: '',
                originalUrl: '',
                title: '',
                url: ''
            }
        },
        //取消添加视频
        cancel: function() {
            this.dialog = false;
        },
        //添加banner
        add: function() {
            if (this.isAdd) {
                addBanner(this.bannerObj).then(data => {
                    console.log(data)
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    })
                    this.getLists()
                    this.dialog = false;
                })
            } else {
                updateBannerById(this.bannerObj).then(data => {
                    console.log(data)
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    })
                    this.getLists()
                    this.dialog = false;
                })
            }
        },
        //修改banner
        handleUpdateBanner: function(index, row) {
            this.isAdd = false;
            this.dialog = true;
            this.jump = row.url ? true : false;
            this.bannerObj = {
                bannerId: row.bannerId,
                type: row.type,
                sortOrder: row.sortOrder,
                originalUrl: row.originalUrl,
                title: row.title,
                url: this.jump ? row.url : ''
            }
        },
        //删除banner
        handleDeleteBanner: function(index, row) {
            deleteBannerById(row).then(data=>{
                console.log(data)
                this.$message({
                    type: 'success',
                    message: '删除成功'
                })
                this.getLists();
            })
        },
        //格式化bannerType
        formatBannerType: function(type) {
            switch (type) {
                case 'NO_JUMP':
                    return '无跳转'
                    break;
                case 'INNER_SITE':
                    return '站内链接'
                    break;
                case 'OUTER_SITE':
                    return '站外链接'
                    break;
                default:
                    break;
            }
        },
        //banner上传
        uploadBanner: function() {
            var file = this.$refs.uploadBanner.uploadFiles[0].raw;
            console.log(file)
            var fd = new FormData();
            fd.append('file', file);
            fd.path = '/banner';
            console.log(fd)
            uploadFiles(fd).then(data => {
                console.log(data)
                this.$message({
                    message: ' 上传banner成功',
                    type: 'success'
                })
                this.bannerObj.originalUrl = data.originalUrl;
            }).catch(err=>{
                console.log(err)
            })
        },
        //上传显示缩略图
        formatThumbnailUrl: function(url) {
            return 'http://upload.sharestock.cn' + url;
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
    .select {
        width: 100%;
    }
    .banner-thumb {
        width: 100%;
        vertical-align: middle;
    }
}
</style>