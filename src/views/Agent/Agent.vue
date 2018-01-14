<template>
	<el-row class="lives-news">
		<el-row class="title">
			<h3>代理商管理</h3>
		</el-row>
		<el-row>
			<el-form :inline="true">
			    <el-form-item>
			        <el-button type="primary" @click="showAddDialog"><i class="el-icon-plus el-icon--left"></i>添加代理商</el-button>
			    </el-form-item>
			    <el-form-item label="代理商搜索">
			        <el-input placeholder="请输入代理商名称" icon="search" v-model="agentNameLike" :on-icon-click="searchAgent">
			        </el-input>
			    </el-form-item>
			</el-form>
		</el-row>
		<el-row>
			<el-table :data="agentLists">
				<el-table-column prop="agentId" label="代理商id" align="center" width="120px"></el-table-column>
                <el-table-column prop="agentName" label="代理商名称" align="center"></el-table-column>
                <el-table-column prop="username" label="代理商账号" align="center" width="180px"></el-table-column>
                <el-table-column prop="settlementTemplateId" label="结算模板id" align="center" width="160px"></el-table-column>
                <el-table-column label="注册时间" align="center" width="200px">
                    <template slot-scope="scope">{{moment(scope.row.registrationTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
                </el-table-column>
                <el-table-column label="上次登录时间" align="center" width="200px">
                    <template slot-scope="scope">{{moment(scope.row.lastLoginTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
                </el-table-column>
                <el-table-column label="操作" width="160px" align="center">
                    <template slot-scope="scope">
                        <el-button size="small" @click="updateAgent(scope.$index, scope.row)">修改</el-button>
                        <el-button size="small" type="danger" @click="deleteAgent(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
			</el-table>
		</el-row>
		<el-dialog :title="isAdd?'新增代理商':'修改代理商'" :visible.sync="addDialog" size="tiny" @close="closeDialog" class="dialog">
		    <el-form :model="newAgent" label-width="120px">
		        <el-form-item label="代理商名称">
		            <el-input type="text" v-model="newAgent.agentName" auto-complete="off" placeholder="代理商名称"></el-input>
		        </el-form-item>
		        <el-form-item label="代理商账号">
		            <el-input type="text" v-model="newAgent.username" auto-complete="off" placeholder="代理商账号"></el-input>
		        </el-form-item>
		        <el-form-item label="代理商密码" v-if="isAdd">
		            <el-input type="text" v-model="newAgent.secretkey" auto-complete="off" placeholder="代理商密码"></el-input>
		        </el-form-item>
		        <el-form-item label="结算模板">
		            <el-select v-model.number="newAgent.settlementTemplateId" filterable placeholder="请选择结算模板">
					    <el-option
					      v-for="(item,index) in settlementTemplate"
					      :key="index"
					      :label="item.settlementTemplateName"
					      :value="item.settlementTemplateId">
					    </el-option>
					</el-select>
		        </el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
		        <el-button @click="cancel">取 消</el-button>
		        <el-button type="primary" @click="addAgentFn" :loading="addLoading">确 定</el-button>
		    </div>
		</el-dialog>
	</el-row>
</template>
<script>
	import {getAgentLists,addAgent,deleteAgentById,updateAgentById,getSettlementTemplateLists} from '@/api/api'
	export default {
		data: function(){
			return {
				agentNameLike: '',
				isAdd: true,
				pageId: 1,
				pageSize: 10,
				counts: 0,
				addDialog: false,
				addLoading: false,
				agentLists: null,
				settlementTemplate: null,
				newAgent: {
					agentName: "",
					secretkey: "",
					settlementTemplateId: "",
					username: ""
				}
			}
		},
		created: function(){
			this.getAgentList();
			getSettlementTemplateLists({params: {pageSize: 9999}}).then(res => {
				console.log(res)
				this.settlementTemplate = res.list;
			})
		},
		methods: {
			getAgentList: function(){
				getAgentLists({params: { pageId: this.pageId, pageSize: this.pageSize, agentNameLike: this.agentNameLike}}).then(res => {
					console.log(res)
					this.counts = res.count;
					this.agentLists = res.list;
				})
			},
			searchAgent: function(){
				this.getAgentList()
			},
			showAddDialog: function(){
				this.isAdd = true;
				this.addDialog = true;
			},
			closeDialog: function(){
				this.isAdd = false;
				this.addDialog = false;
				this.newAgent = {
					agentId: 0,
					agentName: "",
					secretkey: "",
					settlementTemplateId: '',
					username: ""
				}
			},
			cancel: function(){
				this.closeDialog()
			},
			addAgentFn: function(){
				if(this.isAdd){
					addAgent(this.newAgent).then(res => {
						console.log(res)
						this.getAgentList();
						this.$message({
							type: 'success',
							message: '添加成功'
						})
						this.addDialog = false;
					})
				}else{
					updateAgentById(this.newAgent).then(res => {
						console.log(res)
						this.getAgentList();
						this.$message({
							type: 'success',
							message: '修改成功'
						})
						this.addDialog = false;
					})
				}
			},
			updateAgent: function(index, row){
				this.isAdd = false;
				this.addDialog = true;
				this.newAgent = {
					agentId: row.agentId,
					agentName: row.agentName,
					settlementTemplateId: row.settlementTemplateId,
					username: row.username
				}
			},
			deleteAgent: function(index, row){
				this.$confirm('是否删除该代理商?', '删除代理商', {
				    confirmButtonText: '确定',
				    cancelButtonText: '取消',
				    type: 'warning'
				}).then(() => {
				    deleteAgentById(row.agentId).then(() => {
				        this.getAgentList();
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