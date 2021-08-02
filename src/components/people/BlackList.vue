<template>
	<div>
		<div class="header">
			<x-header  style="background:#55BEB7">黑名单</x-header>
		</div>
		<div style="margin-top: 45px;">
			<flexbox v-for="item in items" style="border-top: 1px solid #D9D9D9;background:white" @click.native="toUserInfo(item.toUserId)">
				<div>
					<img  :src=item.avatar alt="" class="BlackListImg" :onerror='imgError'>
				</div>
				<span style="margin-left:5px">{{item.toNickname}}</span>
			</flexbox>
		</div>
	</div>
</template>

<script>
import {XHeader,Flexbox, FlexboxItem} from 'vux'
import apiRequest from '../../public/apiRequest.js'
import apiServer from '../../public/apiServer.js'
import store from '../../store'
export default {
	name:"BlackList",
	created(){
		if(apiServer.isNull(window.sessionStorage.getItem("access_token"))){
			window.location.href = "/mobileWeb";
		}
		console.log("黑名单");
		var that = this;
		apiRequest.getBlackList(null,null,function(data){
			that.items = data;
		})
	},
	data(){
		return{
			items:[],
			imgError:'this.src="' + require('../../assets/download.png') + '"'
		}
	},
	methods:{
		toUserInfo(userId){
			this.$router.push({path:"./UserInfo",query:{userId:userId,black:true}})
		}
	},
	components:{
		XHeader,
		Flexbox,
		FlexboxItem
	}
}
</script>

<style>
	.header{
		position: fixed;
		top: 0;
		z-index: 1;
		width: 100%;
		
	}
	.BlackListImg{
		width: 50px;
		height:50px;
		border-radius: 50px;
		margin:7px
	}
</style>
