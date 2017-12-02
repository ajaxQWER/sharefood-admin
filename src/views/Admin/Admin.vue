<template>
	<el-row class="lives-news">
		<el-row class="title">
			<h3>管理员列表</h3>
		</el-row>
		<el-row>
			<el-form :inline="true">
			    <el-form-item>
			        <el-button type="primary" @click="showAddDialog"><i class="el-icon-plus el-icon--left"></i>添加管理员</el-button>
			    </el-form-item>
			    <el-form-item label="管理员搜索">
			        <el-input placeholder="请输入管理员名称" icon="search" v-model="params.usernameLike" :on-icon-click="getAdminList">
			        </el-input>
			    </el-form-item>
			</el-form>
		</el-row>
		<el-row>
			<el-table :data="adminList">
				<el-table-column prop="adminId" label="管理员id" align="center" width="120px"></el-table-column>
                <el-table-column prop="username" label="管理员账号" align="center"></el-table-column>
                <el-table-column label="注册时间" align="center" width="200px">
                    <template slot-scope="scope">{{moment(scope.row.registrationTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
                </el-table-column>
                <el-table-column label="上次登录时间" align="center" width="200px">
                    <template slot-scope="scope">{{moment(scope.row.lastLoginTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="small" @click="updateAdminRole(scope.$index, scope.row)">角色管理</el-button>
                        <el-button size="small" type="primary" @click="showUpdatePwdPopup(scope.$index, scope.row)">修改密码</el-button>
                    </template>
                </el-table-column>
			</el-table>
		</el-row>
		<el-dialog title="新增管理员" :visible.sync="addDialog" size="tiny" @close="closeDialog" class="dialog">
		    <el-form :model="newAdmin" label-width="120px">
		        <el-form-item label="管理员账号">
		            <el-input type="text" v-model="newAdmin.username" auto-complete="off" placeholder="管理员账号"></el-input>
		        </el-form-item>
		        <el-form-item label="管理员密码">
		            <el-input type="text" v-model="newAdmin.secretkey" auto-complete="off" placeholder="管理员密码"></el-input>
		        </el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
		        <el-button @click="closeDialog">取 消</el-button>
		        <el-button type="primary" @click="addAdminFn" :loading="addLoading">确 定</el-button>
		    </div>
		</el-dialog>
		<el-dialog title="修改密码" :visible.sync="updatePwdDialog" size="tiny" @close="closeUpdatePwdDialog" class="dialog">
			    <el-form :model="password" label-width="120px">
			        <el-form-item label="新密码">
			            <el-input type="text" v-model="password.newSecretkey" auto-complete="off" placeholder="新密码"></el-input>
			        </el-form-item>
			    </el-form>
		    <div slot="footer" class="dialog-footer">
		        <el-button @click="cancelUpdatePwd">取 消</el-button>
		        <el-button type="primary" @click="updatePwdFn" :loading="addLoading">确 定</el-button>
		    </div>
		</el-dialog>

        <!-- 分页 -->
        <el-row>
            <el-col class="pagination">
                <el-pagination @current-change="currentChange" :current-page="params.pageId" :page-size="params.pageSize" layout="total, prev, pager, next" :total="counts">
                </el-pagination>
            </el-col>
        </el-row>
	</el-row>
</template>
<script>
import {
	getAdminList,
	saveAdmin,
	updateAdminSecretkey,
	deleteAdmin
} from '@/api/api'
export default {
	data: function(){
		return {
			params: {
				usernameLike: '',
				pageId: 1,
				pageSize: 20,
			},
			counts: 0,
			addDialog: false,
			addLoading: false,
			updatePwdDialog: false,
			adminList: null,
			newAdmin: {
				secretkey: "",
				username: ""
			},
			password: {
				newSecretkey: ""
			},
			adminId: 0
		}
	},
	created: function(){
		var pageId = +this.$route.query.pageId;
		this.params.pageId = isNaN(pageId) ? 1 : pageId;
		this.params.usernameLike = this.$route.query.usernameLike ? this.$route.query.usernameLike : '';
		this.getAdminList();
	},
	methods: {
		changeRouterPushValue: function() {
            this.$router.push('?pageId=' + this.params.pageId + '&usernameLike=' + this.params.usernameLike)
		},
		currentChange: function(val) {
            this.params.pageId = val;
            this.getAdminList()
        },
		getAdminList: function(){
			getAdminList({params: this.params}).then(res => {
				this.changeRouterPushValue();
				this.counts = res.count;
				this.adminList = res.list;
			})
		},
		showAddDialog: function(){
			this.addDialog = true;
		},
		closeDialog: function(){
			this.addDialog = false;
			this.newAdmin = {
				adminId: 0,
				secretkey: "",
				username: ""
			}
		},
		addAdminFn: function(){
			saveAdmin(this.newAdmin).then(res => {
				this.getAdminList();
				this.$message({
					type: 'success',
					message: '添加成功'
				})
				this.addDialog = false;
			})
		},
		updateAdminRole: function(index, row){
			var queryParams = this.params;
			queryParams.adminId = row.adminId;
			
			delete queryParams.pageSize;
		
        	this.$router.push({
        		path: '/admin/role', 
        		query: queryParams
        	})
		},
		closeUpdatePwdDialog: function(){
			this.updatePwdDialog = false;
			this.adminId = 0;
			this.password = {
				newSecretkey: ""
			}
		},
		cancelUpdatePwd: function(){
			this.closeUpdatePwdDialog()
		},
		showUpdatePwdPopup: function(index, row){
			this.updatePwdDialog = true;
			this.adminId = row.adminId;
		},
		updatePwdFn: function(){
			updateAdminSecretkey(this.adminId, this.password).then(res => {
				this.getAdminList();
				this.$message({
					type: 'success',
					message: '修改成功'
				})
				this.updatePwdDialog = false;
			})
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
	}
</style>