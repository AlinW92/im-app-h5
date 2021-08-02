<!-- 文件详情 -->
<template>
	<div>
		<x-header  style="background:#55BEB7">详情</x-header>
		<div style="margin-top: 10%;">
			<img src="../../assets/file.png" alt="">
			<p style="margin-top: 5%;">{{fileName}}</p>
			<a :href="fileHref"><x-button style="background:#55BEB7;width: 60%;color: white;margin-top: 10%;" >下载({{fileSize}}KB)</x-button></a>
		</div>
	</div>
</template>

<script>
import {XHeader,XButton} from 'vux'
import apiServer from '../../public/apiServer.js'
export default {
	name:'FileInfo',
	created(){
		if(apiServer.isNull(window.sessionStorage.getItem("access_token"))){
			window.location.href = "/mobileWeb";
		}
		console.log(this.$route.query.FileInfo);
		this.fileName = this.$route.query.FileInfo.fileName.split("/")[this.$route.query.FileInfo.fileName.split("/").length-1];
		this.fileSize = (this.$route.query.FileInfo.fileSize/1024).toFixed(2);
		this.fileHref = this.$route.query.FileInfo.content;
	},
	data(){
		return{
			fileName:'',
			fileSize:'',
			fileHref:''
		}
	},
	methods:{
// 		downloadFile:function(){
// 			
// 		}
	},
	components:{
		XHeader,
		XButton
	}
}
</script>

<style>
</style>
