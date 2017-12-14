<template>
	<div class="page-container">
        <img @click="back" class="back-to-index" src="../assets/404-btn.png" alt="返回首页">
	</div>
</template>
<script>
    export default {
        data: function(){
            return {}
        },
        methods: {
            back: function(){
                this.$router.back()
            }
        }
    }
</script>
<style lang="scss" scoped>
    .page-container {
        width: 100%;
    	height: 100%;
    	margin: 0;
    	background: url(../assets/404.jpg) no-repeat center center;
        background-size: cover;
        font-size: 20px;
        text-align: center;
        color: rgb(192, 204, 218);
        position: relative;
        .back-to-index{
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -64px;
            cursor: pointer;
        }
    }
</style>