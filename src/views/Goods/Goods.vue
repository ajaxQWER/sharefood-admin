<template>
    <el-row class="lives-news">
        <el-row>
            <el-col class="title">
                <h3>商品管理</h3>
            </el-col>
        </el-row>
        <el-row>
            <el-form class="inline-form">
                <el-form-item label="商品名称"></el-form-item>
            </el-form>
            <el-col :span="4">
                <el-input placeholder="请输入商品名称" icon="search" v-model="searchContent" :on-icon-click="searchGoodsById">
                        </el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-table :data="goodsLists">
                    <el-table-column label="商品名称" width="160px" align="center">
                        <template scope="scope">{{scope.row.goodsName?scope.row.goodsName:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="商品价格" align="center">
                        <template scope="scope">{{scope.row.goodsPrice?formatMoney(scope.row.goodsPrice)+'元':'0.00元'}}</template>
                    </el-table-column>
                    <el-table-column label="商品图片" align="center">
                        <template scope="scope"><img :src="UPLOADURL + scope.row.goodsImgUrl" alt="" class="goods-img"></template>
                    </el-table-column>
                    <el-table-column label="商品状态" width="100px" align="center">
                        <template scope="scope">{{formatGoodsStatus(scope.row.goodsStatus)}}</template>
                    </el-table-column>
                    <el-table-column label="商品备注" align="center">
                        <template scope="scope">{{scope.row.goodsContent?scope.row.goodsContent:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="添加时间" width="180px" align="center">
                        <template scope="scope">{{moment(scope.row.goodsAddTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
                    </el-table-column>
                    <el-table-column label="店铺名称" width="200px" align="center">
                        <template scope="scope">{{scope.row.shopName?scope.row.shopName:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="操作" width="160px" align="center">
                        <template scope="scope">
                            <el-button size="small" type="primary" @click="putAwayGoods(scope.$index, scope.row)" v-if="scope.row.goodsStatus==='SOLD_OUT'">上架</el-button>
                            <el-button size="small" type="danger" @click="soldOutGoods(scope.$index, scope.row)" v-else>下架</el-button>
                        </template>
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
    goodsList,
    soldOutGoodsById,
    putAwayGoodsById,
    findGoodsById
} from '@/api/api'
export default {
    data: function() {
        return {
            searchContent: '',
            pageId: 1,
            pageSize: 10,
            counts: 0,
            goodsLists: null
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getGoodsLists();
    },
    methods: {
        //获取视频分类列表
        getGoodsLists: function() {
            goodsList({ params: { pageId: this.pageId, pageSize: this.pageSize, goodsNameLike: this.searchContent } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.goodsLists = data.list;
            })
        },
        //搜索
        searchGoodsById: function() {
            this.getGoodsLists();
        },
        //分页
        currentChange: function(val) {
            this.$router.push('?page=' + val)
            this.pageId = val;
            this.getGoodsLists()
        },
        formatGoodsStatus: function(status) {
            return status === 'PUTAWAY' ? '上架' : '下架';
        },
        putAwayGoods: function(index, row) {
            putAwayGoodsById(row).then(data => {
                this.getGoodsLists()
            })
            this.$confirm('是否上架该商品?', '上架商品', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                putAwayGoodsById(row).then(data => {
                    this.getGoodsLists()
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });
            });
        },
        soldOutGoods: function(index, row) {
            this.$confirm('是否下架该商品?', '下架商品', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                soldOutGoodsById(row).then(data => {
                    this.getGoodsLists()
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
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

    .goods-img{
        width: 120px;
    }
}
</style>