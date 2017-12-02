<template>
    <el-row class="lives-news">
        <el-row class="title">
            <h3>店铺评价标签</h3>
        </el-row>
        <el-row>
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="showAddDialog"><i class="el-icon-plus el-icon--left"></i>添加评价标签</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table :data="tagLists" class="table">
                <el-table-column prop="deliveryAppraiseTagId" label="标签ID" align="center"></el-table-column>
                
                <el-table-column prop="deliveryAppraiseTagName" label="标签名称" align="center"></el-table-column>
                <el-table-column label="操作" width="200px" align="center">
                    <template slot-scope="scope">
                        <el-button size="small" @click="updateTag(scope.$index, scope.row)">修改</el-button>
                        <el-button size="small" type="danger" @click="deleteTag(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <!-- 分页 -->
        <el-row class="pagination">
            <el-pagination @current-change="currentChange" :current-page="pageId" :page-size="pageSize" layout="total, prev, pager, next" :total="counts">
            </el-pagination>
        </el-row>
        <el-dialog :title="isAdd?'新增评价标签':'修改评价标签'" :visible.sync="addDialog" size="tiny" @close="closeaddDialog" class="dialog">
            <el-form :model="tagObj" label-width="120px">
                <el-form-item label="标签名称">
                    <el-input v-model="tagObj.deliveryAppraiseTagName" :maxlength="6"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAddCategory">取 消</el-button>
                <el-button type="primary" @click="addCategory" :loading="addLoading">确 定</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>
<script>
import {
    getDeliveryAppraiseTagLists,
    addDeliveryAppraiseTag,
    deleteDeliveryAppraiseTag,
    updateDeliveryAppraiseTagById
} from '@/api/api'
export default {
    data: function() {
        return {
            addLoading: false,
            addDialog: false,
            tagObj: {
                deliveryAppraiseTagName: ''
            },
            pageId: 1,
            pageSize: 10,
            counts: 0,
            isAdd: true,
            uploadLoading: false,
            tagLists: null,
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getTagLists();
    },
    methods: {
        //获取视频分类列表
        getTagLists: function() {
            getDeliveryAppraiseTagLists({ params: { pageId: this.pageId, pageSize: this.pageSize } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.tagLists = data.list;
            })
        },
        //搜索
        searchCouponById: function() {
            // this.getTagLists();
        },
        //显示添加弹窗
        showAddDialog: function() {
            this.addDialog = true;
        },
        //关闭添加弹窗
        closeaddDialog: function() {
            this.isAdd = true;
            this.addLoading = false;
            this.tagObj = {
                deliveryAppraiseTagName: ""
            }
        },
        //添加分类
        addCategory: function() {
            this.addLoading = true;
            if (this.isAdd) {
                addDeliveryAppraiseTag(this.tagObj).then(data => {
                    this.getTagLists();
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    })
                    this.addDialog = false;
                })
            } else {
                updateDeliveryAppraiseTagById(this.tagObj).then(data => {
                    this.getTagLists()
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
        updateTag: function(index, row) {
            this.isAdd = false;
            this.addDialog = true;
            this.tagObj = {
                deliveryAppraiseTagId: row.deliveryAppraiseTagId,
                deliveryAppraiseTagName: row.deliveryAppraiseTagName
            }
        },
        //通过id删除分类
        deleteTag: function(index, row) {
            this.$confirm('是否删除该标签?', '删除标签', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteDeliveryAppraiseTag(row.deliveryAppraiseTagId).then(() => {
                    this.getTagLists();
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
            this.getTagLists()
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
    .thumb-img{
        width: 320px;
    }
    .banner-thumb {
        width: 100%;
        vertical-align: middle;
    }
}
</style>