<template>
    <el-row class="lives-news">
        <el-col class="title">
            <h3>产品订单</h3>
        </el-col>
        <el-col>
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" icon="arrow-left" @click="back">返回上一级</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col>
            <el-table :data="certificateList">
                <el-table-column prop="certificateName" label="证书名" align="center"></el-table-column>
                <el-table-column prop="approve" label="是否认证" align="center">
                    <template scope="scope">
                        {{scope.row.approve?'是':'否'}}
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
    </el-row>
</template>
<script>
import {
    getCertificateList
} from '@/api/api'
export default {
    data: function() {
        return {
            params: {
                userId: 0
            },
            isFinish: false,
            pageId: 1,
            pageSize: 10,
            certificateList: null
        }
    },
    created: function() {
        this.pageId = parseInt(this.$route.query.page) || 1;
        var userId = parseInt(this.$route.query.userId);
        if (!userId) {
            this.$router.back()
        }
        this.params.userId = userId;
        this.getLists();
    },
    methods: {
        //获取视频列表
        getLists: function() {
            getCertificateList({params:{ userId: this.params.userId, pageId: this.pageId, pageSize: this.pageSize }}).then(data => {
                console.log(data)
                this.certificateList = data.list;
            })
        },
        back: function() {
            this.$router.back()
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