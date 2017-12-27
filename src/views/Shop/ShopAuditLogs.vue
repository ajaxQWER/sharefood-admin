<template>
    <el-row class="lives-news">
        <el-row>
            <el-col class="title">
                <h3>店铺审核记录</h3>
            </el-col>
        </el-row>
        <el-row>
            <el-form class="inline-form" :inline="true" @sublimt.navite.prevent>
                <el-form-item label="搜索审核人">
                    <el-input placeholder="请输入审核人" icon="search" v-model="operatorNameLike" :on-icon-click="getAuditLogs"></el-input>
                </el-form-item>
                <el-form-item label="搜索店铺名称">
                    <el-input placeholder="请输入店铺ID" icon="search" v-model="shopNameLike" :on-icon-click="getAuditLogs"></el-input>
                </el-form-item>
                <el-form-item label="审核起始时间">
                    <el-date-picker
                          v-model="dateRange"
                          type="datetimerange"
                          placeholder="选择时间范围"
                          align="right"
                          range-separator="~"
                          @change="selectDateRange">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="审核类型">
                    <el-select v-model="auditType" placeholder="请选择审核类型" @change="getAuditLogs">
                        <el-option
                          v-for="(item,index) in auditStatusType"
                          :key="index"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                </el-form-item>
                <el-form-item label="是否通过">
                    <el-select v-model="passed" placeholder="是否通过" @change="getAuditLogs">
                        <el-option
                          v-for="(item,index) in passedType"
                          :key="index"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="resetSearch">重置查询条件</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-col>
                <el-table :data="auditLists" :row-style="{fontSize:'12px'}" border>
                    <el-table-column label="Id" width="100px" align="center" prop="auditLoggingId"></el-table-column>
                    <el-table-column label="操作人Id" width="100px" align="center" prop="operatorId"></el-table-column>
                    <el-table-column label="操作人" align="center" prop="operatorName" width="120px"></el-table-column>
                    <el-table-column label="操作人类型" align="center" width="140px">
                        <template slot-scope="scope">{{formatOperatorType(scope.row.operatorType)}}</template>
                    </el-table-column>
                    <el-table-column label="店铺Id" align="center" prop="shopId" width="100px"></el-table-column>
                    <el-table-column label="店铺名称" align="center" prop="shopName" width="100px"></el-table-column>
                    <el-table-column label="审核类型" align="center">
                        <template slot-scope="scope">{{formatAudit(scope.row.auditType)}}</template>
                    </el-table-column>
                    <el-table-column label="是否通过" align="center">
                        <template slot-scope="scope"><span :class="[!scope.row.passed?'unpass':'']">{{scope.row.passed?'通过':'不通过'}}</span><span v-if="!scope.row.passed"><br>({{scope.row.unauditReason}})</span></template>
                    </el-table-column>
                    <el-table-column label="审核备注" align="center" prop="auditRemark"></el-table-column>
                    <el-table-column label="操作时间" align="center">
                        <template slot-scope="scope">{{scope.row.auditTime?moment(scope.row.auditTime).format('YYYY-MM-DD HH:mm:ss'):'-'}}</template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>

        <!-- 分页 -->
        <el-row>
            <el-col class="pagination">
                <el-pagination @current-change="currentChange" :current-page="pageId" :page-size="pageSize" layout="total, prev, pager, next" :total="counts">
                </el-pagination>
            </el-col>
        </el-row>

    </el-row>
</template>
<script>
import {
    getAuditLogList,
    findUserById
} from '@/api/api'
export default {
    data: function() {
        return {
            operatorNameLike: '',
            shopNameLike: '',
            auditType: '',
            pageId: 1,
            pageSize: 20,
            counts: 0,
            dateRange: '',
            beginTime: '',
            endTime: '',
            auditLists: null,
            auditStatusType: [{
                label: '全部',
                value: ''
            },{
                label: '基本资料',
                value: 'BASE'
            },{
                label: '资质信息',
                value: 'QUALIFICATION'
            },{
                label: '结算信息',
                value: 'SETTLEMENT'
            },{
                label: '配送信息',
                value: 'DISTRIBUTION'
            },{
                label: '基本资料修改',
                value: 'BASE_CHANGE'
            },{
                label: '资质信息修改',
                value: 'QUALIFICATION_CHANGE'
            },{
                label: '结算信息修改',
                value: 'SETTLEMENT_CHANGE'
            }],
            passed: '',
            passedType: [{
                label: '全部',
                value: ''
            },{
                label: '通过',
                value: 'true'
            },{
                label: '不通过',
                value: 'false'
            }]
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getAuditLogs();
    },
    methods: {
        //获取视频分类列表
        getAuditLogs: function() {
            getAuditLogList({ params: { pageId: this.pageId, pageSize: this.pageSize, operatorNameLike: this.operatorNameLike, beginTime: this.beginTime, endTime: this.endTime, auditType: this.auditType, shopNameLike: this.shopNameLike, passed: this.passed } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.auditLists = data.list;
            })
        },
        formatOperatorType: function(type){
            switch(type){
                case 'AGENT':
                    return '代理商';
                case 'ADMIN':
                    return '管理员';
                case 'SYSTEM':
                    return '系统';
            }
        },
        formatAudit: function(type){
            switch(type){
                case 'BASE':
                    return '基本资料';
                case 'QUALIFICATION':
                    return '资质信息';
                case 'SETTLEMENT':
                    return '结算信息';
                case 'DISTRIBUTION':
                    return '配送信息';
                case 'BASE_CHANGE':
                    return '基本资料修改';
                case 'QUALIFICATION_CHANGE':
                    return '资质信息修改';
                case 'SETTLEMENT_CHANGE':
                    return '结算信息修改';
            }
        },
        //分页
        currentChange: function(val) {
            this.$router.push('?page=' + val)
            this.pageId = val;
            this.getAuditLogs()
        },
        selectDateRange: function(value){
            if(!value){
                this.beginTime = '';
                this.endTime = '';
                this.getAuditLogs();
                return;
            }
            var dateRange = value.split('~');
            this.beginTime = dateRange[0];
            this.endTime = dateRange[1];
            this.getAuditLogs();
        },
        resetSearch: function(){
            this.operatorNameLike = '';
            this.auditType = '';
            this.shopNameLike = '';
            this.passed = '';
            this.dateRange = '';
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
    .unpass{
        color: #ff0000;
    }
}
</style>