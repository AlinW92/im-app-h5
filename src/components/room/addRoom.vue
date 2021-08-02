<template>
	<div id="newG">
		<!-- <div class="header"> -->
			<x-header style="background:#55BEB7">新建群组</x-header>
		<!-- </div> -->
		<group>
			<cell style="font-size:16px" title="群组名称" align="left" class="cellHeight"><x-input placeholder="请输入群名" v-model="roomName" required></x-input></cell>
			<cell style="font-size:16px" title="群组说明" align="left" class="cellHeight"><x-input placeholder="请输入说明" v-model="roomDesc" required></x-input></cell>
			<cell style="font-size:16px" title="创建者" align="left" class="cellHeight">{{createUserName}}</cell>
		</group>
		<div style="margin-top: 50px;">
			<x-button type="primary" @click.native="addRoom" style="background:#55BEB7;width: 95%;color: white;margin-top: 10%;">新建群组</x-button>
		</div>
		<div v-transfer-dom>
		  <alert v-model="show">{{Please}}</alert>
		</div>
		<div v-transfer-dom>
		  <loading :show="LoadingShow_addRoom" :text="LoadingText_addRoom"></loading>
		</div>
	</div>
</template>

<script>
import {XHeader,Group,Cell,XInput,XButton,Alert,Loading,TransferDomDirective as TransferDom} from 'vux'
import apiRequest from '../../public/apiRequest.js'
import apiServer from '../../public/apiServer.js'
import store from '../../store'
export default {
	name:'addRoom',
	directives:{
		TransferDom
	},
	data(){
		return{
			roomName:'',
			roomDesc:'',
			createUserName:window.sessionStorage.getItem("nickName"),
			Please:'',// 弹出框提示
			show:false,// 是否显示弹出框
			LoadingShow_addRoom:false,// 是否显示加载框
			LoadingText_addRoom:''// 是否显示加载框
		}
	},
	created(){
		if(apiServer.isNull(window.sessionStorage.getItem("access_token"))){
			window.location.href = "/mobileWeb";
		}
	},
	methods:{
		addRoom:function(){
			// if(apiServer.isNull(this.roomDesc)){
			// 	this.Please = "请输入群说明";
			// 	this.show = true;
			// }
			// if(apiServer.isNull(this.roomName)){
			// 	this.Please = "请输入群名称";
			// 	this.show = true;
			// }
			if(!this.roomName){
				this.Please = "请输入群名称"
				this.show = true;
			}else if(!this.roomDesc){
				this.Please = "请输入群说明"
				this.show = true;
			}else{
				var groupId = apiServer.randomUUID();
				console.log(this.$route.query.list,444)
				var membersText = JSON.stringify(this.$route.query.list);
				console.log(this.roomName,"0000")
				var params = {
					jid : groupId,
					name : this.roomName,
					desc : this.roomDesc,
					isLook:1,
					text : membersText
				};
				let that =this;
				apiRequest.createRoom(params,function(result){
					if(result.resultCode==1){
						console.log(222,result);
						let list=[];
						list.push(result.data);
						result.data.isRoom = 1
						store.commit("setRoomList",list);
						result.toNickName = name;
						store.commit("setOpenUserId",result.data.jid);
						store.commit("setOpenUserName",result.data.name);
						store.commit("setOpenIsRoom",1);
						store.commit("setMsgList",[]);
						that.$router.push({path:'/Chat',query:{room:result,toUser:result.data}});
					}
				})
			}	
// 			console.log(this.$route.query.list);
// 			console.log(this.roomDesc);
		}
	},
	components:{
		XHeader,
		Group,
		Cell,
		XInput,
		XButton,
		Alert,
		Loading
	}
}
</script>

<style>
.cellHeight{
	height: 30px;
}
#newG .vux-header .vux-header-left .left-arrow:before{
	border: 1px solid #fff;
	border-width: 1px 0 0 1px;
}
 #newG .vux-header .vux-header-left a{
	 float: left;
    margin-right: 8px;
    color: #fff;
 }
</style>
