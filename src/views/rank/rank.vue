<template>
    <el-row class="lives-news">
        <el-col class="title">
            <h3>龙虎榜</h3>
        </el-col>
        <el-col>
            <el-col>
                <el-form :inline="true">
                    <el-form-item>
                        <el-button type="primary" @click="showDialog"><i class="el-icon-plus el-icon--left"></i>添加股票</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col>
                <el-table :data="rankList">
                    <el-table-column prop="type" label="类型" align="center"></el-table-column>
                    <el-table-column prop="stockName" label="股票名称" align="center"></el-table-column>
                    <el-table-column prop="stockNumber" label="股票编号" align="center"></el-table-column>
                    <el-table-column prop="correct" label="战绩" align="center"></el-table-column>
                    <el-table-column prop="teacherNumbers" label="老师关注" align="center"></el-table-column>
                    <el-table-column width="200px" label="创建时间" align="center">
                        <template scope="scope">
                            {{moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="unitPrice" label="单价" align="center"></el-table-column>
                    <el-table-column prop="promotionsPrice" label="促销价" align="center"></el-table-column>
                    <el-table-column label="操作" align="center" width="200px">
                        <template scope="scope">
                            <el-button size="small" @click="handleUpdateProduct(scope.$index, scope.row)">修改</el-button>
                            <el-button type="danger" size="small" @click="handleDeleteProduct(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-col>
        <!-- 分页 -->
        <el-col class="pagination">
            <el-pagination @current-change="currentChange" :current-page="pageId" :page-size="pageSize" layout="total, prev, pager, next" :total="counts">
            </el-pagination>
        </el-col>
        <!-- 修改产品 -->
        <el-dialog :title="isAdd?'新增龙虎榜':'修改龙虎榜'" :visible.sync="productDialog" size="tiny" @close="closeRankDialog" class="dialog">
            <el-form :model="productObj" label-width="100px" ref="newProduct">
                <el-form-item label="类型">
                    <el-select v-if="isAdd" v-model="productObj.type" placeholder="请选择">
                        <el-option
                          v-for="(item,index) in productType"
                          :key="index"
                          :label="item"
                          :value="item">
                        </el-option>
                    </el-select>
                    <el-input v-else v-model="productObj.type" auto-complete="off" placeholder="类型" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="股票名称">
                    <el-input v-model="productObj.stockName" auto-complete="off" placeholder="股票名称"></el-input>
                </el-form-item>
                <el-form-item label="股票编号">
                    <el-input v-model="productObj.stockNumber" auto-complete="off" placeholder="股票编号"></el-input>
                </el-form-item>
                <el-form-item label="战绩">
                    <el-input v-model="productObj.correct" auto-complete="off" placeholder="战绩"></el-input>
                </el-form-item>
                <el-form-item label="老师关注数">
                    <el-input v-model="productObj.teacherNumbers" auto-complete="off" placeholder="老师关注数"></el-input>
                </el-form-item>
                <el-form-item label="单价">
                    <el-input v-model="productObj.unitPrice" auto-complete="off" placeholder="单价"></el-input>
                </el-form-item>
                <el-form-item label="排名">
                    <el-input v-model="productObj.number" auto-complete="off" placeholder="排名"></el-input>
                </el-form-item>
                <el-form-item label="促销价">
                    <el-input v-model="productObj.promotionsPrice" auto-complete="off" placeholder="促销价"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeRankDialog">取 消</el-button>
                <el-button type="primary" @click="updateRank">确 定</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>
<script>
import {
    getRankList,
    addRank,
    updateRankById,
    deleteRankById
} from '@/api/api'
export default {
    data: function() {
        return {
            productObj: {
                correct: 0,
                number: 0,
                promotionsPrice: 0,
                stockName: '',
                stockNumber: '',
                teacherNumbers: 0,
                type: '',
                unitPrice: 0
            },
            productType: ['A1龙虎榜','A2龙虎榜','A3龙虎榜'],
            rankList: null,
            pageId: 1,
            pageSize: 10,
            counts: 0,
            rowIndex: 0,
            isAdd: true,
            productDialog: false
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getLists();
    },
    methods: {
        //获取视频列表
        getLists: function() {
            getRankList({ params: { pageId: this.pageId, pageSize: this.pageSize } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.rankList = data.list;
            })
        },
        //显示添加产品弹层
        showDialog: function() {
            this.productDialog = true;
        },
        //关闭弹窗层
        closeRankDialog: function() {
            this.productDialog = false;
            this.isAdd = true;
            this.productObj = {
                correct: 0,
                number: 0,
                promotionsPrice: 0,
                stockName: '',
                stockNumber: '',
                teacherNumbers: 0,
                type: '',
                unitPrice: 0
            }
        },
        //取消添加产品
        cancelAddProduct: function() {
            this.productDialog = false;
        },
        //取消修改产品
        cancelUpdateProduct: function() {
            this.productDialog = false;
        },
        //修改产品
        handleUpdateProduct: function(index, row) {
            console.log(row)
            this.isAdd = false;
            this.productDialog = true;
            this.rowIndex = index;
            this.productObj = {
                rankingId: row.rankingId,
                correct: row.correct,
                number: row.number,
                promotionsPrice: row.promotionsPrice,
                stockName: row.stockName,
                stockNumber: row.stockNumber,
                teacherNumbers: row.teacherNumbers,
                type: row.type,
                unitPrice: row.unitPrice
            }
        },
        //点击确定修改产品
        updateRank: function() {
           console.log(this.isAdd)
           if(this.isAdd){
                console.log(this.productObj)
                addRank(this.productObj).then(data=>{
                    this.productDialog = false;
                    this.getLists()
                    this.$message({
                        type: 'success',
                        message: '新增成功'
                    })
                }).catch()
           }else{
                updateRankById(this.productObj).then(data=>{
                    this.productDialog = false;
                    this.getLists()
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    })
                }).catch()
           }
        },
        handleDeleteProduct: function(index,row){
            deleteRankById(row).then(()=>{
                this.productDialog = false;
                this.getLists()
                this.$message({
                    type: 'success',
                    message: '删除成功'
                })
            }).catch()
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
    .label-color {
        color: #ff0300;
    }
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 25%;
    }
}
</style>