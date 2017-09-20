<template>
    <el-row class="videoCategory">
        <el-col class="title">
            <h3>视频管理</h3>
        </el-col>
        <el-col>
            <el-col>
                <el-form :inline="true">
                    <el-form-item>
                        <el-button type="primary" @click="showAddVideoDialog"><i class="el-icon-plus el-icon--left"></i>添加视频</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col>
                <el-table :data="videoLists">
                    <el-table-column prop="videoId" label="视频ID" align="center"></el-table-column>
                    <el-table-column prop="categoryName" width="150px" label="分类名称" align="center"></el-table-column>
                    <el-table-column width="180px" prop="title" label="视频标题" align="center"></el-table-column>
                    <el-table-column width="300px" prop="content" label="视频内容" align="center"></el-table-column>
                    <el-table-column width="300px" prop="videoUrl" label="视频地址" align="center"></el-table-column>
                    <el-table-column prop="createTime" width="180px" label="创建时间" align="center">
                        <template scope="scope">
                            {{formatDate(scope.$index, scope.row)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="160px" align="center">
                        <template scope="scope">
                            <el-button size="small" @click="handleUpdateVideo(scope.$index, scope.row)">修改</el-button>
                            <el-button size="small" type="danger" @click="handleDeleteVideo(scope.$index, scope.row)">删除</el-button>
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
        <el-dialog title="新增视频" :visible.sync="addVideoDialog" size="tiny" @close="closeAddViodeDialog" class="dialog">
            <el-form :model="newVideoObject" label-width="100px" ref="newVideo">
                <el-form-item label="视频分类" prop="categoryId">
                    <el-select v-model="newVideoObject.categoryId" placeholder="选择视频分类" class="select">
                        <el-option v-for="(item,index) of category" :label="item.categoryName" :value="item.categoryId" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="视频名称" prop="title">
                    <el-input v-model="newVideoObject.title" placeholder="视频名称"></el-input>
                </el-form-item>
                <el-form-item label="视频内容" prop="content">
                    <el-input v-model="newVideoObject.content" placeholder="视频内容"></el-input>
                </el-form-item>
                <el-form-item label="视频地址" prop="videoUrl">
                    <el-input type="textarea" v-model="newVideoObject.videoUrl" auto-complete="off" placeholder="视频地址" :autosize="{ minRows: 4}"></el-input>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker
                      v-model="newVideoObject.createTime"
                      type="datetime"
                      placeholder="选择创建时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <div v-if="isAdd">
                    <el-button @click="cancelAddVideo">取 消</el-button>
                    <el-button type="primary" @click="addVideo">确 定</el-button>
                </div>
                <div v-if="isUpdate">
                    <el-button @click="cancelUpdateVideo">取 消</el-button>
                    <el-button type="primary" @click="updateVideo">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </el-row>
</template>
<script>
import {
    getVideoCategoryLists,
    getVideoLists,
    addVideo,
    deleteVideoById,
    updateVideoById
} from '@/api/api'
export default {
    data: function() {
        
        return {
            newVideoObject: {
                categoryId: '',
                title: '',
                content: '',
                videoUrl: '',
                createTime: ''
            },
            isAdd: true,
            isUpdate: false,
            searchContent: '',
            pageId: 1,
            pageSize: 10,
            counts: 0,
            addVideoDialog: false,
            category: null,
            videoLists: null,
            rowIndex: 0
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getVideoCategory();
        this.getLists();
    },
    methods: {
        //获取视频分类列表
        getVideoCategory: function() {
            getVideoCategoryLists({}).then(data => {
                this.category = data.list;
            }).catch(err => {
                console.error(err)
            })
        },
        //获取视频列表
        getLists: function() {
            getVideoLists({ params: { pageId: this.pageId, pageSize: this.pageSize, categoryNameLike: this.searchContent } }).then(data => {
                this.counts = data.count;
                this.videoLists = data.list;
            })
        },
        //点击添加视频按钮
        showAddVideoDialog: function() {
            this.addVideoDialog = true;
        },
        //关闭弹窗层
        closeAddViodeDialog: function() {
            this.$refs.newVideo.resetFields();
            this.isAdd = true;
            this.isUpdate = false;
            this.newVideoObject = {
                categoryId: '',
                title: '',
                content: '',
                videoUrl: '',
                createTime: ''
            }
        },
        //取消添加视频
        cancelAddVideo: function() {
            this.addVideoDialog = false;
        },
        //增加视频
        addVideo: function() {
            var params = this.newVideoObject;
            addVideo(params).then(data => {
                // if (this.videoLists.length < this.pageSize) {
                //     this.videoLists.push(data);
                // }
                // this.counts += 1;
                this.getLists();
                this.$message({
                    type: 'success',
                    message: '添加成功!'
                });
                this.$refs.newVideo.resetFields();
                this.addVideoDialog = false;
            }).catch(err => {
                console.error(err)
                this.$message({
                    type: 'error',
                    message: '添加失败!'
                });
            })
        },
        //修改视频
        handleUpdateVideo: function(index, row) {
            this.isAdd = false;
            this.isUpdate = true;
            this.rowIndex = index;
            this.newVideoObject = {
                categoryId: row.categoryId,
                title: row.title,
                content: row.content,
                videoId: row.videoId,
                createTime: row.createTime,
                videoUrl: row.videoUrl
            }
            this.addVideoDialog = true;
        },
        //点击确定修改视频
        updateVideo: function() {
            updateVideoById(this.newVideoObject).then(data => {
                // this.$set(this.videoLists, this.rowIndex, data);
                this.getLists()
                this.$message({
                    type: 'success',
                    message: '修改成功!'
                });
                this.isAdd = true;
                this.isUpdate = false;
                this.addVideoDialog = false;
            })
        },
        //取消修改
        cancelUpdateVideo: function() {
            this.addVideoDialog = false;
        },
        //删除视频
        handleDeleteVideo: function(index, videoObject) {
            this.$confirm('是否删除该视频?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteVideoById(videoObject).then(data => {
                    // if (this.videoLists.length <= this.pageSize && this.counts <= this.pageSize) {
                    //     this.videoLists.splice(index, 1);
                    //     this.counts -= 1;
                    // } else {
                    //     this.getLists();
                    // }
                    this.getLists();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                })
            }).catch(() => {});
        },
        //分页
        currentChange: function(val) {
            this.$router.push('?page=' + val)
            this.pageId = val;
            this.getLists()
        },
        formatDate: function(index, row) {
            return this.moment(new Date(row.createTime)).format('YYYY-MM-DD HH:mm:ss');
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
}
</style>