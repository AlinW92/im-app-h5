<!-- 群共享文件 -->
<template>
	<div>
		<div>
			<x-header style="background:#55BEB7">
				{{header}}
				<img src="../../assets/ic_app_add.png" alt="" slot="right" @click="addSharedFile" class="addSharedFile">
				<input id="fileInput" type="file" @change="imgChange" ref="sharedImg" style="display: none;">
			</x-header>
		</div>
		<div style="padding-bottom: 60px;background:#F0EFF4">
			<flexbox v-for="item in items" style="border-top:1px solid rgba(221, 221, 221,.8);background:white" @click.native="openFileInfo(item)">
				<img style="margin-left:15px;margin-right:10px;" src="../../assets/file.png" class="shareFileImg" @error='imgError(item)'>
				<flexbox orient="vertical" :gutter="0">
					<flexbox-item><p class="line-limit-length-share">{{item.name}}</p></flexbox-item>
					<flexbox-item><p style="color:gray;font-size:13px">{{(item.size/1024).toFixed(2)}}KB  来自 {{item.nickname}}</p></flexbox-item>
				</flexbox>
			</flexbox>
		</div>
		
		<div v-transfer-dom>
		  <alert v-model="show">{{Please}}</alert>
		</div>
		
	</div>
</template>

<script>
import {XHeader,Flexbox,FlexboxItem,Alert,TransferDomDirective as TransferDom} from 'vux'
import apiRequest from '../../public/apiRequest.js'
import apiServer from '../../public/apiServer.js'
import store from '../../store'
export default {
	name:'SharedFile',
	directives:{
		TransferDom
	},
	created(){
		let that = this;
		apiRequest.getRoomShareList(this.$route.query.roomId,function(result){
			console.log(result);
			that.items = result.data;
			// console.log()
// 			for(let i=0;i<result.data.length;i++){
// 				
// 			}
		})
	},
	data(){
		return{
			header:'群共享文件',
			items:[],
			Please:'',// 提示框内容
			show:false,// 是否显示提示框
		}
	},
	methods:{
		addSharedFile:function(){
			this.$refs.sharedImg.click();
		},
		imgChange:function(){
			
			var file = $("#fileInput")[0].files[0];
			console.log("上传文件");
			console.log(file)
			var formData = new FormData();
			let that = this;
			var fileSize = file.size;
			formData.append("file",file);
			apiServer.postFile({
				data:formData
			},function(result){
				console.log(result);
				let type=0;
				let url="";
				if(!apiServer.isNull(result.data.data.others[0])){
					url=result.data.data.others[0].oUrl;
				}else if(!apiServer.isNull(result.data.data.images[0])){
					url=result.data.data.images[0].oUrl;
				}else if(!apiServer.isNull(result.data.data.audios[0])){
					url=result.data.data.audios[0].oUrl;
				}else if(!apiServer.isNull(result.data.data.videos[0])){
					url=result.data.data.videos[0].oUrl;
				}
				let fileLastName=file.name.split(".")[file.name.split(".").length-1];
				if(fileLastName=="mp3"){
					type=2;
				}else if(fileLastName=="mp4"||fileLastName=="avi"){
					type=3;
				}else if(fileLastName=="ppt"){
					type=4;
				}else if(fileLastName=="xls"){
					type=5;
				}else if(fileLastName=="doc"){
					type==6;
				}else if(fileLastName=="rar"||fileLastName=="zip"){
					type==7;
				}else if(fileLastName=="txt"){
					type=8;
				}else if(fileLastName=="pdf"){
					type=10;
				}else if(fileLastName=="apk"){
					type=11;
				}else{
					type=9;
				}
				
				apiRequest.addShared(type,url,file.size,file.name,that.$route.query.roomId,function(data){
					console.log(data);
					if(data.data.resultCode==1){
						this.Please = "上传文件成功";
						this.show = true;
					}
				})
			})
		},
		openFileInfo:function(item){
			console.log(item);
			let fileInfo={
				content:item.url,
				fileName:item.name,
				fileSize:item.size
			}
			this.$router.push({path:'/FileInfo',query:{FileInfo:fileInfo}});
		}
	},
	components:{
		XHeader,
		Flexbox,
		FlexboxItem,
		Alert
	}
}
</script>

<style>
	.addSharedFile{
		margin-top: -2px;
		width: 25px;
	}
	.shareFileImg{
		width: 50px;
		height: 50px;
		margin-right: 5px;
		margin-left: 5px;
		margin-bottom: 5px;
		margin-top: 5px;
	}
	.line-limit-length-share {
		max-width: 250px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap; 
		margin: 0;
	}
</style>
