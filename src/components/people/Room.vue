<template>
	<div>
		<div class="header">
			<x-header style="background:#55BEB7" :left-options="{showBack:false}">群组<img src="../../assets/ic_app_add.png" alt="" slot="right" @click="addRoom" class="addRoomImg"></x-header>
		</div>
		<div style="padding-top: 45px;margin-bottom: 70px;background:white" >
			<flexbox v-for="item in items" style="border-top: 1px solid rgba(221, 221, 221,.8);">
				<div @click="roomInfo(item)"><img  src="../../assets/groupdefault.png" alt="" class="RoomImg"></div>
				<flexbox @click.native="goChat(item)">
						<span class="line-limit-length">{{item.name}}</span>
				</flexbox>
			</flexbox>
			
		</div>
		<div class="tabberWarp_Room">
			 <Tabbar>
				 <TabbarItem selected link="/Index" :badge=msgNum>
					 <img slot="icon" src="../../assets/message1.png" alt="">
					 <span slot="label">消息</span>
					 <!-- <badge text="888"></badge> -->
				 </TabbarItem>
				 <TabbarItem link="/People">
					 <img slot="icon" src="../../assets/people1.png" alt="">
					 <span slot="label">通讯录</span>
				 </TabbarItem>
	
				 <TabbarItem selected link="/Room">
					 <img slot="icon" src="../../assets/group_blue.png" alt="">
					 <span slot="label">群组</span>
					 <!-- <badge text="888"></badge> -->
				 </TabbarItem>
				 <TabbarItem link="/Me">
					 <img slot="icon" src="../../assets/me1.png" alt="">
					 <span slot="label">我</span>
				 </TabbarItem>
			 </Tabbar>
		 </div>
	</div>
</template>

<script>
import {XHeader,Flexbox, FlexboxItem,Tabbar, TabbarItem} from 'vux'
import apiRequest from '../../public/apiRequest.js'
import apiServer from '../../public/apiServer.js'
import store from '../../store'
import WEBIM from '../../public/webim.js'
import preventBack from 'vue-prevent-browser-back';
export default {
	name:"Room",
	mixins: [preventBack],
	created(){
		if(apiServer.isNull(window.sessionStorage.getItem("access_token"))){
			window.location.href = "/mobileWeb";
		}
		console.log("页面加载")
		if(!WEBIM.isConnect()){
			WEBIM.initWebIM(apiServer.sysConfig.xmppUrl,window.sessionStorage.getItem("userId"),window.sessionStorage.getItem("nickName"),WEBIM.resource,window.sessionStorage.getItem("password"),6,apiServer.sysConfig.xmppDomain);
			WEBIM.loginIM(function(){
				});
		}
		this.msgNum = window.sessionStorage.getItem("sysMsgNum")==0?"":window.sessionStorage.getItem("sysMsgNum");
		var that=this;
		if(JSON.stringify(this.$store.state.rooms)==JSON.stringify({})){
			apiRequest.getMyRooms(function(){
				that.items = that.$store.state.rooms;
				for(let i = 0;i<that.items.length;i++){
					that.items[i].jid = that.items[i].objectId
				}
			})
		}else{
			this.items = this.$store.state.rooms;
		}
		
	},
	data(){
		return{
			items:[],
			msgNum:''
		}
	},
	computed:{
		listenstage(){
			console.log("监听总的消息数量")
			// console.log(this.$store.state.friendsMsgNum)
			return this.$store.state.sysMsgNum;
		}
	},
	watch:{
		listenstage:function(val){
			console.log("进入监听")
			this.msgNum = window.sessionStorage.getItem("sysMsgNum")==0?"":window.sessionStorage.getItem("sysMsgNum");
		}
	},
	methods:{
		goChat:function(item){
			console.log(item);
			store.commit("setOpenUserId",item.jid);
			store.commit("setOpenUserName",item.name);
			store.commit("setOpenIsRoom",1);
			store.commit("setMsgList",[]);
			// console.log(item)
			item.isRoom=1;
			this.$router.push({path:'/Chat',query:{toUser:item,isRoom:item.isRoom}});
		},
		addRoom:function(){
			console.log("新增房间");
			this.$router.push({path:'/addRoom_selectUser'})
			
		},
		roomInfo:function(room){
			console.log(room);
			this.$router.push({path:'/RoomInfo',query:{room:room}})
		}
	},
	components:{
		XHeader,
		Flexbox,
		FlexboxItem,
		Tabbar, TabbarItem
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
	.RoomImg{
		width: 50px;
		margin-right: 10px;
		margin-left: 15px;
		margin-bottom: 5px;
		margin-top: 5px;
	}
	.addRoomImg{
		margin-top: -2px;
		width: 25px;
	}
	.tabberWarp_Room{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background: #fff; 
	}
	.line-limit-length {
	max-width: 200px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap; 
	margin: 0;
	}
</style>
