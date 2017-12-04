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
                <el-form-item label="店铺审核状态">
                    <el-select v-model="params.audit" placeholder="请选择店铺审核状态">
                        <el-option v-for="(item,index) in shopAuditStatusList" :key="index" :label="item.key" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="配送审核状态">
                    <el-select v-model="params.deliveryAuditStatus" placeholder="请选择配送审核状态">
                        <el-option v-for="(item,index) in deliveryAuditStatusList" :key="index" :label="item.key" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="店铺状态">
                    <el-select v-model="params.shelves" placeholder="请选择店铺状态">
                        <el-option label="全部" value=" " />
                        <el-option label="上架" :value="true" />
                        <el-option label="下架" :value="false" />
                    </el-select>
                </el-form-item>
                <el-form-item label="营业状态">
                    <el-select v-model="params.operatingState" placeholder="请选择营业状态">
                        <el-option label="全部" value=" " />
                        <el-option label="营业中" :value="true" />
                        <el-option label="歇业中" :value="false" />
                    </el-select>
                </el-form-item>
                <br>
		        <el-form-item label="地区">
		            <el-select v-model.number="params.provinceId" placeholder="不限" @change="provinceChange">
					    <el-option v-for="(item,index) in provinceList" :key="index" :label="item.provinceName" :value="item.provinceId" />
					</el-select>
		        </el-form-item>
		        <el-form-item label="">
		            <el-select v-model.number="params.cityId" placeholder="不限" @change="cityChange">
					    <el-option v-for="(item,index) in cityList" :key="index" :label="item.cityName" :value="item.cityId" />
					</el-select>
		        </el-form-item>
		        <el-form-item label="">
		            <el-select v-model.number="params.areaId" placeholder="不限" @change="areaChange">
					    <el-option v-for="(item,index) in areaList" :key="index" :label="item.areaName" :value="item.areaId" />
					</el-select>
		        </el-form-item>
		        <el-form-item label="">
			        <el-button type="primary" @click="searchShop">搜索</el-button>
		        </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-col>
                <el-table :data="shopList" :row-class-name="tableRowClassName">
                    <el-table-column label="名称" align="center">
                        <template slot-scope="scope">{{scope.row.shopName ? scope.row.shopName : '-'}}</template>
                    </el-table-column>
<<<<<<< HEAD
                    <el-table-column label="负责人" width="160px" align="center">
=======
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
                        <template slot-scope="scope">{{scope.row.settlementTemplateName}}</template>
                    </el-table-column>
                    <el-table-column label="置顶值" align="center">
                        <template slot-scope="scope">{{scope.row.topper}}</template>
                    </el-table-column>
                        <el-table-column label="操作" width="200px" align="center">
>>>>>>> branch 'dev' of git@gitee.com:gjgx/share-food-admin.git
                        <template slot-scope="scope">
                        	{{scope.row.name}}<br>
                        	({{scope.row.phoneNum}})
                        </template>
                    </el-table-column> 
                    <!-- 
                    <el-table-column label="LOGO" align="center" width="140px">
                        <template slot-scope="scope"><img :src="UPLOADURL + scope.row.logoUrl + '/shopLogo.png'" alt="" class="logo-img"></template>
                    </el-table-column> 
                    -->
                    <el-table-column label="地址" align="center" >
                        <template slot-scope="scope">
                        	{{scope.row.provinceName}} {{scope.row.cityName}} {{scope.row.areaName}}<br>
                        	{{scope.row.address ? scope.row.address : '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="营业时间" width="140px" align="center">
                        <template slot-scope="scope">{{scope.row.busBeginTime ? scope.row.busBeginTime : '00:00'}} - {{scope.row.busEndTime ? scope.row.busEndTime : '00:00'}}</template>
                    </el-table-column>
                    <el-table-column label="联系电话" width="140px" align="center">
                        <template slot-scope="scope">{{scope.row.takeOutPhone ? scope.row.takeOutPhone : '-'}}</template>
                    </el-table-column>
                    <el-table-column label="状态" width="300px" align="center">
                        <template slot-scope="scope">
                        	<span class="operatingState">{{formatOperatingState(scope.row.operatingState)}}</span>/<span class="shelves">{{formatShelves(scope.row.shelves)}}</span>/<span class="deliveryAuditStatus">{{formatAuditStatus(scope.row.deliveryAuditStatus)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="结算模板" width="140px" align="center">
                        <template slot-scope="scope">{{scope.row.settlementTemplateName}}</template>
                    </el-table-column>
                    <el-table-column prop="topper" label="置顶值" width="100px" align="center" />
                    <el-table-column label="操作" width="400px" align="center">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="putAwayShop(scope.$index, scope.row)" v-if="!scope.row.shelves">上架</el-button>
                            <el-button size="mini" type="danger" @click="soldOutShop(scope.$index, scope.row)" v-else>下架</el-button>
                            <el-button size="mini" @click="openToperPopup(scope.$index, scope.row)">置顶</el-button>
                            <router-link :to="'/shopDetail?shopId='+scope.row.shopId" class="link">
                                <el-button size="mini" type="primary">详情</el-button>
                            </router-link>
                            <router-link :to="'/shopPrint?shopId='+scope.row.shopId" class="link">
                                <el-button size="mini">打印机列表</el-button>
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

    </el-row>
</template>
<script>
import {
	getProvinceList,
	getCityList,
	getAreaList,
    shopList,
    putAway,
    soldOut,
    findShopById,
    setToperClass
} from '@/api/api'
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
			cityListCache: {},
			areaListCache: {},
            addLoading: false,
            addToperPopup: false,
            counts: 0,
            isAdd: true,
            shopList: [],
            shopId: 0,
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
		getProvinceList().then(data => {
			this.provinceList = [{
				provinceName: '不限',
				provinceId: null
			}]
			this.provinceList = this.provinceList.concat(data)
		})
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getShopLists();
    },
    methods: {
		provinceChange: function(value) {
			this.params.provinceId = value;
			if (this.cityListCache[value]) {
				this.cityList = this.cityListCache[value];
			} else {
				getCityList(value).then(data => {
					var temp = [{
						cityName: '不限',
						cityId: null
					}]
					data = temp.concat(data)
				
					this.cityListCache[value] = data;
					this.cityList = data;
				})
			}
		},
		cityChange: function(value) {
			this.params.cityId = value;
			if (this.areaListCache[value]) {
				this.areaList = this.areaListCache[value];
			} else {
				getAreaList(value).then(data => {
					var temp = [{
						areaName: '不限',
						areaId: null
					}]
					data = temp.concat(data)
					
					this.areaListCache[value] = data;
					this.areaList = data;
				})
			}
		},
		areaChange: function(value) {
			this.params.areaId = value;
		},
        //获取列表
        getShopLists: function() {
            shopList({ params: this.params }).then(data => {
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
        formatOperatingState: function(value){
        	return value ? '营业中' : '歇业中';
        },
        formatShelves: function(value){
        	return value ? '上架' : '下架';
        },
        formatAuditStatus: function(auditType){
            switch(auditType){
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
        }
    }
}
</script>
<style scoped lang="scss">
.lives-news {
	.operatingState_Off{
		.operatingState {
    		color: gray;
		}
	}
	.shelves_Off{
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
    .logo-img{
        width: 120px;
    }
    .gray {
    	color: gray;
    }
    .link{
        display: inline-block;
        margin-left: 10px;
    }
}
</style>