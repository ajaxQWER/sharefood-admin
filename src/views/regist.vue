<template>
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm regist-container">
        <h3 class="title">用户注册</h3>
        <el-form-item label="用户名" prop="account">
            <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="ruleForm2.pass" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="确认密码"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
            <el-button @click="resetForm('ruleForm2')">重置</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
import {
    userRegister
} from '@/api/api';
export default {
    data() {
        var checkCount = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('用户名不能为空'));
            } else {
                if (this.ruleForm2.account !== '') {
                    callback();
                }
            }
        };
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.ruleForm2.checkPass !== '') {
                    this.$refs.ruleForm2.validateField('checkPass');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm2.pass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            ruleForm2: {
                account: '',
                pass: '',
                checkPass: ''
            },
            rules2: {
                pass: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ],
                account: [
                    { validator: checkCount, trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var username = this.ruleForm2.account;
                    var secretkey = this.ruleForm2.pass;
                    userRegister({ username: username, secretkey: secretkey }).then(data => {
                        if(data){
                        	console.log(data);
                        	this.$router.push({
                                path: '/login'
                            });
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
}
</script>
<style scoped>
.regist-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 15% 0 0 60%;
    ;

    width: 290px;
    padding: 15px 35px;
    background: #fff;
    .title {
        font-size: 20px;
        margin: 10px auto;
        text-align: center;
        color: #363f44;
    }
    .remember {
        margin-bottom: 20px;
    }
    .copyright {
        font-size: 14px;
        color: #98a6ad;
        text-align: center;
    }
}
</style>