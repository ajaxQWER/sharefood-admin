<template>
    <el-row class="lives-news">
        <el-col class="title">
            <h3>店铺管理</h3>
        </el-col>
        <el-col>
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="showAddDialog"><i class="el-icon-plus el-icon--left"></i>添加店铺</el-button>
                </el-form-item>
                <el-form-item>
                    <el-input placeholder="请输入店铺名称" icon="search" v-model="searchContent" :on-icon-click="searchCouponById">
                    </el-input>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col>
            <el-table :data="shopList">
                <el-table-column label="名称" width="160px" align="center">
                    <template scope="scope">{{scope.row.name?scope.row.name:'-'}}</template>
                </el-table-column>
                <el-table-column label="地址" width="160px" align="center">
                    <template scope="scope">{{scope.row.address?scope.row.address:'-'}}</template>
                </el-table-column>
                <el-table-column label="营业时间" width="180px" align="center">
                    <template scope="scope">{{scope.row.beginTime?scope.row.beginTime:'00:00:00'}} - {{scope.row.endTime?scope.row.endTime:'00:00:00'}}</template>
                </el-table-column>
                <el-table-column label="联系电话" width="120px" align="center">
                    <template scope="scope">{{scope.row.number?scope.row.number:'-'}}</template>
                </el-table-column>
                <el-table-column label="销量" align="center">
                    <template scope="scope">{{scope.row.sales?scope.row.sales:'-'}}</template>
                </el-table-column>
                <el-table-column label="介绍" align="center">
                    <template scope="scope">{{scope.row.introduce?scope.row.introduce:'-'}}</template>
                </el-table-column>
                <el-table-column label="评分" align="center">
                    <template scope="scope">{{scope.row.score?scope.row.score:'-'}}</template>
                </el-table-column>
                <el-table-column label="轮播图" align="center">
                    <template scope="scope">{{scope.row.carousel?scope.row.carousel:'-'}}</template>
                </el-table-column>
                <el-table-column label="缩略图" align="center">
                    <template scope="scope">{{scope.row.image?scope.row.image:'-'}}</template>
                </el-table-column>
                <el-table-column label="距离" align="center">
                    <template scope="scope">{{scope.row.instance?scope.row.instance:'-'}}</template>
                </el-table-column>
                <el-table-column label="经度" align="center">
                    <template scope="scope">{{scope.row.longitude?scope.row.longitude:'-'}}</template>
                </el-table-column>
                <el-table-column label="纬度" align="center">
                    <template scope="scope">{{scope.row.latitude?scope.row.latitude:'-'}}</template>
                </el-table-column>
                <el-table-column label="操作" width="160px" align="center">
                    <template scope="scope">
                        <el-button size="small" @click="updateVideoCategory(scope.$index, scope.row)">修改</el-button>
                        <el-button size="small" type="danger" @click="deleteVideoCategory(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
        <el-dialog :title="isAdd?'新增店铺':'修改店铺'" :visible.sync="addDialog" size="tiny" @close="closeaddDialog" class="dialog">
            <el-form :model="formInline" label-width="120px">
                <el-form-item label="店铺名称">
                    <el-input type="text" v-model="formInline.couponName" auto-complete="off" placeholder="店铺名称"></el-input>
                </el-form-item>
                <el-form-item label="店铺数量">
                    <el-input type="text" v-model.number="formInline.couponNumber" auto-complete="off" placeholder="优惠券数量"></el-input>
                </el-form-item>
                <el-form-item label="优惠券类型">
                    <el-radio class="radio" v-model="formInline.type" label="CASH">现金</el-radio>
                    <el-radio class="radio" v-model="formInline.type" label="DISCOUNT">折扣</el-radio>
                </el-form-item>
                <el-form-item v-if="formInline.type==='CASH'" label="金额">
                    <el-input type="text" v-model.number="formInline.money" auto-complete="off" placeholder="金额"></el-input>
                </el-form-item>
                <el-form-item v-else-if="formInline.type==='DISCOUNT'" label="折扣">
                    <el-input type="text" v-model.number="formInline.discount" auto-complete="off" placeholder="折扣"></el-input>
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
        <!-- 分页 -->
        <el-col class="pagination">
            <el-pagination @current-change="currentChange" :current-page="pageId" :page-size="pageSize" layout="total, prev, pager, next" :total="counts">
            </el-pagination>
        </el-col>
    </el-row>
</template>
<script>
import {
    shopList,
    addShop,
    deleteShopById,
    updateShopById
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
                discount: 0,
                endTime: "",
                minimum: 0,
                money: 0,
                pickUpType: "CONSUME",
                startTime: "",
                type: "CASH",
                useSocpe: "SHOP"
            },
            searchContent: '',
            pageId: 1,
            pageSize: 10,
            counts: 0,
            isAdd: true,
            shopList: null
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getShopLists();
    },
    methods: {
        //获取视频分类列表
        getShopLists: function() {
            shopList({ params: { pageId: this.pageId, pageSize: this.pageSize, shopDetailNameLike: this.searchContent } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.shopList = data.list;
            })
        },
        //搜索
        searchCouponById: function() {
            this.getShopLists();
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
                discount: 0,
                endTime: "",
                minimum: 0,
                money: 0,
                pickUpType: "CONSUME",
                startTime: "",
                type: "CASH",
                useSocpe: "SHOP"
            }
        },
        //添加分类
        addCategory: function() {
            if (this.isAdd) {
                addShop(this.formInline).then(data => {
                    this.getShopLists();
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    })
                    this.addDialog = false;
                })
            } else {
                updateShopById(this.formInline).then(data => {
                    this.getShopLists()
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
                discount: row.discount,
                endTime: row.endTime,
                minimum: row.minimum,
                money: row.money,
                pickUpType: row.pickUpType,
                startTime: row.startTime,
                type: row.type,
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
                deleteShopById(row).then(() => {
                    this.getShopLists();
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
            this.getShopLists()
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
        formatStartTime: function(val) {
            this.formInline.startTime = val;
        },
        formatEndTime: function(val) {
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
    .amap-demo {
        height: 500px;
    }

    .search-box {
        position: absolute;
        top: 25px;
        right: 20px;
    }

    .amap-page-container {
        position: relative;
    }
}
</style>