<!-- 联系人界面 -->
<template>
	<div style="height: 100%;">
		<div class="header">
			<x-header style="background:#55BEB7" :left-options="{showBack:false}">通讯录<img src="../assets/ic_app_add.png" alt="" slot="right" class="addfriendImg" @click="addFriend"></x-header>
		</div>
			
			<!-- <grid class="grid_one">
				<grid-item link="/NewFriend">
					<img src="../assets/newFriend.png" class="img_size">
					<badge :text=newFriendMsgNum class="badgeClass"></badge>
					<div class="grid_div">
						<span>新的朋友</span>
					</div>
				</grid-item>
				<grid-item link="/MyCompany">
					<img src="../assets/colleagues.png" class="img_size">
					<badge :text=myCompanyMsgNum class="badgeClass"></badge>
					<div class="grid_div">
						<span>我的同事</span>
					</div>
				</grid-item>
				<grid-item>
					<img src="../assets/phone_list.png" class="img_size">
					<badge :text=myPhoneMsgNum class="badgeClass"></badge>
					<div class="grid_div">
						<span>联系人</span>
					</div>
				</grid-item>
				<grid-item link="/Public">
					<img src="../assets/public.png" class="img_size">
					<badge :text=publicMsgNum class="badgeClass"></badge>
					<div class="grid_div">
						<span>公众号</span>
					</div>
				</grid-item>
				
			</grid>
			<grid class="grid_two">
				<grid-item link="/Room">
					<img src="../assets/group_list.png" class="img_size">
					<badge :text=roomMsgNum class="badgeClass"></badge>
					<div class="grid_div">
						<span>群组</span>
					</div>
				</grid-item>
				<grid-item link="/BlackList">
					<img src="../assets/black.png" class="img_size">
					<badge :text=blackMsgNum class="badgeClass"></badge>
					<div class="grid_div">
						<span>黑名单</span>
					</div>
				</grid-item>
				<grid-item>
					<img src="../assets/device.png" class="img_size">
					<badge :text=deviceMsgNum class="badgeClass"></badge>
					<div class="grid_div">
						<span>我的设备</span>
					</div>
				</grid-item>
				<grid-item>
					<img src="../assets/label.png" class="img_size">
					<badge :text=labelMsgNum class="badgeClass"></badge>
					<div class="grid_div">
						<span>标签</span>
					</div>
				</grid-item>
			</grid> -->
			<div id="friedList" style="padding-top: 45px;padding-bottom: 60px;background:#F0EFF4">
				<flexbox v-for="(item,index) in items" :key="index" style="border-top:1px solid rgba(221, 221, 221,.8);background:white">
				<div>
						<img  @click="userInfo(item.toUserId,item.userId)" style="margin-left:15px;margin-right:10px;border-radius:100%"   :onerror='imgError'  :src="item.avatar" class="friendsImg showimgBackground">
				</div>
					<flexbox @click.native="goChat(item)">
						<span>{{item.toNickname}}</span>
					</flexbox>
				</flexbox>
			</div>
			<div class="tabberWarpX">
				<Tabbar>
					 <TabbarItem link="/Index" :badge=msgNum>
						 <img slot="icon" src="../assets/message1.png" alt="">
						 <span slot="label">消息</span>
					 </TabbarItem>
					 <TabbarItem selected link="/People">
						 <img slot="icon" src="../assets/people2.png" alt="">
						 <span slot="label">通讯录</span>
					 </TabbarItem>
					 <TabbarItem link="/Room">
						 <img slot="icon" src="../assets/group.png" alt="">
						 <span slot="label">群组</span>
					 </TabbarItem>
					 <TabbarItem link="/Me">
						 <img slot="icon" src="../assets/me1.png" alt="">
						 <span slot="label">我</span>
					 </TabbarItem>
				</Tabbar>
			</div>
		
	</div>
</template>

<script>
import apiServer from '../public/apiServer.js'
import apiRequest from '../public/apiRequest.js'
import { Tabbar, TabbarItem, Group, Cell,XHeader,Grid, GridItem,Flexbox, FlexboxItem,ViewBox,Badge } from 'vux'
import store from '../store'
import preventBack from 'vue-prevent-browser-back';
let friens=[];

