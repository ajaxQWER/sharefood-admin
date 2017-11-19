<template>
    <el-row class="lives-news">
        <el-row>
            <el-col class="title">
                <h3>优惠券管理</h3>
            </el-col>
        </el-row>
        <el-row class="search-row">
            <el-col :span="3">
                <el-button type="primary" @click="showAddDialog"><i class="el-icon-plus el-icon--left"></i>添加优惠券</el-button>
            </el-col>
            <el-col :span="4">
                <el-input placeholder="请输入优惠券名称" icon="search" v-model="searchContent" :on-icon-click="searchCouponById">
                </el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-table :data="couponLists">
                    <el-table-column label="名称" width="160px" align="center">
                        <template scope="scope">{{scope.row.couponName?scope.row.couponName:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="金额" align="center" width="120px">
                        <template scope="scope">{{scope.row.money?formatMoney(scope.row.money)+'元':'0.00元'}}</template>
                    </el-table-column>
                    <el-table-column label="最低消费额度" width="120px" align="center">
                        <template scope="scope">{{scope.row.minimum?formatMoney(scope.row.minimum)+'元':'0.00元'}}</template>
                    </el-table-column>
                    <el-table-column label="领取方式" align="center">
                        <template scope="scope">{{formatPickUpType(scope.row.pickUpType)}}</template>
                    </el-table-column>
                    <el-table-column label="使用范围" align="center">
                        <template scope="scope">{{formatUseSocpe(scope.row.useSocpe)}}</template>
                    </el-table-column>
                    <el-table-column label="是否可领取" width="180px" align="center">
                        <template scope="scope">{{scope.row.canPickUp?'是':'否'}}</template>
                    </el-table-column>
                    <el-table-column label="最大领取数量" width="180px" align="center">
                        <template scope="scope">{{scope.row.maxPickUpNumber?scope.row.maxPickUpNumber:'0'}}</template>
                    </el-table-column>
                    <el-table-column label="已领数量" align="center">
                        <template scope="scope">{{scope.row.pickUped?scope.row.pickUped:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="开始时间" width="180px" align="center">
                        <template scope="scope">{{scope.row.startTime?moment(scope.row.startTime).format('YYYY-MM-DD HH:mm:ss'):'-'}}</template>
                    </el-table-column>
                    <el-table-column label="结束时间" width="180px" align="center">
                        <template scope="scope">{{scope.row.endTime?moment(scope.row.endTime).format('YYYY-MM-DD HH:mm:ss'):'-'}}</template>
                    </el-table-column>
                    <el-table-column label="操作" width="160px" align="center">
                        <template scope="scope">
                            <el-button size="small" @click="updateVideoCategory(scope.$index, scope.row)">修改</el-button>
                            <el-button size="small" type="danger" @click="deleteVideoCategory(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-dialog :title="isAdd?'新增优惠券':'修改优惠券'" :visible.sync="addDialog" size="tiny" @close="closeaddDialog" class="dialog">
                <el-form :model="formInline" label-width="120px">
                    <el-form-item label="优惠券名称">
                        <el-input type="text" v-model="formInline.couponName" auto-complete="off" placeholder="优惠券名称"></el-input>
                    </el-form-item>
                    <el-form-item label="优惠券数量">
                        <el-input type="text" v-model.number="formInline.couponNumber" auto-complete="off" placeholder="优惠券数量"></el-input>
                    </el-form-item>
                    <el-form-item label="金额">
                        <el-input type="text" v-model.number="formInline.money" auto-complete="off" placeholder="金额"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间">
                        <el-date-picker v-model="formInline.startTime" type="datetime" placeholder="选择开始时间" @change="formatStartTime"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间">
                        <el-date-picker v-model="formInline.endTime" type="datetime" placeholder="选择结束时间" @change="formatEndTime"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="最低消费额度">
                        <el-input type="text" v-model.number="formInline.minimum" auto-complete="off" placeholder="最低消费额度"></el-input>
                    </el-form-item>
                    <el-form-item label="领取方式">
                        <el-radio class="radio" v-model="formInline.pickUpType" label="CONSUME">消费赠送</el-radio>
                        <el-radio class="radio" v-model="formInline.pickUpType" label="HAND">手动领取</el-radio>
                    </el-form-item>
                    <el-form-item label="使用范围">
                        <el-radio class="radio" v-model="formInline.useSocpe" label="SHOP">商家</el-radio>
                        <el-radio class="radio" v-model="formInline.useSocpe" label="GLOBAL">平台</el-radio>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelAddCategory">取 消</el-button>
                    <el-button type="primary" @click="addCategory" :loading="addLoading">确 定</el-button>
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
    coiponList,
    addCoupon,
    deleteCouponById,
    updateCouponById
} from '@/api/api'
export default {
    data: function() {
        return {
            addLoading: false,
            addDialog: false,
            formInline: {
                couponId: 0,
                couponName: "",
                couponNumber: 0,
                endTime: "",
                minimum: 0,
                money: 0,
                pickUpType: "CONSUME",
                startTime: "",
                useSocpe: "SHOP"
            },
            searchContent: '',
            pageId: 1,
            pageSize: 10,
            counts: 0,
            isAdd: true,
            couponLists: null
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getCouponLists();
    },
    methods: {
        //获取视频分类列表
        getCouponLists: function() {
            coiponList({ params: { pageId: this.pageId, pageSize: this.pageSize, couponNameLike: this.searchContent } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.couponLists = data.list;
            })
        },
        //搜索
        searchCouponById: function() {
            this.getCouponLists();
        },
        //显示添加弹窗
        showAddDialog: function() {
            this.addDialog = true;
        },
        //关闭添加弹窗
        closeaddDialog: function() {
            this.isAdd = true;
            this.formInline = {
                couponId: 0,
                couponName: "",
                couponNumber: 0,
                endTime: "",
                minimum: 0,
                money: 0,
                pickUpType: "CONSUME",
                startTime: "",
                useSocpe: "SHOP"
            }
        },
        //添加分类
        addCategory: function() {
            if (this.isAdd) {
                addCoupon(this.formInline).then(data => {
                    this.getCouponLists();
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    })
                    this.addDialog = false;
                })
            } else {
                updateCouponById(this.formInline).then(data => {
                    this.getCouponLists()
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
                couponId: row.couponId,
                couponName: row.couponName,
                couponNumber: row.couponNumber,
                endTime: row.endTime,
                minimum: row.minimum,
                money: row.money,
                pickUpType: row.pickUpType,
                startTime: row.startTime,
                useSocpe: row.useSocpe
            }
        },
        //通过id删除分类
        deleteVideoCategory: function(index, row) {
            this.$confirm('是否删除该分类?', '删除分类', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteCouponById(row).then(() => {
                    this.getCouponLists();
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
            this.getCouponLists()
        },
        formatPickUpType: function(val) {
            switch (val) {
                case 'CONSUME':
                    return '消费赠送'
                    break;
                case 'HAND':
                    return '手动领取'
                    break;
                default:
                    break;
            }
        },
        formatType: function(val) {
            switch (val) {
                case 'CASH':
                    return '现金'
                    break;
                case 'DISCOUNT':
                    return '折扣'
                    break;
                default:
                    break;
            }
        },
        formatUseSocpe: function(val) {
            switch (val) {
                case 'SHOP':
                    return '商家'
                    break;
                case 'GLOBAL':
                    return '平台'
                    break;
                default:
                    break;
            }
        },
        formatStartTime: function (val) {
            this.formInline.startTime = val;
        },
        formatEndTime: function (val) {
            this.formInline.endTime = val;
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
    .search-row {
        margin: 15px 0;
    }
}
</style>