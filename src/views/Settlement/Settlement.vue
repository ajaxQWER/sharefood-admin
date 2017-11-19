<template>
    <el-row class="lives-news">
        <el-row>
            <el-col class="title">
                <h3>结算模板管理</h3>
            </el-col>
        </el-row>
        <el-row class="btn">
            <el-col :span="4">
                <el-button type="primary" @click="showAddDialog"><i class="el-icon-plus el-icon--left"></i>添加结算模板</el-button>
            </el-col>
            <el-col :span="4">
                <el-input placeholder="请输入结算模板名称" icon="search" v-model="searchContent" :on-icon-click.self="searchCouponById">
                </el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-table :data="settlementData">
                    <el-table-column label="结算模板ID" width="160px" align="center">
                        <template scope="scope">{{scope.row.settlementTemplateId?scope.row.settlementTemplateId:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="结算模板名称" align="center">
                        <template scope="scope">{{scope.row.settlementTemplateName?scope.row.settlementTemplateName:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="结算百分比" align="center">
                        <template scope="scope">{{scope.row.percentageOfSettle?scope.row.percentageOfSettle:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="操作" width="160px" align="center">
                        <template scope="scope">
                            <el-button size="small" @click="updateSettlement(scope.$index, scope.row)">修改</el-button>
                            <el-button size="small" type="danger" @click="deleteSettlement(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-dialog :title="isAdd?'新增结算模板':'修改结算模板'" :visible.sync="addDialog" size="tiny" @close="closeaddDialog" class="dialog">
                <el-form :model="formInline" label-width="120px">
                    <el-form-item label="结算模板名称">
                        <el-input type="text" v-model="formInline.settlementTemplateName" auto-complete="off" placeholder="结算模板名称"></el-input>
                    </el-form-item>
                    <el-form-item label="结算比例">
                        <el-input-number v-model.number="formInline.percentageOfSettle" auto-complete="off" :min="0.000" :max="1.000" :step="0.001"></el-input-number>
                    </el-form-item>
                    <el-form-item label="提示">
                        <span class="tips">结算比例范围0-1，保留三位小数</span>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelAddSettlement">取 消</el-button>
                    <el-button type="primary" @click="addSettlement" :loading="addLoading">确 定</el-button>
                </div>
            </el-dialog>
        </el-row>
        <!-- 分页 -->
        <el-row>
            <el-col class="pagination">
                <el-pagination @current-change="currentChange" :current-page="pageId" :page-size="pageSize" layout="total, prev, pager, next" :total="counts">
                </el-pagination>
            </el-col>
        </el-row>
    </el-row>
</template>
<script>
import {
    getSettlementTemplateLists,
    addSettlementTemplate,
    deleteSettlementTemplateById,
    updateSettlementTemplateId
} from '@/api/api'
export default {
    data: function() {
        return {
            addLoading: false,
            addDialog: false,
            formInline: {
                settlementTemplateId: 0,
                settlementTemplateName: "",
                percentageOfSettle: 0
            },
            searchContent: '',
            pageId: 1,
            pageSize: 10,
            counts: 0,
            isAdd: true,
            settlementData: null
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getSettlementTemplateList();
    },
    methods: {
        //获取视频分类列表
        getSettlementTemplateList: function() {
            getSettlementTemplateLists({ params: { pageId: this.pageId, pageSize: this.pageSize, settlementTemplateName: this.searchContent } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.settlementData = data.list;
            })
        },
        //搜索
        searchCouponById: function() {
            this.getSettlementTemplateList();
        },
        //显示添加弹窗
        showAddDialog: function() {
            this.addDialog = true;
        },
        //关闭添加弹窗
        closeaddDialog: function() {
            this.isAdd = true;
            this.formInline = {
                settlementTemplateId: 0,
                settlementTemplateName: "",
                percentageOfSettle: 0
            }
        },
        //添加分类
        addSettlement: function() {
            if (this.isAdd) {
                addSettlementTemplate(this.formInline).then(data => {
                    this.getSettlementTemplateList();
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    })
                    this.addDialog = false;
                })
            } else {
                updateSettlementTemplateId(this.formInline).then(data => {
                    this.getSettlementTemplateList()
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
        cancelAddSettlement: function() {
            this.addDialog = false;
        },
        //通过id修改分类的名称
        updateSettlement: function(index, row) {
            this.isAdd = false;
            this.addDialog = true;
            this.formInline = {
                settlementTemplateId: row.settlementTemplateId,
                settlementTemplateName: row.settlementTemplateName,
                percentageOfSettle: row.percentageOfSettle
            }
        },
        //通过id删除分类
        deleteSettlement: function(index, row) {
            this.$confirm('是否删除该模板?', '删除模板', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteSettlementTemplateById(row.settlementTemplateId).then(() => {
                    this.getSettlementTemplateList();
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
            this.getSettlementTemplateList()
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
    .btn{
        margin: 15px 0;
    }
    .tips{
        font-size: 12px;
    }
}
</style>