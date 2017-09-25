<template>
    <el-row class="lives-news">
        <el-col class="title">
            <h3>店铺管理</h3>
        </el-col>
        <el-col>
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="goToAddShop"><i class="el-icon-plus el-icon--left"></i>添加店铺</el-button>
                </el-form-item>
                <el-form-item>
                    <el-input placeholder="请输入店铺名称" icon="search" v-model="searchContent" :on-icon-click="searchShopById">
                    </el-input>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col>
            <el-table :data="shopList">
                <el-table-column label="名称" width="160px" align="center">
                    <template scope="scope">{{scope.row.name?scope.row.name:'-'}}</template>
                </el-table-column>
                <el-table-column label="地址" width="160px" align="center">
                    <template scope="scope">{{scope.row.address?scope.row.address:'-'}}</template>
                </el-table-column>
                <el-table-column label="营业时间" width="180px" align="center">
                    <template scope="scope">{{scope.row.beginTime?scope.row.beginTime:'00:00:00'}} - {{scope.row.endTime?scope.row.endTime:'00:00:00'}}</template>
                </el-table-column>
                <el-table-column label="联系电话" width="120px" align="center">
                    <template scope="scope">{{scope.row.number?scope.row.number:'-'}}</template>
                </el-table-column>
                <el-table-column label="销量" align="center">
                    <template scope="scope">{{scope.row.sales?scope.row.sales:'-'}}</template>
                </el-table-column>
                <el-table-column label="介绍" align="center">
                    <template scope="scope">{{scope.row.introduce?scope.row.introduce:'-'}}</template>
                </el-table-column>
                <el-table-column label="评分" align="center">
                    <template scope="scope">{{scope.row.score?scope.row.score:'-'}}</template>
                </el-table-column>
                <el-table-column label="轮播图" align="center">
                    <template scope="scope">{{scope.row.carousel?scope.row.carousel:'-'}}</template>
                </el-table-column>
                <el-table-column label="缩略图" align="center">
                    <template scope="scope">{{scope.row.image?scope.row.image:'-'}}</template>
                </el-table-column>
                <el-table-column label="距离" align="center">
                    <template scope="scope">{{scope.row.instance?scope.row.instance:'-'}}</template>
                </el-table-column>
                <el-table-column label="经度" align="center">
                    <template scope="scope">{{scope.row.longitude?scope.row.longitude:'-'}}</template>
                </el-table-column>
                <el-table-column label="纬度" align="center">
                    <template scope="scope">{{scope.row.latitude?scope.row.latitude:'-'}}</template>
                </el-table-column>
                <el-table-column label="操作" width="160px" align="center">
                    <template scope="scope">
                        <el-button size="small" @click="updateVideoCategory(scope.$index, scope.row)">修改</el-button>
                        <el-button size="small" type="danger" @click="deleteVideoCategory(scope.$index, scope.row)">删除</el-button>
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
    shopList,
    addShop,
    deleteShopById,
    updateShopById
} from '@/api/api'
export default {
    data: function() {
        return {
            addLoading: false,
            addDialog: false,
            searchContent: '',
            pageId: 1,
            pageSize: 10,
            counts: 0,
            isAdd: true,
            shopList: null
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getShopLists();
    },
    methods: {
        //获取视频分类列表
        getShopLists: function() {
            shopList({ params: { pageId: this.pageId, pageSize: this.pageSize, shopDetailNameLike: this.searchContent } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.shopList = data.list;
            })
        },
        //搜索
        searchShopById: function() {
            this.getShopLists();
        },
        goToAddShop: function(){
            this.$router.push('shopDetail')
        },
        //通过id修改分类的名称
        updateVideoCategory: function(index, row) {
            this.isAdd = false;
            this.addDialog = true;
            this.$router.push('/shopDetail?shopId='+row.shopId)
        },
        //通过id删除分类
        deleteVideoCategory: function(index, row) {
            this.$confirm('是否删除该分类?', '删除分类', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteShopById(row).then(() => {
                    this.getShopLists();
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
        },
        //分页
        currentChange: function(val) {
            this.$router.push('?page=' + val)
            this.pageId = val;
            this.getShopLists()
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
    .amap-demo {
        height: 500px;
    }

    .search-box {
        position: absolute;
        top: 25px;
        right: 20px;
    }

    .amap-page-container {
        position: relative;
    }
}
</style>