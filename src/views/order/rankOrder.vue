<template>
    <el-row class="lives-news">
        <el-col class="title">
            <h3>充值订单</h3>
        </el-col>
        <el-col>
            <el-form :inline="true">
                <el-form-item>
                    <a :href="BASEURL+'/admin/rankingOrder/export?token='+jwt"><el-button type="primary">订单导出</el-button></a>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col>
            <el-table :data="rechargeData">
                <el-table-column width="220px" prop="rankingOrderSn" label="序列号" align="center"></el-table-column>
                <el-table-column width="100px" prop="type" label="类型" align="center"></el-table-column>
                <el-table-column prop="username" label="创建者" align="center"></el-table-column>
                <el-table-column prop="amountPay" label="订单金额" align="center"></el-table-column>
                <el-table-column width="180px" label="创建时间" align="center">
                    <template scope="scope">
                        {{moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column width="180px" label="支付完成时间" align="center">
                    <template scope="scope">
                        {{scope.row.payTime?moment(scope.row.payTime).format('YYYY-MM-DD HH:mm:ss'):''}}
                    </template>
                </el-table-column>
                <el-table-column width="100px" label="支付方式" align="center">
                    <template scope="scope">
                        {{formatPayType(scope.row.payType)}}
                    </template>
                </el-table-column>
                <el-table-column width="100px" label="是否完成" align="center">
                    <template scope="scope">
                        {{scope.row.payed? '是':'否'}}
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
        <!-- 分页 -->
        <el-col class="pagination">
            <el-pagination @current-change="currentChange" :current-page="pageId" :page-size="pageSize" layout="total, prev, pager, next" :total="counts">
            </el-pagination>
        </el-col>
    </el-row>
</template>
<script>
import {
    getrankingOrder,
    getrankingOrderById
} from '@/api/api'
export default {
    data: function() {
        return {
            rechargeData: null,
            pageId: 1,
            pageSize: 10,
            counts: 0,
            rowIndex: 0,
            productDialog: false,
            jwt: sessionStorage.getItem('jwt')
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getLists();
    },
    methods: {
        //获取视频列表
        getLists: function() {
            getrankingOrder({ params: { pageId: this.pageId, pageSize: this.pageSize } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.rechargeData = data.list;
            })
        },
        formatPayType: function(type){
            switch (type) {
                case 'ALIPAY':
                    return "支付宝"
                    break;
                case 'FREE':
                    return "免费"
                    break;
                case 'WX':
                    return "微信"
                    break;
                case 'BANK':
                    return "银行卡"
                    break;
                default:
                    break;
            }
        },
        //分页
        currentChange: function(val) {
            this.$router.push('?page=' + val)
            this.pageId = val;
            this.getLists()
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