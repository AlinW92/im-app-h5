<!-- 聊天设置 -->
<template>
	<div>
		<div>
			<x-header style="background:#55BEB7">{{header}}</x-header>
		</div>
		<group>
			<!-- <cell title="昵称" align="left">{{userName}}</cell>
			<cell title="性别" align="left">{{sex}}</cell>
			<cell title="生日" align="left"></cell> -->
			<x-switch title="阅后即焚" v-model="switchReadDel"></x-switch>
		</group>
		<!-- <x-button style="background:#55BEB7;color: white;width: 95%;">加入黑名单</x-button>
		<x-button style="background:#55BEB7;">删除好友</x-button> -->
	</div>
	
</template>

<script>
import {XHeader,XButton,Group,Cell,XSwitch} from 'vux'
import msgRequest from '../../public/msgRequest.js'
import apiRequest from "../../public/apiRequest.js"
import apiServer from '../../public/apiServer.js'
import WEBIM from '../../public/webim.js'
import store from '../../store'
export default {
	name:'ChatSetting',
	created(){
		console.log(this.$route.query.toUserId);
		this.switchReadDel = this.$route.query.isShowFire
		apiRequest.getUser(this.$route.query.toUserId,function(result){
			console.log(result);
		})
	},
	data(){
		return{
			header:'聊天设置',
			userName:'',
			sex:'',
			switchReadDel:false,// 是否开启阅后即焚
		}
	},
	watch:{
		switchReadDel(){
			let readDel = store.state.readDel
			if(this.switchReadDel){
				readDel[this.$route.query.toUserId] = true
				store.commit("setReadDel",readDel)
			}else{
				readDel[this.$route.query.toUserId] = false
				store.commit("setReadDel",readDel)
			}
		}
	},
	components:{
		XHeader,
		XButton,
		Group,
		Cell,
		XSwitch
	}
}
</script>

<style>
	
</style>