export default {
	name:"People",
	inject:['reload'],
	mixins: [preventBack],
	created() {
	
		if(apiServer.isNull(window.sessionStorage.getItem("access_token"))){
			window.location.href = "/mobileWeb";
		}
		console.log("加载页面");
		this.msgNum = window.sessionStorage.getItem("sysMsgNum")==0?"":window.sessionStorage.getItem("sysMsgNum");
		var that=this;
		if(JSON.stringify(this.$store.state.friendsMap)==JSON.stringify({})){
			apiRequest.getMyFriends(function(){
				that.items = that.$store.state.friendsMap;
			})
		}else{
			console.log("页面赋值");
			console.log(this.$store.state.friendsMap);
			that.items = this.$store.state.friendsMap;
		}
			
	},
	data() {
	  return {
		items:[],
		msgNum:"",
		newFriendMsgNum:"2",
		myCompanyMsgNum:"3",
		myPhoneMsgNum:"4",
		publicMsgNum:"5",
		roomMsgNum:"6",
		blackMsgNum:"7",
		deviceMsgNum:"8",
		labelMsgNum:"9",
		show:true,
		imgError:'this.src="' + require('../assets/download.png') + '"'
	  };
	},
	mounted:function(){
		window.addEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件
		for(let i = 0;i<this.items.length;i++){
				this.items[i].show = true;
				console(1)
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
			console.log("进入监听");
			let that = this;
			this.msgNum = window.sessionStorage.getItem("sysMsgNum")==0?"":window.sessionStorage.getItem("sysMsgNum");
			// if(window.sessionStorage.getItem("peoMsgNum")>0){
			// 	let newFriendsMsg=JSON.parse(store.state.newFriendMsgList);
			// 	for(let i=0;i<newFriendsMsg.length;i++){
			// 		if(newFriendsMsg[i].type==508){
			// 			console.log("进来了呀");
			// 			// that.items = that.$store.state.friendsMap;
			// 			console.log(that.items);
			// 			that.$forceUpdate();
			// 		}
			// 	}
				
			// }
		}
	},
	methods:{
		handleScroll: function () {
			//变量scrollTop是滚动条滚动时，距离顶部的距离
	   		var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
	   		//变量windowHeight是可视区的高度
	   		var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
	   		//变量scrollHeight是滚动条的总高度
	   		var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
			//滚动条到底部的条件
               if(scrollTop+windowHeight==scrollHeight){
                //写后台加载数据的函数
         		console.log("距顶部"+scrollTop+"可视区高度"+windowHeight+"滚动条总高度"+scrollHeight);
              } 
        },
		friendsPhoto:function(item){
			console.log("sss");
		},
		// imgError:function(item){
		// 	item.avatar = require('../assets/ic_avatar.png');
		// },
		myRoomList:function(){
			console.log("ssssssssss");
		},
		goChat:function(item){
			console.log(item);
			if(!item.toUserId){
				item.toUserId = item.userId
			}
			item.jid = item.toUserId;
			item.toNickName = item.toNickname;
			item.isRoom = 0;
			store.commit("setOpenUserId",item.toUserId||item.friends.toUserId);
			store.commit("setOpenUserName",item.toNickname);
			store.commit("setOpenIsRoom",0);
			store.commit("setMsgList",[]);
			console.log(this.$store.state.openUserName)
			this.$router.push({path:'/Chat',query:{toUser:item}});
		},
		userInfo:function(userId,userId2){
			console.log(userId);
			if(userId){
				this.$router.push({path:'/UserInfo',query:{userId:userId}});
			}else{
					this.$router.push({path:'/UserInfo',query:{userId:userId2}});
			}
			
		},
		addFriend:function(){
			console.log("加好友");
			this.$router.push({path:'/addFriend'});
		}
	},
	components: {
	  Tabbar,
	  TabbarItem,
	  Group,
	  Cell,
	  XHeader,
	  Grid, 
	  GridItem,
	  Flexbox,
	  FlexboxItem,
	  ViewBox,
	  Badge
		
	}
	
}
</script>

<style>
.showimgBackground{
    display: inline-block;
    width: 45px;
    height: 45px;
    background: url(../assets/download.png) no-repeat;
	background-size: 45px 45px
    /* margin: 25px 0; */
 }
	a{
		text-decoration: none;
	}
	.tabberWarpX{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background: #fff; 
	}
	.header{
		position: fixed;
		top: 0;
		z-index: 1;
		width: 100%;
		
	}
	.grid_one{
		margin-top: 45px;
		text-align: center;
	}
	.grid_two{
		text-align: center;
	}
	.grid_div{
		text-align: center;
		color: black;
	}
	.img_size{
		width: 50px;
	}
	.friendsImg{
		width: 50px;
		height: 50px;
		margin-right: 5px;
		margin-left: 5px;
		margin-bottom: 5px;
		margin-top: 5px;
	}
	.badgeClass{
		float: right;
		margin-left: -30px;
	}
	.addfriendImg{
		margin-top: -2px;
		width: 25px;
	}
</style>
