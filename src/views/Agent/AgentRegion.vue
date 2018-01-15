<template>
	<el-row class="lives-news">
		<el-row class="title">
			<h3>代理商区域管理({{agent.agentName ? agent.agentName : '' }})</h3>
		</el-row>
		<el-row>
			<el-form :inline="true">
			    <el-form-item>
			        <el-button type="primary" icon="arrow-left" @click="back">返回</el-button>
			        <el-button type="primary" @click="showAddDialog"><i class="el-icon-plus el-icon--left"></i>添加区域</el-button>
			        <el-button type="primary" @click="saveRegion">保存</el-button>
			    </el-form-item>
			</el-form>
		</el-row>
		<el-row>
			<el-table :data="regions">
				<el-table-column prop="provinceName" label="省" align="center"></el-table-column>
                <el-table-column prop="cityName" label="市" align="center"></el-table-column>
                <el-table-column prop="areaName" label="区" align="center"></el-table-column>
                <el-table-column label="操作" width="300px" align="center">
                    <template slot-scope="scope">
                        <el-button size="small" type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
			</el-table>
		</el-row>
		<el-dialog title="添加区域" :visible.sync="addDialog" size="tiny" @close="closeDialog" class="dialog">
		    <el-form :model="addInfo" label-width="120px">
	        	<div class="hidden">
	        		<el-input type="hidden" v-model="addInfo.provinceName" ></el-input>
	        		<el-input type="hidden" v-model="addInfo.cityName" ></el-input>
	        		<el-input type="hidden" v-model="addInfo.areaName" ></el-input>
	        	</div>
		        <el-form-item label="省">
		            <el-select ref="province" v-model.number="addInfo.provinceId" filterable placeholder="请选择省" @change="provinceChange">
					    <el-option
					      v-for="(item,index) in provinceList"
					      :key="index"
					      :label="item.provinceName"
					      :value="item.provinceId">
					    </el-option>
					</el-select>
		        </el-form-item>
		        <el-form-item label="市">
		            <el-select ref="city" v-model.number="addInfo.cityId" filterable placeholder="请选择市" @change="cityChange">
					    <el-option
					      v-for="(item,index) in cityList"
					      :key="index"
					      :label="item.cityName"
					      :value="item.cityId">
					    </el-option>
					</el-select>
		        </el-form-item>
		        <el-form-item label="区">
		            <el-select ref="area" v-model.number="addInfo.areaId" filterable placeholder="请选择区" @change="areaChange">
					    <el-option
					      v-for="(item,index) in areaList"
					      :key="index"
					      :label="item.areaName"
					      :value="item.areaId">
					    </el-option>
					</el-select>
		        </el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
		        <el-button @click="cancel">取 消</el-button>
		        <el-button type="primary" @click="addAgentFn">确 定</el-button>
		    </div>
		</el-dialog>
	</el-row>
</template>
<script>
import {
	findAgentById,
	getAgentRegion,
	updateAgentRegion
} from '@/api/api'
import {
	getProvinceList,
	getCityList,
	getAreaList
} from '@/api/region'
export default {
	data: function(){
		return {
			addDialog: false,
			agentId: 0,
			agent: {
				agentId: 0,
				agentName: "",
				username: ""
			},
			addInfo: {
				provinceId: 110000,
				provinceName: "北京市",
				cityId: 110100,
				cityName: "北京市",
				areaId: 110101,
				areaName: "东城区"
			},
			provinceList: [],
			cityList: [],
			areaList: [],
			regions: []
		}
	},
	created: function(){
		Region.province.list().then(data => {
			this.provinceList = data;
		})
		this.provinceChange(this.addInfo.provinceId)
		this.cityChange(this.addInfo.cityId)
		
		this.agentId = this.$route.query.agentId;
    	findAgentById(this.agentId).then(data => {
    		this.agent = data
    	})
    	getAgentRegion(this.agentId).then(data => {
    		console.log(data)
    		this.regions = data
    	})
	},
	methods: {
		provinceChange: function(value) {
			this.addInfo.provinceId = value;
			Region.city.list(value).then(data => {
            	console.log(data)
            	if(data.length > 0){
                    this.addInfo.cityId = data[0].cityId;
            	}else{
            		this.addInfo.cityId = '';
            	}
                this.cityList = data;
            })
		},
		cityChange: function(value) {
			this.addInfo.cityId = value;
				Region.area.list(value).then(data => {
					if(data.length > 0){
	                    this.addInfo.areaId = data[0].areaId;
					}else{
						this.addInfo.areaId = '';
					}
					this.areaList = data;
				})
		},
		areaChange: function(value) {
			this.addInfo.areaId = value;
		},
		addAgentFn: function() {
			var addInfo = {
				provinceId: this.addInfo.provinceId,
				provinceName: this.$refs.province.query,
				cityId: this.addInfo.cityId,
				cityName: this.$refs.city.query,
				areaId: this.addInfo.areaId,
				areaName: this.$refs.area.query
			}
			// console.log(addInfo)
			var isCopy = this.regions.some(function(item,index){
				return (item.provinceId == addInfo.provinceId && item.cityId == addInfo.cityId && item.areaId == addInfo.areaId);
			})
			// console.log(isCopy)
			if(!isCopy){
				this.regions.push(addInfo)
			}else{
				this.$message({
					message: '添加失败，该区域代理已存在！',
					type: 'error'
				})
			}
		},
		cancel: function() {
		},
		showAddDialog: function(){
			this.addDialog = true;
		},
		closeDialog: function() {
		},
		deleteRow : function(index, row) {
			this.regions.splice(index, 1)
		},
		saveRegion: function() {
			updateAgentRegion(this.agentId, this.regions).then(res => {
				this.$message({
					type: 'success',
					message: '保存成功'
				})
			})
		},
		back: function(){
			this.$router.back()
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