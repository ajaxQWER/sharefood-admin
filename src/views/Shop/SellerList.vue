<template>
    <el-row class="lives-news">
        <el-row>
            <el-col class="title">
                <h3>卖家账号管理</h3>
            </el-col>
        </el-row>
        <el-row class="search-row">
            <el-form class="inline-form" :inline="true">
                <el-form-item label="搜索卖家账号">
                    <el-input placeholder="请输入卖家账号" v-model="params.sellerNameLike" />
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="getList">搜索</el-button>
                    <el-button type="primary" @click="back" v-if="hasShopId">返回店铺列表</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-col>
                <el-table :data="sellerList" border :row-style="{fontSize:'12px'}">
                    <el-table-column label="id" width="80px" align="center" prop="sellerId" />
                    <el-table-column label="账号" align="center" prop="sellerName" />
	                <el-table-column label="注册时间" align="center">
	                    <template slot-scope="scope">{{moment(scope.row.registrationTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
	                </el-table-column>
	                <el-table-column label="上次登录时间" align="center">
	                    <template slot-scope="scope">{{moment(scope.row.lastLoginTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
	                </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small" @click="showUpdateSecretkey(scope.$index, scope.row)">修改密码</el-button>
                            <el-button type="success" size="small" @click="showUpdateSellerName(scope.$index, scope.row)">修改账号</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row>
            <!-- 分页 -->
            <el-col class="pagination">
                <el-pagination @current-change="currentChange" :current-page="params.pageId" :page-size="params.pageSize" layout="total, prev, pager, next" :total="counts">
                </el-pagination>
            </el-col>
        </el-row>
		<el-dialog title="修改账号" :visible.sync="updateSellerNameDialog" size="tiny" @close="closeSellerNameDialog" class="dialog">
		    <el-form :model="updateSellerNameInfo" label-width="120px">
		        <el-form-item label="卖家账号">
		            <el-input type="text" v-model="updateSellerNameInfo.sellerName" auto-complete="off" placeholder="卖家账号"></el-input>
		        </el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
		        <el-button @click="closeSellerNameDialog">取 消</el-button>
		        <el-button type="primary" @click="todoUpdateSellerNameDialog" :loading="addLoading">确 定</el-button>
		    </div>
		</el-dialog>
		<el-dialog title="修改密码" :visible.sync="updateSecretkeyDialog" size="tiny" @close="closeSecretkeyDialog" class="dialog">
			    <el-form :model="updateSecretkeyInfo" label-width="120px">
			        <el-form-item label="新密码">
			            <el-input type="text" v-model="updateSecretkeyInfo.newSecretkey" auto-complete="off" placeholder="新密码"></el-input>
			        </el-form-item>
			    </el-form>
		    <div slot="footer" class="dialog-footer">
		        <el-button @click="closeSecretkeyDialog">取 消</el-button>
		        <el-button type="primary" @click="todoUpdateSecretkeyDialog" :loading="addLoading">确 定</el-button>
		    </div>
		</el-dialog>
    </el-row>
</template>
<script>
import {
	sellerList,
	updateSecretkey,
	updateSellerName
} from '@/api/api'
export default {
    data: function() {
        return {
            params: {
                sellerNameLike: null,
                shopId: null,
                pageId: 1,
                pageSize: 20
            },
            hasShopId: false,
            counts: 0,
            sellerList: [],
			addLoading: false,
            updateSecretkeyInfo: {
            	sellerId: null,
            	newSecretkey: null
            },
            updateSellerNameInfo: {
            	sellerId: null,
            	sellerName: null
            },
            updateSecretkeyDialog: false,
            updateSellerNameDialog: false
        }
    },
    created: function() {
        this.params.sellerNameLike = this.$route.query.sellerNameLike || null;
        this.params.shopId = parseInt(this.$route.query.shopId) || null;
        if (this.params.shopId) {
        	this.hasShopId = true;
        }
        this.getList();
    },
    methods: {
    	back: function(){
    		this.$router.back(-1);
    	},
    	showUpdateSecretkey: function(index, row){
			this.updateSecretkeyDialog = true;
			this.updateSecretkeyInfo = {
            	sellerId: row.sellerId,
            	newSecretkey: null
			}
    	},
    	showUpdateSellerName: function(index, row){
			this.updateSellerNameDialog = true;
			this.updateSellerNameInfo = {
            	sellerId: row.sellerId,
            	sellerName: null
			}
    	},
		currentChange: function(val) {
            this.params.pageId = val;
            this.getList()
        },
    	todoUpdateSellerNameDialog: function(){
			updateSellerName(this.updateSellerNameInfo).then(res => {
				this.getList();
				this.$message({
					type: 'success',
					message: '更新成功'
				})
				this.closeSellerNameDialog();
			})
    	},
    	todoUpdateSecretkeyDialog: function(){
			updateSecretkey(this.updateSecretkeyInfo).then(res => {
				this.getList();
				this.$message({
					type: 'success',
					message: '更新成功'
				})
				this.closeSecretkeyDialog();
			})
    	},
    	closeSellerNameDialog: function() {
			this.updateSellerNameDialog = false;
			this.updateSellerNameInfo = {
            	sellerId: null,
            	sellerName: null
			}
    	},
    	closeSecretkeyDialog: function() {
			this.updateSecretkeyDialog = false;
			this.updateSecretkeyInfo = {
            	sellerId: null,
            	newSecretkey: null
			}
    	},
		changeRouterPushValue: function() {
			var p = {};
			if (this.params.sellerNameLike){
				p.sellerNameLike = this.params.sellerNameLike;
			}
			if (this.params.shopId){
				p.shopId = this.params.shopId;
			}
			if (this.params.pageId != 1){
				p.pageId = this.params.pageId;
			}
            this.$router.push({query: p});
		},
        getList: function() {
            sellerList({ params: this.params }).then(data => {
				this.changeRouterPushValue();
                this.counts = data.count;
                this.sellerList = data.list;
            })
        },
        updateSecretkey: function(index, row){
			saveAdmin(row.adminId).then(res => {
				this.getAdminList();
				this.$message({
					type: 'success',
					message: '添加成功'
				})
				this.addDialog = false;
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