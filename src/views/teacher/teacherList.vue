<template>
    <el-row class="videoCategory">
        <el-col class="title">
            <h3>老师管理</h3>
        </el-col>
        <el-col>
            <el-col>
                <el-form :inline="true">
                    <el-form-item>
                        <el-button type="primary" @click="showAddTeacherDialog"><i class="el-icon-plus el-icon--left"></i>添加老师</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="importTeacher"><i class="el-icon-plus el-icon--left"></i>批量导入老师</el-button>
                    </el-form-item>
                    <el-form-item>
                        <a :href="BASEURL+'/admin/certificate/export?token='+jwt">
                            <el-button type="primary">证书导出</el-button>
                        </a>
                    </el-form-item>
                    <el-form-item>
                        <el-upload ref="importCertificate" class="upload-demo" :headers="uploadHeader" :action="BASEURL+'/admin/certificate/import'" :show-file-list="false" :on-progress="handleCertificateImport" :on-success="handleCertificateImportSuccess" :on-error="handleCertificateImportError">
                            <el-button type="primary" :loading="isOnCertificateProgress">证书导入</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item>
                    <el-input placeholder="请输入老师名称" icon="search" v-model="searchContent" :on-icon-click="searchTeacherByName">
                    </el-input>
                </el-form-item>
                </el-form>
            </el-col>
            <el-col>
                <el-table :data="teacherLists">
                    <el-table-column type="expand">
                        <template scope="scope">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="用户名">
                                    <span class="label-color">{{ scope.row.user.username }}</span>
                                </el-form-item>
                                <el-form-item label="姓名">
                                    <span class="label-color">{{ scope.row.base.name }}</span>
                                </el-form-item>
                                <el-form-item label="类型">
                                    <span class="label-color">{{ scope.row.base.teacherType }}</span>
                                </el-form-item>
                                <el-form-item label="化名">
                                    <span class="label-color">{{ scope.row.base.aliasName }}</span>
                                </el-form-item>
                                <el-form-item label="学历">
                                    <span class="label-color">{{ scope.row.base.educationalBackgroundValue }}</span>
                                </el-form-item>
                                <el-form-item label="从业时间">
                                    <span class="label-color">{{ formatDate(scope.row.base.jobTime) }}</span>
                                </el-form-item>
                                <el-form-item label="使用化名">
                                    <span class="label-color">{{ scope.row.certification.alias?'是':'否' }}</span>
                                </el-form-item>
                                <el-form-item label="证书认证">
                                    <span class="label-color">{{ scope.row.certification.certificate ?'是':'否' }}</span>
                                </el-form-item>
                                <el-form-item label="个人定制">
                                    <span class="label-color">{{ scope.row.certification.customization?'是':'否' }}</span>
                                </el-form-item>
                                <el-form-item label="学历认证">
                                    <span class="label-color">{{ scope.row.certification.educationalBackground?'是':'否' }}</span>
                                </el-form-item>
                                <el-form-item label="上线展示中">
                                    <span class="label-color">{{ scope.row.certification.onlineDisplay?'是':'否' }}</span>
                                </el-form-item>
                                <el-form-item label="实名认证">
                                    <span class="label-color">{{ scope.row.certification.realName?'是':'否' }}</span>
                                </el-form-item>
                                <el-form-item label="推荐">
                                    <span class="label-color">{{ scope.row.certification.recommend?'是':'否' }}</span>
                                </el-form-item>
                                <el-form-item label="关注人数">
                                    <span class="label-color">{{ scope.row.extend.attentionNumber }}</span>
                                </el-form-item>
                                <el-form-item label="投稿次数">
                                    <span class="label-color">{{ scope.row.extend.contributeNumber }}</span>
                                </el-form-item>
                                <el-form-item label="打赏金额">
                                    <span class="label-color">{{ scope.row.extend.exceptionalMoney }}</span>
                                </el-form-item>
                                <el-form-item label="打赏人数">
                                    <span class="label-color">{{ scope.row.extend.exceptionalNumber }}</span>
                                </el-form-item>
                                <el-form-item label="人气">
                                    <span class="label-color">{{ scope.row.extend.sentiment }}</span>
                                </el-form-item>
                                <el-form-item label="上期正确率">
                                    <span class="label-color">{{ scope.row.correct1 }}</span>
                                </el-form-item>
                                <el-form-item label="平均正确率">
                                    <span class="label-color">{{ scope.row.correct5 }}</span>
                                </el-form-item>
                                <el-form-item label="年龄">
                                    <span class="label-color">{{ scope.row.user.age }}</span>
                                </el-form-item>
                                <el-form-item label="邮箱">
                                    <span class="label-color">{{ scope.row.user.email }}</span>
                                </el-form-item>
                                <el-form-item label="性别">
                                    <span class="label-color">{{ scope.row.user.gender=='UNKNOW' ?'未知':scope.row.user.gender== 'MALE'?'男':'女' }}</span>
                                </el-form-item>
                                <el-form-item label="电话">
                                    <span class="label-color">{{ scope.row.user.phone }}</span>
                                </el-form-item>
                                <el-form-item label="自我介绍">
                                    <span class="label-color">{{ scope.row.base.introduce }}</span>
                                </el-form-item>
                                <el-form-item label="本期研究板块">
                                    <span class="label-color">{{ scope.row.extend.nowContent }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column prop="user.username" label="用户名" align="center"></el-table-column>
                    <el-table-column prop="base.name" label="姓名" align="center"></el-table-column>
                    <el-table-column prop="base.aliasName" label="化名" align="center"></el-table-column>
                    <el-table-column width="180px" prop="base.teacherType" label="老师类型" align="center"></el-table-column>
                    <el-table-column label="操作" width="200px" align="center">
                        <template scope="scope">
                            <el-button size="small" @click="handleUpdateTeacher(scope.$index, scope.row)">修改</el-button>
                            <el-button size="small" type="primary" @click="showCertificate(scope.$index, scope.row)">查看证书</el-button>
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
        <!-- 修改banner -->
        <el-dialog title="修改老师信息" :visible.sync="addTeacherDialog" size="tiny" @close="closeAddViodeDialog" class="dialog">
            <el-form :model="teacherObj" label-width="100px" ref="newTeacher">
                <el-form-item label="姓名">
                    <el-input v-model="teacherObj.base.name" auto-complete="off" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="teacherObj.base.teacherType" placeholder="请选择">
                        <el-option v-for="(item,index) in teacherType" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="化名">
                    <el-input v-model="teacherObj.base.aliasName" auto-complete="off" placeholder="化名"></el-input>
                </el-form-item>
                <el-form-item label="学历">
                    <el-input v-model="teacherObj.base.educationalBackgroundValue" auto-complete="off" placeholder="学历"></el-input>
                </el-form-item>
                <el-form-item label="从业时间">
                    <el-date-picker v-model="teacherObj.base.jobTime" type="date" placeholder="选择从业时间" @change="setJobTime">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="介绍">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="介绍" v-model="teacherObj.base.introduce">
                    </el-input>
                </el-form-item>
                <el-form-item label="个人定制">
                    <el-switch v-model="teacherObj.certification.customization" on-text="是" off-text="否">
                    </el-switch>
                </el-form-item>
                <el-form-item label="学历认证">
                    <el-switch v-model="teacherObj.certification.educationalBackground" on-text="是" off-text="否">
                    </el-switch>
                </el-form-item>
                <el-form-item label="上线展示">
                    <el-switch v-model="teacherObj.certification.onlineDisplay" on-text="是" off-text="否">
                    </el-switch>
                </el-form-item>
                <el-form-item label="实名认证">
                    <el-switch v-model="teacherObj.certification.realName" on-text="是" off-text="否">
                    </el-switch>
                </el-form-item>
                <el-form-item label="推荐">
                    <el-switch v-model="teacherObj.certification.recommend" on-text="是" off-text="否">
                    </el-switch>
                </el-form-item>
                <el-form-item label="关注人数">
                    <el-input v-model.number="teacherObj.extend.attentionNumber" auto-complete="off" placeholder="关注人数"></el-input>
                </el-form-item>
                <el-form-item label="投稿次数">
                    <el-input v-model.number="teacherObj.extend.contributeNumber" auto-complete="off" placeholder="投稿次数"></el-input>
                </el-form-item>
                <el-form-item label="打赏金额">
                    <el-input v-model.number="teacherObj.extend.exceptionalMoney" auto-complete="off" placeholder="打赏金额"></el-input>
                </el-form-item>
                <el-form-item label="打赏人数">
                    <el-input v-model.number="teacherObj.extend.exceptionalNumber" auto-complete="off" placeholder="打赏人数"></el-input>
                </el-form-item>
                <el-form-item label="人气">
                    <el-input v-model.number="teacherObj.extend.sentiment" auto-complete="off" placeholder="人气"></el-input>
                </el-form-item>
                <el-form-item label="本期研究板块">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="本期研究板块" v-model="teacherObj.extend.nowContent"></el-input>
                </el-form-item>
                <el-form-item label="上期正确率">
                    <el-input v-model="teacherObj.correct1" auto-complete="off" placeholder="上期正确率"></el-input>
                </el-form-item>
                <el-form-item label="平均正确率">
                    <el-input v-model="teacherObj.correct5" auto-complete="off" placeholder="平均正确率"></el-input>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input v-model="teacherObj.user.age" auto-complete="off" placeholder="年龄"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="teacherObj.user.email" auto-complete="off" placeholder="邮箱"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="teacherObj.user.gender">
                        <el-radio label="UNKNOW">未知</el-radio>
                        <el-radio label="MALE">男</el-radio>
                        <el-radio label="FEMALE">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="teacherObj.user.phone" auto-complete="off" placeholder="电话"></el-input>
                </el-form-item>
                <el-form-item label="上传头像">
                    <el-upload class="avatar-uploader" :headers="uploadHeader" :action="BASEURL+'/admin/user/'+teacherObj.userId+'/avator'" :show-file-list="false" :on-success="handleAvatarSuccess">
                        <img v-if="avatorSuccess" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelUpdateTeacher">取 消</el-button>
                <el-button type="primary" @click="updateTeacher">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="批量导入老师" :visible.sync="importDialog" size="tiny" @close="closeImportDialog" class="dialog">
            <el-form ref="importTeacher">
                <el-form-item label="第一步：选择老师类型">
                    <el-select v-model="importTeacherType" placeholder="请选择">
                        <el-option v-for="(item,index) in teacherType" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="第二步：下载导入模板">
                    <a :href="BASEURL+'/admin/teacher/export/'+importTeacherType+'?token='+jwt">
                        <el-button type="primary">下载导入模板</el-button>
                    </a>
                </el-form-item>
                <el-form-item label="第三步：开始导入老师">
                    <el-upload ref="teacherImport" class="upload-demo" :headers="uploadHeader" :action="BASEURL+'/admin/teacher/import'" :show-file-list="false" :on-progress="handleOnProgress" :on-success="handleImportSuccess" :on-error="handleImportError">
                        <el-button type="primary" :loading="isOnProgress">批量导入老师</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="新增老师" :visible.sync="isNewTeacher" size="tiny" @close="closeAddViodeDialog" class="dialog">
            <el-form :model="newTeacherObj" label-width="100px" ref="newTeacher">
                <el-form-item label="用户名">
                    <el-input v-model="newTeacherObj.username" auto-complete="off" placeholder="用户名作为登录账号"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="newTeacherObj.secretkey" auto-complete="off" placeholder="用户登录密码"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="newTeacherObj.name" auto-complete="off" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="newTeacherObj.teacherType" placeholder="请选择">
                        <el-option v-for="(item,index) in teacherType" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAddTeacher">取 消</el-button>
                <el-button type="primary" @click="updateTeacher">确 定</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>
<script>
import {
    getTeacherLists,
    addTeacher,
    deleteTeacherById,
    getTeacherById,
    updateTeacherById
} from '@/api/api'
export default {
    data: function() {
        return {
            teacherObj: {
                userId: '',
                base: {
                    avator: '',
                    aliasName: '',
                    educationalBackgroundValue: '',
                    introduce: '',
                    jobTime: '',
                    name: '',
                    teacherType: ''
                },
                certification: {
                    customization: '',
                    educationalBackground: '',
                    onlineDisplay: '',
                    realName: '',
                    recommend: ''
                },
                correct1: '',
                correct5: '',
                extend: {
                    attentionNumber: 0,
                    contributeNumber: 0,
                    exceptionalMoney: 0,
                    exceptionalNumber: 0,
                    nowContent: '',
                    sentiment: ''
                },
                user: {
                    age: '',
                    email: '',
                    gender: '',
                    phone: ''
                }
            },
            teacherType: ['初级实战研究师', '中级实战研究师', '高级实战研究师'],
            newTeacherObj: {
                name: "",
                secretkey: "",
                teacherType: "",
                username: ""
            },
            isAdd: true,
            isUpdate: false,
            searchContent: '',
            pageId: 1,
            pageSize: 10,
            counts: 0,
            addTeacherDialog: false,
            teacherLists: null,
            rowIndex: 0,
            importTeacherType: '',
            jwt: sessionStorage.getItem('jwt'),
            importDialog: false,
            isOnProgress: false,
            isNewTeacher: false,
            uploadHeader: {
                token: sessionStorage.getItem('jwt')
            },
            avatorSuccess: false,
            imageUrl: '',
            isOnCertificateProgress: false
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getLists();
    },
    methods: {
        //获取老师列表
        getLists: function() {
            getTeacherLists({ params: { pageId: this.pageId, pageSize: this.pageSize, nameLike: this.searchContent } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.teacherLists = data.list;
            })
        },
        //点击添加老师按钮
        showAddTeacherDialog: function() {
            // this.addTeacherDialog = true;
            this.isNewTeacher = true;
            this.isAdd = true;
            this.isUpdate = false;
        },
        //关闭弹窗层
        closeAddViodeDialog: function() {
            this.teacherObj = {
                userId: '',
                base: {
                    avator: '',
                    aliasName: '',
                    educationalBackgroundValue: '',
                    introduce: '',
                    jobTime: '',
                    name: '',
                    teacherType: ''
                },
                certification: {
                    customization: '',
                    educationalBackground: '',
                    onlineDisplay: '',
                    realName: '',
                    recommend: ''
                },
                correct1: '',
                correct5: '',
                extend: {
                    attentionNumber: 0,
                    contributeNumber: 0,
                    exceptionalMoney: 0,
                    exceptionalNumber: 0,
                    nowContent: '',
                    sentiment: ''
                },
                user: {
                    age: '',
                    email: '',
                    gender: '',
                    phone: ''
                }
            }
        },
        //取消添加老师
        cancelAddTeacher: function() {
            this.addTeacherDialog = false;
        },
        cancelAddTeacher: function(){
        	this.isNewTeacher = false;
        },
        //修改老师
        handleUpdateTeacher: function(index, row) {
            this.isAdd = false;
            this.isUpdate = true;
            this.isNewTeacher = false;
            this.addTeacherDialog = true;
            this.avatorSuccess = row.base.avator ? true : false;
            this.imageUrl = this.avatorSuccess ? this.DOWNLOADURL + row.base.avator : '';
            this.rowIndex = index;
            this.teacherObj = {
                userId: row.userId,
                base: {
                    avator: row.base.avator,
                    aliasName: row.base.aliasName,
                    educationalBackgroundValue: row.base.educationalBackgroundValue,
                    introduce: row.base.introduce,
                    jobTime: row.base.jobTime,
                    name: row.base.name,
                    teacherType: row.base.teacherType
                },
                certification: {
                    customization: row.certification.customization,
                    educationalBackground: row.certification.educationalBackground,
                    onlineDisplay: row.certification.onlineDisplay,
                    realName: row.certification.realName,
                    recommend: row.certification.recommend
                },
                correct1: row.correct1,
                correct5: row.correct5,
                extend: {
                    attentionNumber: row.extend.attentionNumber,
                    contributeNumber: row.extend.contributeNumber,
                    exceptionalMoney: row.extend.exceptionalMoney,
                    exceptionalNumber: row.extend.exceptionalNumber,
                    nowContent: row.extend.nowContent,
                    sentiment: row.extend.sentiment
                },
                user: {
                    age: row.user.age,
                    email: row.user.email,
                    gender: row.user.gender,
                    phone: row.user.phone
                }
            }
        },
        //点击确定修改老师
        updateTeacher: function() {
            if (this.isAdd) {
                addTeacher(this.newTeacherObj).then(() => {
                    this.$message({
                        type: 'success',
                        message: '添加成功!'
                    });
                    this.getLists();
                    this.addTeacherDialog = false;
                    this.isUpdate = true;
                    this.isNewTeacher = false;
                })
            } else {
                updateTeacherById(this.teacherObj).then(data => {
                    console.log(data)
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    this.getLists();
                    // this.$set(this.teacherLists, this.rowIndex, data)
                    this.isAdd = true;
                    this.isUpdate = false;
                    this.addTeacherDialog = false;
                })
            }
        },
        //取消修改
        cancelUpdateTeacher: function() {
            this.addTeacherDialog = false;
        },
        //删除老师
        handleDeleteTeacher: function(index, teacher) {
            this.$confirm('是否删除该老师?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteTeacherById(teacher).then(data => {
                    // if (this.teacherLists.length <= this.pageSize && this.counts <= this.pageSize) {
                    //     this.teacherLists.splice(index, 1);
                    //     this.counts -= 1;
                    // } else {
                    //     this.getLists();
                    // }
                    this.getLists();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                })
            })
        },
        //分页
        currentChange: function(val) {
            this.$router.push('?page=' + val)
            this.pageId = val;
            this.getLists()
        },
        formatDate: function(date) {
            return this.moment(date).format('YYYY-MM-DD')
        },
        importTeacher: function() {
            this.importDialog = true;
        },
        closeImportDialog: function() {
            this.$refs.teacherImport.clearFiles();
        },
        handleImportSuccess: function(res) {
            if (!res.status) {
                this.$message({
                    message: res.message,
                    type: 'error'
                })
            } else {
                this.$message({
                    message: '导入成功',
                    type: 'success'
                })
            }
            this.getLists()
            this.importDialog = false;
            this.isOnProgress = false;
        },
        handleImportError: function() {
            this.importDialog = false;
            this.$message({
                message: '导入失败',
                type: 'success'
            })
            this.isOnProgress = false;
        },
        handleOnProgress: function() {
            this.isOnProgress = true;
        },
        setJobTime: function(val) {
            this.teacherObj.base.jobTime = val;
        },
        handleCertificateImport: function(res) {
            this.isOnCertificateProgress = true;
        },
        handleCertificateImportSuccess: function(res) {
            this.getLists()
            if (!res.status) {
                this.$message({
                    message: res.message,
                    type: 'error'
                })
            } else {
                this.$message({
                    message: '导入成功',
                    type: 'success'
                })
            }
            this.isOnCertificateProgress = false;
        },
        handleCertificateImportError: function() {
            this.$message({
                message: '导入失败',
                type: 'success'
            })
            this.isOnCertificateProgress = false;
        },
        showCertificate: function(index, row) {
            this.$router.push('/certificate?userId=' + row.userId)
        },
        handleAvatarSuccess: function(res, file) {
            if(res.status){
            	this.$message({
                    message: '头像上次成功',
                    type: 'success'
                })
                this.avatorSuccess = true;
                this.teacherObj.base.avator = res.data.avatorUrl;
                this.imageUrl = URL.createObjectURL(file.raw)
            }else{
            	this.$message({
                    message: res.message,
                    type: 'error'
                })
                this.avatorSuccess = false;
            }
        },
        searchTeacherByName: function(){
            this.getLists();
        }
    }
}
</script>
<style scoped lang="scss">
.videoCategory {
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
    .select {
        width: 100%;
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
        width: 33%;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }
    .avatar-uploader-icon {
        border: 1px dashed #d9d9d9;
        font-size: 28px;
        color: #8c939d;
        width: 75px;
        height: 75px;
        line-height: 75px;
        text-align: center;
        vertical-align: middle;
    }
    .avatar {
        width: 75px;
        height: 75px;
        display: block;
    }
}
</style>