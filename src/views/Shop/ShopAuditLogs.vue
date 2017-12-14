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
                    <el-input placeholder="请输入审核人" icon="search" v-model="auditName" :on-icon-click="getAuditLogs"></el-input>
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
                <el-form-item label="审核状态">
                    <el-select v-model="audit" placeholder="请选择" @change="getAuditLogs">
                        <el-option
                          v-for="(item,index) in auditStatusType"
                          :key="index"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-col>
                <el-table :data="auditLists" :row-style="{fontSize:'12px'}" border>
                    <el-table-column label="审核人Id" width="160px" align="center" prop="adminId"></el-table-column>
                    <el-table-column label="审核人" align="center" prop="auditName"></el-table-column>
                    <el-table-column label="审核状态" align="center">
                        <template slot-scope="scope">{{formatAudit(scope.row.audit)}}</template>
                    </el-table-column>
                    <el-table-column label="店铺Id" align="center" prop="shopId"></el-table-column>
                    <el-table-column label="店铺名称" align="center" prop="shopName"></el-table-column>
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
            auditName: '',
            audit: '',
            pageId: 1,
            pageSize: 20,
            counts: 0,
            dateRange: '',
            beginTime: '',
            endTime: '',
            auditLists: null,
            auditStatusType: [{
                label: '全部',
                value: ' '
            },{
                label: '等待审核',
                value: 'WAIT_AUDIT'
            },{
                label: '审核通过',
                value: 'AUDIT_ADOPT'
            },{
                label: '审核未通过',
                value: 'AUDIT_UNADOPT'
            },]
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getAuditLogs();
    },
    methods: {
        //获取视频分类列表
        getAuditLogs: function() {
            getAuditLogList({ params: { pageId: this.pageId, pageSize: this.pageSize, auditName: this.auditName, beginTime: this.beginTime, endTime: this.endTime, audit: this.audit } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.auditLists = data.list;
            })
        },
        formatAudit: function(type){
            switch(type){
                case 'WAIT_AUDIT':
                    return '等待审核';
                case 'AUDIT_ADOPT':
                    return '审核通过';
                case 'AUDIT_UNADOPT':
                    return '审核未通过';
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