<template>
	<el-row class="lives-news">
		<el-row class="title">
			<h3>管理员({{username ? username : '' }})角色管理</h3>
		</el-row>
		<el-row>
			<el-form :inline="true">
			    <el-form-item>
			        <el-button type="primary" @click="saveRole">保存</el-button>
			    </el-form-item>
			</el-form>
		</el-row>
		<el-row>
			<el-table ref="roleTable" :data="roles" @select="selectRole" :row-style="{fontSize:'12px'}" border>
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
			</el-table>
		</el-row>
	</el-row>
</template>
<script>
import {
	getAdmin,
	getRoleList,
	getAdminRole,
	updateAdminRole
} from '@/api/api'
export default {
	data: function(){
		return {
			params: {},
			addDialog: false,
			adminId: 0,
			username: "",
			roles: [],
			selectedRoles: []
		}
	},
	created: function(){
		this.params = this.$route.query;
		this.adminId = this.$route.query.adminId;
    	getAdmin(this.adminId).then(data => {
    		this.username = data.username
    	})
    	getRoleList({
    		"params" : {
    			"pageSize" : 999999
    		}
    	}).then(res => {
    		this.roles = res.list
    		
    		getAdminRole(this.adminId).then(r => {
    			this.selectedRoles = r;
    			for (var i in this.roles){
    				var role = this.roles[i];
    				
    				if (r.includes(role.roleId)){
    					this.$refs.roleTable.toggleRowSelection(role, true);
    				}
    			}
    		})
    	})
	},
	methods: {
		saveRole: function() {
			updateAdminRole(this.adminId, this.selectedRoles).then(r => {
				this.$message({
					type: 'success',
					message: '保存成功'
				})
				
				var params = this.params;
				
				delete params.adminId;
					
	        	this.$router.push({
	        		path: '/admin', 
	        		query: params
	        	})
			})
		},
		selectRole: function(v) {
			var ids = [];
			
			v.forEach(r => {
				ids.push(r.roleId)
			})
			
			this.selectedRoles = ids;
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
	.hidden {
		display: none;
	}
</style>