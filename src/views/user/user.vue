<template>
    <el-row class="videoCategory">
        <el-col class="title">
            <h3>用户管理</h3>
        </el-col>
        <el-col>
            <el-table :data="userList">
                <el-table-column type="expand">
                    <template scope="scope">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item v-for="(item,index) of userDetailList" :label="item.label" :key="index">
                                <span class="label-color">{{formatUserInfo(scope.row,item.key)}}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                <el-table-column label="用户类型" align="center">
                    <template scope="scope">
                        {{formatUserType(scope.row.userType)}}
                    </template>
                </el-table-column>
                <el-table-column prop="balance" label="余额" align="center"></el-table-column>
                <el-table-column prop="phone" width="120px" label="电话号码" align="center"></el-table-column>
                <el-table-column label="操作" width="280px" align="center">
                    <template scope="scope">
                        <el-button size="small" @click="handleUpdateUserInfo(scope.$index, scope.row)">修改信息</el-button>
                        <el-button size="small" type="primary" @click="handleUpdateUserPwd(scope.$index, scope.row)">修改密码</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
        <!-- 分页 -->
        <el-col class="pagination">
            <el-pagination @current-change="currentChange" :current-page="pageId" :page-size="pageSize" layout="total, prev, pager, next" :total="counts">
            </el-pagination>
        </el-col>
        <!-- 修改banner -->
        <el-dialog title="修改用户信息" :visible.sync="dialog" size="tiny" @close="closeDialog" class="dialog">
            <el-form :model="userObj" label-width="100px" ref="userObj">
                <el-form-item label="用户名">
                    <el-input v-model="userObj.username" auto-complete="off" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="userObj.phone" auto-complete="off" placeholder="电话"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="userObj.email" auto-complete="off" placeholder="邮箱"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="userObj.gender">
                        <el-radio label="UNKNOW">未知</el-radio>
                        <el-radio label="MALE">男</el-radio>
                        <el-radio label="FEMALE">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input v-model="userObj.age" auto-complete="off" placeholder="年龄"></el-input>
                </el-form-item>
            </el-form>
            <div>
                <img src="" alt="" class="banner-thumb">
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="updateUserInfo">确 定</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>
<script>
import {
    getUserLists,
    getUserById,
    updateUserInfoById,
    updateUserPwdById,
    uploadFiles
} from '@/api/api'
export default {
    data: function() {
        return {
            userObj: {
                userId: '',
                username: '',
                phone: '',
                email: '',
                gender: '',
                age: ''
            },
            userDetailList: [{
                label: '用户名',
                key: 'username'
            }, {
                label: '年龄',
                key: 'age'
            }, {
                label: '余额',
                key: 'balance'
            }, {
                label: '电话',
                key: 'phone'
            }, {
                label: '累计消费',
                key: 'consumption'
            }, {
                label: '用户类型',
                key: 'userType'
            }, {
                label: '邮箱',
                key: 'email'
            }, {
                label: '性别',
                key: 'gender'
            }, {
                label: '专属邀请码',
                key: 'exclusiveInviteCode'
            }, {
                label: '邀请码',
                key: 'inviteCode'
            }, {
                label: '上次登录时间',
                key: 'lastLoginTime'
            }, {
                label: '注册时间',
                key: 'registrationTime'
            }],
            isAdd: true,
            searchContent: '',
            pageId: 1,
            pageSize: 10,
            counts: 0,
            dialog: false,
            rowIndex: 0,
            userList: null
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        this.getLists();
    },
    methods: {
        //获取视频列表
        getLists: function() {
            getUserLists({ params: { pageId: this.pageId, pageSize: this.pageSize } }).then(data => {
                console.log(data)
                this.counts = data.count;
                this.userList = data.list;
            })
        },
        formatUserInfo: function(item, key) {
            switch (key) {
                case 'userType':
                    return item[key] == 'USER' ? '用户' : '老师'
                    break;
                case 'lastLoginTime':
                case 'registrationTime':
                    return this.formatDate(item[key])
                    break;
                case 'gender':
                    return item[key] == 'UNKNOW' ? '未知' : (item[key] == 'MALE' ? "男" : "女")
                    break;
                default:
                    return item[key];
                    break;
            }
        },
        //点击添加视频按钮
        showDialog: function() {
            this.dialog = true;
        },
        //关闭弹窗层
        closeDialog: function() {
            this.userObj = {
                userId: '',
                username: '',
                phone: '',
                email: '',
                gender: '',
                age: '',
                avatorUrl: ''
            }
        },
        //取消添加视频
        cancel: function() {
            this.dialog = false;
        },
        //添加banner
        updateUserInfo: function() {
            updateUserInfoById(this.userObj).then(data => {
                console.log(data)
                this.$message({
                    message: '修改成功',
                    type: 'success'
                })
                this.getLists()
                this.dialog = false;
            })
        },
        //修改banner
        handleUpdateUserInfo: function(index, row) {
            this.dialog = true;
            this.userObj = {
                userId: row.userId,
                username: row.username,
                phone: row.phone,
                email: row.email,
                gender: row.gender,
                age: row.age
            }
        },
        handleUpdateUserPwd: function(index, row) {
            this.$prompt('请输入新密码', '修改密码', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                var params = {
                    userId: row.userId,
                    secretkey: value
                }
                updateUserPwdById(params).then(data => {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    })
                })
            }).catch(() => {})
        },
        formatUserType: function(type){
            switch (type) {
                case 'USER':
                    return '用户'
                    break;
                case 'TEACHER':
                    return '老师'
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
        },
        formatDate: function(date) {
            return this.moment(date).format('YYYY-MM-DD HH:mm:ss');
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