<template>
    <el-row class="lives-news">
        <el-row>
            <el-col class="title">
                <h3>店铺管理</h3>
            </el-col>
        </el-row>
        <el-row class="search-row">
            <el-form class="inline-form" :inline="true">
                <el-form-item label="搜索店铺">
                    <el-input placeholder="请输入店铺名称" icon="search" v-model="searchContent" :on-icon-click="searchShop">
                    </el-input>
                </el-form-item>
                <el-form-item label="店铺审核状态">
                    <el-select v-model="audit" placeholder="请选择店铺审核状态" @change="searchShop">
                        <el-option
                          v-for="(item,index) in shopAuditStatusList"
                          :key="index"
                          :label="item.key"
                          :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="配送审核状态">
                    <el-select v-model="deliveryAuditStatus" placeholder="请选择配送审核状态" @change="searchShop">
                        <el-option
                          v-for="(item,index) in deliveryAuditStatusList"
                          :key="index"
                          :label="item.key"
                          :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="店铺状态">
                    <el-select v-model="shelves" placeholder="请选择店铺状态" @change="searchShop">
                        <el-option
                            label="全部"
                            value=" ">
                        </el-option>
                        <el-option
                            label="上架"
                            :value="true">
                        </el-option>
                        <el-option
                            label="下架"
                            :value="false">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="营业状态">
                    <el-select v-model="operatingState" placeholder="请选择营业状态" @change="searchShop">
                        <el-option
                            label="全部"
                            value=" ">
                        </el-option>
                        <el-option
                            label="营业中"
                            :value="true">
                        </el-option>
                        <el-option
                            label="歇业中"
                            :value="false">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-col>
                <el-table :data="shopList">
                    <el-table-column label="名称" width="240px" align="center">
                        <template slot-scope="scope">{{scope.row.shopName?scope.row.shopName:'-'}}</template>
                    </el-table-column>
                    <el-table-column prop="name" label="负责人" align="center"></el-table-column>
                    <!-- <el-table-column label="LOGO" align="center" width="140px">
                        <template slot-scope="scope"><img :src="UPLOADURL + scope.row.logoUrl + '/shopLogo.png'" alt="" class="logo-img"></template>
                    </el-table-column> -->
                    <el-table-column label="地址" width="280px" align="center">
                        <template slot-scope="scope">{{scope.row.address?scope.row.address:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="营业时间" width="130px" align="center">
                        <template slot-scope="scope">{{scope.row.busBeginTime?scope.row.busBeginTime:'00:00'}} - {{scope.row.busEndTime?scope.row.busEndTime:'00:00'}}</template>
                    </el-table-column>
                    <!-- <el-table-column label="注册账号" width="160px" align="center">
                        <template slot-scope="scope">{{scope.row.phoneNum?scope.row.phoneNum:'-'}}</template>
                    </el-table-column> -->
                    <el-table-column label="联系电话" width="140px" align="center">
                        <template slot-scope="scope">{{scope.row.takeOutPhone?scope.row.takeOutPhone:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="营业状态" align="center">
                        <template slot-scope="scope">{{scope.row.operatingState?'营业中':'歇业中'}}</template>
                    </el-table-column><el-table-column label="状态" align="center">
                        <template slot-scope="scope">{{scope.row.shelves?'上架':'下架'}}</template>
                    </el-table-column>
                    <el-table-column label="配送状态" align="center">
                        <template slot-scope="scope">{{formatAuditStatus(scope.row.deliveryAuditStatus)}}</template>
                    </el-table-column>
                    <el-table-column label="结算模板" align="center">
                        <template scope="scope">{{scope.row.settlementTemplateName}}</template>
                    </el-table-column>
                    <el-table-column label="置顶值" align="center">
                        <template slot-scope="scope">{{scope.row.topper}}</template>
                    </el-table-column>
                        <el-table-column label="操作" width="200px" align="center">
                        <template slot-scope="scope">
                            <el-button size="small" type="primary" @click="putAwayShop(scope.$index, scope.row)" v-if="!scope.row.shelves">上架</el-button>
                            <el-button size="small" type="danger" @click="soldOutShop(scope.$index, scope.row)" v-else>下架</el-button>
                            <el-button size="small" @click="openToperPopup(scope.$index, scope.row)">置顶</el-button>
                            <router-link :to="'/shopDetail?shopId='+scope.row.shopId" class="link">
                                <el-button size="small" type="primary">详情</el-button>
                            </router-link>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-dialog title="设置置顶值" :visible.sync="addToperPopup" size="tiny" @close="closeaddToperPopup" class="dialog">
                <el-form :model="formInline" label-width="120px">
                    <el-form-item label="置顶值">
                        <el-input-number v-model.number="formInline.topper" :min="0" :step="1"></el-input-number>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelSetToper">取 消</el-button>
                    <el-button type="primary" @click="setToperClassFn" :loading="addLoading">确 定</el-button>
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
    shopList,
    putAway,
    soldOut,
    findShopById,
    setToperClass
} from '@/api/api'
export default {
    data: function() {
        return {
            addLoading: false,
            addToperPopup: false,
            searchContent: '',
            pageId: 1,
            pageSize: 20,
            counts: 0,
            isAdd: true,
            shopList: null,
            shopId: 0,
            audit: '',
            deliveryAuditStatus: '',
            audit: '',
            shelves: '',
            shopType: '',
            operatingState: '',
            formInline: {
                topper: 0
            },
            deliveryAuditStatusList: [{
                key: '全部',
                value: ' '
            },{
                key: '审核通过',
                value: 'ADOPT'
            },{
                key: '审核不通过',
                value: 'UNADOPT'
            },{
                key: '审核中',
                value: 'IN_THE_REVIEW'
            },{
                key: '未审核',
                value: 'UN_AUDIT'
            },{
                key: '未提交',
                value: 'UN_COMMIT'
            }],
            shopAuditStatusList: [{
                key: '全部',
                value: ' '
            },{
                key: '审核通过',
                value: 'AUDIT_ADOPT'
            },{
                key: '审核不通过',
                value: 'AUDIT_UNADOPT'
            },{
                key: '等待审核',
                value: 'WAIT_AUDIT'
            }]
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getShopLists();
    },
    methods: {
        //获取列表
        getShopLists: function() {
            shopList({ params: { pageId: this.pageId, pageSize: this.pageSize, shopNameLike: this.searchContent,deliveryAuditStatus: this.deliveryAuditStatus, audit: this.audit, shelves: this.shelves, operatingState: this.operatingState } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.shopList = data.list;
            })
        },
        //搜索
        searchShop: function() {
            this.getShopLists();
        },
        goToAddShop: function() {
            this.$router.push('shopDetail')
        },
        //上架
        putAwayShop: function(index, row) {
            this.$confirm('是否上架该店铺?', '上架店铺', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                putAway(row).then(() => {
                    this.getShopLists();
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });
            });
        },
        //下架
        soldOutShop: function(index, row) {
            this.$confirm('是否下架该店铺?', '下架店铺', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                soldOut(row).then(() => {
                    this.getShopLists();
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });
            });
        },
        //分页
        currentChange: function(val) {
            this.$router.push('?page=' + val)
            this.pageId = val;
            this.getShopLists()
        },
        closeaddToperPopup: function(){
            this.shopId = 0;
            this.formInline = {
                topper: 0
            }
        },
        cancelSetToper: function(){
            this.addToperPopup = false;
        },
        //设置置顶
        openToperPopup: function(index, row){
            this.addToperPopup = true;
            this.shopId = row.shopId;
            this.formInline = {
                topper: row.topper
            }
        },
        setToperClassFn: function(){
            setToperClass(this.shopId, this.formInline.topper).then(res => {
                this.getShopLists();
                this.$message({
                    type: 'success',
                    message: '设置成功!'
                });
                this.cancelSetToper()
            })
        },
        formatAuditStatus: function(auditType){
            switch(auditType){
                case 'UN_COMMIT,':
                    return '未提交';
                case 'UN_AUDIT':
                    return '未审核';
                case 'IN_THE_REVIEW':
                    return '审核中';
                case 'ADOPT':
                    return '审核通过';
                case 'UNADOPT':
                    return '审核不通过';
            }
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
    .logo-img{
        width: 120px;
    }
    .link{
        display: inline-block;
        margin-left: 10px;
    }
}
</style>