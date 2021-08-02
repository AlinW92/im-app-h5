<template>
	<div>
		<div class="header">
			<x-header style="background:#55BEB7">搜索</x-header>
		</div>
		<div style="padding-top: 45px;background:#F0EFF4">
			<flexbox v-for="item in items" style="border-top:1px solid rgba(221, 221, 221,.8);background:white" @click.native="userInfo(item.userId)">
				<div><img style="margin-left:15px;margin-right:10px;border-radius:100%" :src="item.avatar" class="friendsImg" :onerror='imgError'></div>
				<flexbox>
					<span>{{item.nickname}}</span>
				</flexbox>
			</flexbox>
		</div>

	</div>
</template>

<script>
import apiServer from '../../public/apiServer.js'
import apiRequest from '../../public/apiRequest.js'
import {XHeader,Group,Cell,XButton,XInput,Flexbox} from "vux"
export default {
	name:"searchFriend",
	created(){
		let that =this;
		console.log(that.$route.query.keyWord)
		if(!apiServer.isNull(that.$route.query.keyWord)){
			apiRequest.nearByUser(that.$route.query.keyWord,0,20,function(result){
				console.log(result.data);
				that.items = result.data;
				for(let i=0;i<that.items.length;i++){
					that.items[i].avatar = apiServer.getAvatarUrl(that.items[i].userId);
				}
			})
		}
	},
	data(){
		return{
			items:[],
			imgError:'this.src="' + require('../../assets/download.png') + '"'
		}
	},
	methods:{
		userInfo:function(userId){
			this.$router.push({path:'/UserInfo',query:{userId:userId}});
		}
	},
	components:{
		XHeader,
		Group,
		Cell,
		XButton,
		XInput,
		Flexbox
	},
}
</script>

<style>
	.friendsImg{
		width: 50px;
		height: 50px;
		margin-right: 5px;
		margin-left: 5px;
		margin-bottom: 5px;
		margin-top: 5px;
	}
	.header{
		position: fixed;
		top: 0;
		z-index: 1;
		width: 100%;

	}
</style>
