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
                    <el-input placeholder="请输入店铺名称" v-model="params.shopNameLike" />
                </el-form-item>
                <el-form-item label="店铺状态">
                    <el-select v-model="params.shelves" placeholder="请选择店铺状态">
                        <el-option v-for="(item,index) in shelvesObj" :key="index" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="营业状态">
                    <el-select v-model="params.operatingState" placeholder="请选择营业状态">
                        <el-option v-for="(item,index) in operatingStateObj" :key="index" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="省">
                    <el-select v-model.number="params.provinceId" placeholder="选择省" filterable>
                        <el-option v-for="(item,index) in provinceList" :key="index" :label="item.provinceName" :value="item.provinceId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="市">
                    <el-select v-model.number="params.cityId" placeholder="选择市" filterable>
                        <el-option v-for="(item,index) in cityList" :key="index" :label="item.cityName" :value="item.cityId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="区">
                    <el-select v-model.number="params.areaId" placeholder="选择区" @change="areaChange" filterable>
                        <el-option v-for="(item,index) in areaList" :key="index" :label="item.areaName" :value="item.areaId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="searchShop">搜索</el-button>
                    <el-button type="danger" @click="resetSearch">重置查询条件</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-col>
                <el-table :data="shopList" border :row-class-name="tableRowClassName" :row-style="{fontSize:'12px'}">
                    <el-table-column label="id" width="80px" align="center" prop="shopId" />
                    <el-table-column label="名称" align="center" width="160px">
                        <template slot-scope="scope">{{scope.row.detail.shopName ? scope.row.detail.shopName : '-'}}</template>
                    </el-table-column>
                    <el-table-column label="负责人" width="140px" align="center">
                        <template slot-scope="scope">
                            {{scope.row.detail.name}}
                            <br> ({{scope.row.detail.phoneNum}})
                        </template>
                    </el-table-column>
                    
                    <el-table-column prop="agent.agentName" label="代理商" align="center" width="200px" /> 
                   
                    <el-table-column label="地址" align="center">
                        <template slot-scope="scope">
                            {{scope.row.detail.provinceName}} {{scope.row.detail.cityName}} {{scope.row.detail.areaName}}
                            <br> {{scope.row.detail.address ? scope.row.detail.address : '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="营业时间" width="150px" align="center">
                        <template slot-scope="scope">{{scope.row.detail.busBeginTime ? scope.row.detail.busBeginTime : '00:00'}} - {{scope.row.detail.busEndTime ? scope.row.detail.busEndTime : '00:00'}}</template>
                    </el-table-column>
                    <el-table-column label="联系电话" width="120px" align="center">
                        <template slot-scope="scope">{{scope.row.detail.takeOutPhone ? scope.row.detail.takeOutPhone : '-'}}</template>
                    </el-table-column>
                    <el-table-column label="状态" width="120px" align="center">
                        <template slot-scope="scope">
                            <span class="operatingState">{{formatOperatingState(scope.row.detail.operatingState)}}</span>/<span class="shelves">{{formatShelves(scope.row.detail.shelves)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="detail.topper" label="置顶值" width="80px" align="center"></el-table-column>
                    <el-table-column label="操作" width="260px" align="center">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="openToperPopup(scope.$index, scope.row)">置顶</el-button>
                            <el-button size="mini" type="primary" @click="putAwayShop(scope.$index, scope.row.detail)" v-if="!scope.row.detail.shelves">上架</el-button>
                            <el-button size="mini" type="danger" @click="soldOutShop(scope.$index, scope.row.detail)" v-else>下架</el-button>
                            <router-link :to="'/shopDetail?shopId='+scope.row.shopId" class="link">
                                <el-button size="mini" type="primary">详情</el-button>
                            </router-link>
                            <router-link :to="'/shopPrint?shopId='+scope.row.shopId" class="link">
                                <el-button size="mini">打印机列表</el-button>
                            </router-link>
                            <el-button size="mini" type="danger" @click="reAdopt(scope.$index, scope.row)">重新审核</el-button>
                            <el-button size="mini" type="primary" @click="showChangeAgentDialog(scope.$index, scope.row)">更换代理商</el-button>
                            <router-link :to="'/seller?shopId='+scope.row.shopId" class="link">
                                <el-button size="mini">账号列表</el-button>
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
                <el-pagination @current-change="currentChange" :current-page="params.pageId" :page-size="params.pageSize" layout="total, prev, pager, next" :total="counts">
                </el-pagination>
            </el-col>
        </el-row>
        <el-dialog title="更换代理商" :visible.sync="changeAgentDialog" size="tiny" @close="closeChangeAgentDialog" class="dialog">
            <el-form label-width="120px">
                <el-form-item label="选择代理商">
                    <el-select v-model="agentId" placeholder="请选择代理商" filterable>
                        <el-option
                                v-for="(item,index) in agentLists"
                                :key="index"
                                :label="item.agentName"
                                :value="item.agentId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeChangeAgentDialog">取 消</el-button>
                <el-button type="primary" @click="changeAgentFn">确 定</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>
<script>
import {
    shopList,
    putAway,
    soldOut,
    findShopById,
    setToperClass,
    reAdoptShopById,
    getAgentLists,
    changeAgent
} from '@/api/api'
import Region from 'xygx-region'
export default {
    data: function() {
        return {
            params: {
                shopNameLike: null,
                audit: null,
                deliveryAuditStatus: null,
                shelves: null,
                operatingState: null,
                provinceId: null,
                cityId: null,
                areaId: null,
                pageId: 1,
                pageSize: 20,
            },
            shopAuditLists: null,
            provinceList: [],
            cityList: [],
            areaList: [],
            addLoading: false,
            addToperPopup: false,
            counts: 0,
            isAdd: true,
            shopList: [],
            shopId: 0,
            formInline: {
                topper: 0
            },
            agentId: null,
            agentLists: [],
            changeAgentDialog: false,
            shelvesObj: [{
                value: '',
                label: '全部'
            },{
                value: 'true',
                label: '上架'
            },{
                value: 'false',
                label: '下架'
            }],
            operatingStateObj: [{
                value: '',
                label: '全部'
            },{
                value: 'true',
                label: '营业中'
            },{
                value: 'false',
                label: '歇业中'
            }]
        }
    },
    created: function() {
        var shopNameLike = this.$route.query.shopNameLike || '';
        var shelves = this.$route.query.shelves || '';
        var operatingState = this.$route.query.operatingState || '';
        var provinceId = parseInt(this.$route.query.provinceId) || '';
        var cityId = parseInt(this.$route.query.cityId) || '';
        var areaId = parseInt(this.$route.query.areaId) || '';
        this.params.shopNameLike = shopNameLike;
        this.params.shelves = shelves;
        this.params.operatingState = operatingState;
        this.params.provinceId = provinceId;
        this.params.cityId = cityId;
        this.params.areaId = areaId;
        Region.province.list().then(data => {
            var list = [];
            list.push({
                provinceId: null,
                provinceName: "不限"
            })

            this.provinceList = [].concat(list, data);
        })
        this.params.pageId = parseInt(this.$route.query.pageId) || 1;
        this.getShopLists();
        getAgentLists({params: {pageSize: 9999999}}).then(res => {
            this.agentLists = res.list;
        })
    },
    watch: {
        'params.provinceId': function(newVal, oldVal) {
            if(oldVal){
                this.params.cityId = null;
                this.params.areaId = null;

                this.cityList = [];
                this.areaList = [];
            }

            if (newVal) {
                Region.city.list(newVal).then(data => {
                    var list = [];
                    list.push({
                        cityId: null,
                        cityName: "不限"
                    })

                    this.cityList = [].concat(list, data);
                })
            }
        },
        'params.cityId': function(newVal, oldVal) {
            if(oldVal){
                this.params.areaId = null;

                this.areaList = [];
            }

            if (newVal) {
                Region.area.list(newVal).then(data => {
                    var list = [];
                    list.push({
                        areaId: null,
                        areaName: "不限"
                    })

                    this.areaList = [].concat(list, data);
                })
            }
        }
    },
    methods: {
        areaChange: function(value) {
            this.params.areaId = value;
        },
        //获取列表
        getShopLists: function() {
            shopList({ params: this.params }).then(data => {
                console.log(data)
                var str = '?';
                for(var key in this.params){
                    if(this.params[key]){
                        str += key + '=' + this.params[key] + '&'
                    }
                }
                this.$router.push(str)
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
            this.$prompt('请输入下架原因', '下架店铺', {
                inputPattern: /\S+/,
                inputErrorMessage: '下架原因不能为空'
            }).then(({ value }) => {
                if (!value.trim()) {
                    this.$message({
                        type: 'error',
                        message: '请输入下架原因'
                    });
                    return
                }
                var params = {
                    shopId: row.shopId,
                    unshelvesReason: value.trim()
                }
                soldOut(params).then(() => {
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
            this.$router.push('?pageId=' + val)
            this.params.pageId = val;
            this.getShopLists()
        },
        closeaddToperPopup: function() {
            this.shopId = 0;
            this.formInline = {
                topper: 0
            }
        },
        cancelSetToper: function() {
            this.addToperPopup = false;
        },
        //设置置顶
        openToperPopup: function(index, row) {
            this.addToperPopup = true;
            this.shopId = row.shopId;
            this.formInline = {
                topper: row.topper
            }
        },
        setToperClassFn: function() {
            setToperClass(this.shopId, this.formInline.topper).then(res => {
                this.getShopLists();
                this.$message({
                    type: 'success',
                    message: '设置成功!'
                });
                this.cancelSetToper()
            })
        },
        formatOperatingState: function(value) {
            return value ? '营业中' : '歇业中';
        },
        formatShelves: function(value) {
            return value ? '上架' : '下架';
        },
        formatAuditStatus: function(auditType) {
            switch (auditType) {
                case 'UN_COMMIT':
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
        },
        tableRowClassName: function(row, rowIndex) {
            var classNames = "";

            if (!row.operatingState) {
                classNames += "operatingState_Off ";
            }

            if (!row.shelves) {
                classNames += "shelves_Off ";
            }

            if (row.deliveryAuditStatus != 'ADOPT') {
                classNames += "deliveryAuditStatus_" + row.deliveryAuditStatus + " ";
            }

            if (classNames != '') {
                classNames += "warning-row ";
            }

            return classNames;
        },
        resetSearch: function() {
            this.params = {
                shopNameLike: null,
                audit: null,
                deliveryAuditStatus: null,
                shelves: null,
                operatingState: null,
                provinceId: null,
                cityId: null,
                areaId: null,
                pageId: 1,
                pageSize: 20,
            }
            this.getShopLists()
        },
        //重新审核店铺
        reAdopt: function(index, row) {
            this.$confirm('确定要重新审核该店铺?', '重新审核', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                reAdoptShopById(row.shopId).then(res => {
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
        //更换代理商
        showChangeAgentDialog: function(index, row){
            this.shopId = row.shopId;
            this.agentId = row.agentId;
            this.changeAgentDialog = true;
        },
        closeChangeAgentDialog: function(){
            this.shopId = 0;
            this.agentId = null;
            this.changeAgentDialog = false;
        },
        changeAgentFn: function(){
            if(!this.agentId){
                this.$message({
                    type: 'error',
                    message: '请选择代理商'
                });
                return;
            }
            var params = {
                agentId: this.agentId,
                shopId: this.shopId
            }
            changeAgent(params).then(res => {
                this.getShopLists();
                this.$message({
                    type: 'success',
                    message: '操作成功!'
                });
                this.closeChangeAgentDialog()
            })
        }
    }
}
</script>
<style scoped lang="scss">
.lives-news {
    .operatingState_Off {
        .operatingState {
            color: gray;
        }
    }
    .shelves_Off {
        .shelves {
            color: red;
        }
    }

    .deliveryAuditStatus_UN_COMMIT {
        .deliveryAuditStatus {
            color: gray;
        }
    }
    .deliveryAuditStatus_UN_AUDIT {
        .deliveryAuditStatus {
            color: #929227;
        }
    }
    .deliveryAuditStatus_IN_THE_REVIEW {
        .deliveryAuditStatus {
            color: green;
        }
    }
    .deliveryAuditStatus_UNADOPT {
        .deliveryAuditStatus {
            color: red;
        }
    }
    .warning-row {
        background: oldlace;
    }
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
    .logo-img {
        width: 120px;
    }
    .gray {
        color: gray;
    }
    .el-button+.el-button {
        margin: 5px;
    }
    .link {
        display: inline-block;
        margin: 5px;
    }
}
</style>