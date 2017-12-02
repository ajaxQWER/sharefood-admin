<template>
	<el-row class="lives-news">
		<el-row class="title">
			<h3>代理商区域管理({{agent.agentName ? agent.agentName : '' }})</h3>
		</el-row>
		<el-row>
			<el-form :inline="true">
			    <el-form-item>
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
                        <el-button size="small" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
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
		            <el-select v-model.number="addInfo.provinceId" filterable placeholder="请选择省" @change="provinceChange">
					    <el-option
					      v-for="(item,index) in provinceList"
					      :key="index"
					      :label="item.provinceName"
					      :value="item.provinceId">
					    </el-option>
					</el-select>
		        </el-form-item>
		        <el-form-item label="市">
		            <el-select v-model.number="addInfo.cityId" filterable placeholder="请选择市" @change="cityChange">
					    <el-option
					      v-for="(item,index) in cityList"
					      :key="index"
					      :label="item.cityName"
					      :value="item.cityId">
					    </el-option>
					</el-select>
		        </el-form-item>
		        <el-form-item label="区">
		            <el-select v-model.number="addInfo.areaId" filterable placeholder="请选择区" @change="areaChange">
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
	getProvinceList,
	getCityList,
	getAreaList,
	findAgentById,
	getAgentRegion,
	updateAgentRegion
} from '@/api/api'
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
			cityListCache: {},
			areaListCache: {},
			regions: [],
			cache: {},
			nowAreaMap: {}
		}
	},
	created: function(){
		getProvinceList().then(data => {
			this.provinceList = data;
		})
		this.provinceChange(this.addInfo.provinceId)
		this.cityChange(this.addInfo.cityId)
		
		this.agentId = this.$route.query.agentId;
    	findAgentById(this.agentId).then(data => {
    		this.agent = data
    	})
    	getAgentRegion(this.agentId).then(data => {
    		this.regions = data
    		
    		for (var k in data){
    			var r = data[k];
    			
    			if (!this.cache[r.provinceId]){
    				this.cache[r.provinceId] = {};
    			}
    			
    			if (!this.cache[r.provinceId][r.cityId]){
    				this.cache[r.provinceId][r.cityId] = {};
    			}
    			
    			if (!this.cache[r.provinceId][r.cityId][r.areaId]){
    				this.cache[r.provinceId][r.cityId][r.areaId] = r;
    			}
    		}
    	})
	},
	methods: {
		provinceChange: function(value) {
			if (this.cityListCache[value]) {
				this.cityList = this.cityListCache[value];
				
				this.setCityInfo(this.cityList[0])
			} else {
				getCityList(value).then(data => {
					this.cityListCache[value] = data;
					this.cityList = data;
					
					this.setCityInfo(data[0])
				})
			}
		},
		setCityInfo: function(city) {
			this.addInfo.cityId = city.cityId;
			this.addInfo.cityName = city.cityName;
			
			this.cityChange(city.cityId)
		},
		cityChange: function(value) {
			if (this.areaListCache[value]) {
				this.areaList = this.areaListCache[value];
				
				this.nowAreaMap = {};
				
				for (var k in this.areaList) {
					var a = this.areaList[k];
					
					this.nowAreaMap[a.areaId] = a.areaName;
				}
				
				this.setAreaInfo(this.areaList[0]);
			} else {
				getAreaList(value).then(data => {
					this.areaListCache[value] = data;
					this.areaList = data;
					
					this.nowAreaMap = {};
					
					for (var k in this.areaList) {
						var a = this.areaList[k];
						
						this.nowAreaMap[a.areaId] = a.areaName;
					}
					
					this.setAreaInfo(data[0]);
				})
			}
		},
		setAreaInfo: function(area) {
			this.addInfo.areaId = area.areaId;
			this.addInfo.areaName = area.areaName;
		},
		areaChange: function(value) {
			this.addInfo.areaId = value;
			this.addInfo.areaName = this.nowAreaMap[value];
		},
		addAgentFn: function() {
			if (this.check(this.addInfo)) {
				this.regions.push(this.addInfo)
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
		check: function(r){
			if (!this.cache[r.provinceId]){
				this.cache[r.provinceId] = {};
			}
			
			if (!this.cache[r.provinceId][r.cityId]){
				this.cache[r.provinceId][r.cityId] = {};
			}
			
			if (this.cache[r.provinceId][r.cityId][r.areaId]){
				return false;
			}
			
			this.cache[r.provinceId][r.cityId][r.areaId] = r;
			return true;
		},
		saveRegion: function() {
			updateAgentRegion(this.agentId, this.regions).then(res => {
				this.$message({
					type: 'success',
					message: '保存成功'
				})
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
	.hidden {
		display: none;
	}
</style>