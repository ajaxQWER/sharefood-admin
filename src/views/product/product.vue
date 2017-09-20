<template>
    <el-row class="lives-news">
        <el-col class="title">
            <h3>产品管理</h3>
        </el-col>
        <el-col>
            <el-col>
                <el-form :inline="true">
                    <el-form-item>
                        <el-button type="primary" @click="showAddProductDialog"><i class="el-icon-plus el-icon--left"></i>添加产品</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-input placeholder="请输入产品名称" icon="search" v-model="searchContent" :on-icon-click="searchProductByName">
                        </el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col>
                <el-table :data="productData">
                    <el-table-column type="expand">
                        <template scope="scope">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="老师名称">
                                    <span class="label-color">{{ scope.row.teacherName }}</span>
                                </el-form-item>
                                <el-form-item label="标题">
                                    <span class="label-color">{{ scope.row.title }}</span>
                                </el-form-item>
                                <el-form-item label="提纲">
                                    <span class="label-color">{{ scope.row.outline }}</span>
                                </el-form-item>
                                <el-form-item label="产品类型">
                                    <span class="label-color">{{ scope.row.type }}</span>
                                </el-form-item>
                                <el-form-item label="是否免费">
                                    <span class="label-color">{{ scope.row.free?'是':'否' }}</span>
                                </el-form-item>
                                <el-form-item label="创建时间">
                                    <span class="label-color">{{ moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
                                </el-form-item>
                                <el-form-item label="免费时间">
                                    <span class="label-color">{{ moment(scope.row.freeTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
                                </el-form-item>
                                <el-form-item label="下载量">
                                    <span class="label-color">{{ scope.row.downloadNumber }}</span>
                                </el-form-item>
                                <el-form-item label="是否展示">
                                    <span class="label-color">{{ scope.row.show?'是':'否' }}</span>
                                </el-form-item>
                                <el-form-item label="是否精华">
                                    <span class="label-color">{{ scope.row.quintessence?'是':'否' }}</span>
                                </el-form-item>
                                <el-form-item label="单价">
                                    <span class="label-color">{{ scope.row.unitPrice }}</span>
                                </el-form-item>
                                <el-form-item label="促销价">
                                    <span class="label-color">{{ scope.row.promotionsPrice }}</span>
                                </el-form-item>
                                <el-form-item label="封面地址" v-show="showCoverUrl(scope.row.type)">
                                    <span class="label-color">{{ scope.row.coverUrl }}</span>
                                </el-form-item>
                                <el-form-item label="下载产品">
                                    <span class="label-color"><a :href="DOWNLOADURL+scope.row.downloadUrl" download="download"><el-button type="primary" size="small">下载</el-button></a></span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column prop="title" label="标题" align="center"></el-table-column>
                    <el-table-column prop="type" label="产品类型" align="center"></el-table-column>
                    <el-table-column prop="teacherName" label="老师名称" align="center"></el-table-column>
                    <el-table-column prop="free" label="是否免费" align="center">
                        <template scope="scope">
                            {{scope.row.free? '是':'否'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="200px">
                        <template scope="scope">
                            <el-button size="small" @click="handleUpdateProduct(scope.$index, scope.row)">修改</el-button>
                            <a :href="DOWNLOADURL+scope.row.downloadUrl" download="download">
                                <el-button type="primary" size="small">下载</el-button>
                            </a>
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
        <el-dialog :title="isAdd?'新增产品':'修改产品'" :visible.sync="productDialog" size="tiny" @close="closeProductDialog" class="dialog">
            <el-form :model="productObj" label-width="100px" ref="newProduct">
                <el-form-item label="选择老师">
                    <el-select v-model.number="productObj.teacherId" filterable placeholder="请选择">
                        <el-option v-for="item in teacherList" :key="item.userId" :label="item.base.name" :value="item.userId">
                        </el-option>
                    </el-select>
                    <!-- <el-autocomplete
                      class="inline-input"
                      v-model="productObj.teacherName"
                      :fetch-suggestions="querySearch"
                      placeholder="请输入内容"
                      @select="handleSelect"
                    ></el-autocomplete> -->
                </el-form-item>
                <el-form-item label="产品标题">
                    <el-input v-model="productObj.title" auto-complete="off" placeholder="产品标题"></el-input>
                </el-form-item>
                <el-form-item label="类型" v-show="isAdd">
                    <el-select v-model="productObj.type" placeholder="请选择">
                        <el-option v-for="item in productType" :key="item.value" :label="item.value" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="封面" v-show="showCoverUrl(productObj.type)">
                    <el-input v-model="productObj.coverUrl" auto-complete="off" placeholder="封面" :readonly="true"></el-input>
                    <el-upload class="" ref="coverUrl" action="" :http-request="uploadCoverUrl" :show-file-list="false">
                        <el-button size="small" type="primary">点击上传封面</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker
                          v-model="productObj.createTime"
                          type="date"
                          placeholder="选择日期"
                          @change="setCreateTime">
                        </el-date-picker>
                </el-form-item>
                <el-form-item label="提纲">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="productObj.outline" placeholder="提纲"></el-input>
                </el-form-item>
                <el-form-item label="下载量">
                    <el-input v-model="productObj.downloadNumber" auto-complete="off" placeholder="下载量"></el-input>
                </el-form-item>
                <el-form-item label="下载地址">
                    <el-input v-model="productObj.downloadUrl" auto-complete="off" placeholder="下载地址" :readonly="true"></el-input>
                    <el-upload class="upload-demo" ref="downloadUrl" action="" :http-request="uploadsProduct" :show-file-list="false">
                        <el-button size="small" type="primary" :loading="uploadLoading">点击上传产品</el-button>
                    </el-upload>
                    </el-col>
                </el-form-item>
                <el-form-item label="原价">
                    <el-input v-model.number="productObj.unitPrice" auto-complete="off" placeholder="原价"></el-input>
                </el-form-item>
                <el-form-item label="促销价">
                    <el-input v-model.number="productObj.promotionsPrice" auto-complete="off" placeholder="促销价"></el-input>
                </el-form-item>
                <el-form-item label="是否精华">
                    <el-switch v-model="productObj.quintessence" on-text="是" off-text="否">
                    </el-switch>
                </el-form-item>
                <el-form-item label="是否展示">
                    <el-switch v-model="productObj.show" on-text="是" off-text="否">
                    </el-switch>
                </el-form-item>
                <el-form-item label="是否免费">
                    <el-switch v-model="productObj.free" on-text="是" off-text="否">
                    </el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <div v-if="isAdd">
                    <el-button @click="closeProductDialog">取 消</el-button>
                    <el-button type="primary" @click="handleAddProduct">确 定</el-button>
                </div>
                <div v-else>
                    <el-button @click="closeProductDialog">取 消</el-button>
                    <el-button type="primary" @click="updateProduct">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </el-row>
</template>
<script>
import {
    getProductLists,
    addProduct,
    deleteProductById,
    getProductById,
    updateProductById,
    uploadFiles,
    getTeacherLists
} from '@/api/api'
export default {
    data: function() {
        return {
            productObj: {
                correct: 0,
                productId: 0,
                coverUrl: '',
                createTime: '',
                downloadNumber: 0,
                downloadUrl: '',
                outline: '',
                unitPrice: 0,
                promotionsPrice: 0,
                quintessence: false,
                show: false,
                free: false,
                teacherId: '',
                teacherName: '',
                title: '',
                type: ''
            },
            productType: [{
                value: 'A1'
            }, {
                value: 'A2'
            }, {
                value: 'A3'
            }, {
                value: 'B1'
            }, {
                value: 'B2'
            }, {
                value: 'B3'
            }],
            searchContent: '',
            productData: null,
            teacherList: [],
            pageId: 1,
            pageSize: 10,
            counts: 0,
            rowIndex: 0,
            isAdd: true,
            uploadLoading: false,
            productDialog: false
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getLists();
        this.getTeacherInfo();
    },
    methods: {
        //获取视频列表
        getLists: function() {
            getProductLists({ params: { pageId: this.pageId, pageSize: this.pageSize, titleLike: this.searchContent } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.productData = data.list;
            })
        },
        //B类产品显示封面
        showCoverUrl: function(type) {
            if (!type) {
                return false;
            }
            switch (type.toLocaleLowerCase()) {
                case 'b':
                case 'b1':
                case 'b2':
                case 'b3':
                    return true;
                    break;
                default:
                    break;
            }
        },
        getTeacherInfo: function() {
            getTeacherLists({params:{pageSize: 9999}}).then(data => {
                // console.log(data)
                this.teacherList = data.list;
            })
        },
        //显示添加产品弹层
        showAddProductDialog: function() {
            this.productDialog = true;
        },
        //关闭弹窗层
        closeProductDialog: function() {
            // this.$refs.newProduct.resetFields();
            this.productDialog = false;
            this.isAdd = true;
            this.$refs.coverUrl.clearFiles(); //清空上传文件列表
            this.$refs.downloadUrl.clearFiles(); //清空上传文件列表
            this.productObj = {
                productId: 0,
                correct: 0,
                coverUrl: '',
                createTime: '',
                downloadNumber: 0,
                downloadUrl: '',
                outline: '',
                unitPrice: 0,
                promotionsPrice: 0,
                quintessence: false,
                show: false,
                free: false,
                teacherId: '',
                teacherName: '',
                title: '',
                type: ''
            }
        },
        //添加产品
        handleAddProduct: function() {
            addProduct(this.productObj).then(data => {
                this.getLists(); //用重新请求代替push操作，后面再改
                this.$message({
                    type: 'success',
                    message: '添加成功'
                })
                this.productDialog = false;
            })
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
            this.getTeacherInfo();
            this.isAdd = false;
            this.productDialog = true;
            this.rowIndex = index;
            this.productObj = {
                productId: row.productId,
                coverUrl: row.coverUrl,
                createTime: row.createTime,
                downloadNumber: row.downloadNumber,
                downloadUrl: row.downloadUrl,
                outline: row.outline,
                unitPrice: row.unitPrice,
                promotionsPrice: row.promotionsPrice,
                quintessence: row.quintessence,
                show: row.show,
                free: row.free,
                teacherId: row.teacherId,
                teacherName: row.teacherName,
                title: row.title,
                type: row.type
            }
        },
        //点击确定修改产品
        updateProduct: function() {
            updateProductById(this.productObj).then(data => {
                console.log(data)
                this.getLists();
                // this.$set(this.productData, this.rowIndex, data);
                this.$message({
                    message: '修改产品信息成功',
                    type: 'success'
                })
                this.productDialog = false;
            })
        },
        //上传产品
        uploadsProduct: function() {
            var file = this.$refs.downloadUrl.uploadFiles[0].raw;
            var fd = new FormData();
            fd.append('file', file);
            fd.path = '/product';
            this.uploadLoading = true;
            uploadFiles(fd).then(data => {
                console.log(data)
                this.$message({
                    message: '上传产品文件成功',
                    type: 'success'
                })
                this.uploadLoading = false;
                this.productObj.downloadUrl = data.originalUrl
            })
        },
        //上传产品封面
        uploadCoverUrl: function() {
            var file = this.$refs.coverUrl.uploadFiles[0].raw;
            var fd = new FormData();
            fd.append('file', file);
            fd.path = '/coverUrl';
            uploadFiles(fd).then(data => {
                console.log(data)
                this.$message({
                    message: ' 上传产品封面成功',
                    type: 'success'
                })
                this.productObj.coverUrl = data.originalUrl
            })
        },
        setCreateTime: function(val) {
            this.productObj.createTime = val;
        },
        //分页
        currentChange: function(val) {
            this.$router.push('?page=' + val)
            this.pageId = val;
            this.getLists()
        },
        searchProductByName: function(){
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