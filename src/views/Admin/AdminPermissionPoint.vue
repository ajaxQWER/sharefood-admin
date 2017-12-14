<template>
	<el-row class="lives-news">
		<el-row class="title">
			<h3>角色({{roleName ? roleName : '' }})权限管理</h3>
		</el-row>
		<el-row>
			<el-form :inline="true">
			    <el-form-item>
			        <el-button type="primary" @click="saveRole">保存</el-button>
			    </el-form-item>
			</el-form>
		</el-row>
		<el-row>
			<el-table ref="pointTable" :data="points" @select="selectPoint" :row-style="{fontSize:'12px'}" border>
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="permissionPointKey" label="权限" align="center"></el-table-column>
                <el-table-column prop="permissionPointName" label="权限名称" align="center"></el-table-column>
			</el-table>
		</el-row>
	</el-row>
</template>
<script>
import {
	getRole,
	getRolePermissionPoint,
	updateRolePermissionPoint,
	getAllPermissionPoint
} from '@/api/api'
export default {
	data: function(){
		return {
			params: {},
			addDialog: false,
			roleId: 0,
			roleName: "",
			points: [],
			selectedPoints: []
		}
	},
	created: function(){
		this.params = this.$route.query;
		this.roleId = this.$route.query.roleId;
    	getRole(this.roleId).then(data => {
    		this.roleName = data.roleName
    	})
    	getAllPermissionPoint().then(res => {
    		this.points = res
    		
    		getRolePermissionPoint(this.roleId).then(r => {
    			this.selectedPoints = r;
    			for (var i in this.points){
    				var point = this.points[i];
    				
    				if (r.includes(point.permissionPointKey)){
    					this.$refs.pointTable.toggleRowSelection(point, true);
    				}
    			}
    		})
    	})
	},
	methods: {
		saveRole: function() {
			updateRolePermissionPoint(this.roleId, this.selectedPoints).then(r => {
				this.$message({
					type: 'success',
					message: '保存成功'
				})
				
				var params = this.params;
				
				delete params.roleId;
					
	        	this.$router.push({
	        		path: '/role', 
	        		query: params
	        	})
			})
		},
		selectPoint: function(v) {
			var keys = [];
			
			v.forEach(r => {
				keys.push(r.permissionPointKey)
			})
			
			this.selectedPoints = keys;
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