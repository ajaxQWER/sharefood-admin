<template>
    <div>
        <el-row>
            <el-col>
                <el-upload class="upload-demo" ref="upload" action="" :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    data: function() {
        return {

        }
    },
    methods: {
        submitUpload: function() {
            console.log(this.$refs.upload.uploadFiles)
            var file = this.$refs.upload.uploadFiles[0].raw;
            var fd = new FormData();
            fd.append('file', file);
            fd.path = '/ups';
            uploadFiles(fd).then(data => {
                console.log(data)
            }).catch(err => {
                console.log(err)
            })
        }
    }
}
</script>
<style scoped lang="scss">
</style>