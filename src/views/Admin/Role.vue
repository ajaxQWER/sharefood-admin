<template>
	<el-row class="lives-news">
		<el-row class="title">
			<h3>角色列表</h3>
		</el-row>
		<el-row>
			<el-form :inline="true">
			    <el-form-item>
			        <el-button type="primary" @click="showAddDialog"><i class="el-icon-plus el-icon--left"></i>添加角色</el-button>
			    </el-form-item>
			    <el-form-item label="角色搜索">
			        <el-input placeholder="请输入角色名称" icon="search" v-model="params.roleName" :on-icon-click="getRoleList">
			        </el-input>
			    </el-form-item>
			</el-form>
		</el-row>
		<el-row>
			<el-table :data="roleList" :row-style="{fontSize:'12px'}" border>
				<el-table-column prop="roleId" label="角色id" align="center" width="120px"></el-table-column>
                <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
                <el-table-column label="超级管理员" align="center" width="200px">
                    <template slot-scope="scope">{{scope.row.allScope ? '是' : '否'}}</template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope" v-if="!scope.row.allScope">
                        <el-button size="small" type="danger" @click="deleteRole(scope.$index, scope.row)">删除</el-button>
                        <el-button size="small" type="primary" @click="updateRole(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" @click="updateRolePermissionPoint(scope.$index, scope.row)">权限管理</el-button>
                    </template>
                </el-table-column>
			</el-table>
		</el-row>
		<el-dialog :title="isAdd ? '新增角色' : '编辑角色'" :visible.sync="addDialog" size="tiny" @close="closeDialog" class="dialog">
		    <el-form :model="newRole" label-width="120px">
		        <el-form-item label="角色名称">
		            <el-input type="text" v-model="newRole.roleName" auto-complete="off" placeholder="角色名称"></el-input>
		        </el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
		        <el-button @click="closeDialog">取 消</el-button>
		        <el-button type="primary" @click="addRoleFn" :loading="addLoading">确 定</el-button>
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
	getRoleList,
	saveRole,
	updateRole,
	deleteRole
} from '@/api/api'
export default {
	data: function(){
		return {
			params: {
				roleName: '',
				pageId: 1,
				pageSize: 20,
			},
			isAdd: false,
			counts: 0,
			addDialog: false,
			addLoading: false,
			roleList: null,
			newRole: {
				roleId: 0,
				roleName: ""
			}
		}
	},
	created: function(){
		var pageId = +this.$route.query.pageId;
		this.params.pageId = isNaN(pageId) ? 1 : pageId;
		this.params.roleName = this.$route.query.roleName ? this.$route.query.roleName : '';
		this.getRoleList();
	},
	methods: {
		changeRouterPushValue: function() {
            this.$router.push('?pageId=' + this.params.pageId + '&roleName=' + this.params.roleName)
		},
		currentChange: function(val) {
            this.params.pageId = val;
            this.getRoleList()
        },
		getRoleList: function(){
			getRoleList({params: this.params}).then(res => {
				this.changeRouterPushValue();
				this.counts = res.count;
				this.roleList = res.list;
			})
		},
		showAddDialog: function(){
			this.isAdd = true;
			this.addDialog = true;
		},
		closeDialog: function(){
			this.addDialog = false;
			this.newRole = {
				roleId: 0,
				roleName: ""
			}
		},
		updateRole: function (index, row) {
			this.isAdd = false;
			this.addDialog = true;
			this.newRole = row;
		},
		deleteRole: function (index, row) {
            this.$confirm('是否删除该角色?', '删除角色', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteRole(row.roleId).then(() => {
                    this.getRoleList();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                })
            }).catch(() => {});
		},
		addRoleFn: function(){
			if (this.isAdd) {
				saveRole(this.newRole).then(res => {
					this.getRoleList();
					this.$message({
						type: 'success',
						message: '添加成功'
					})
					this.addDialog = false;
				})
			} else {
				updateRole(this.newRole).then(res => {
					this.getRoleList();
					this.$message({
						type: 'success',
						message: '编辑成功'
					})
					this.addDialog = false;
				})
			}
		},
		updateRolePermissionPoint: function(index, row){
			var queryParams = this.params;
			queryParams.roleId = row.roleId;
			
			delete queryParams.pageSize;
		
        	this.$router.push({
        		path: '/role/permissionPoint', 
        		query: queryParams
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