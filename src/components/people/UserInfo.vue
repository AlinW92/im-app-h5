<template>
	<div style="height:100%;" id="cardInfo">
		<x-header  style="background:#55BEB7">基本信息</x-header>
		<div :blur-amount=40 :url="url" style="height:30%;display:flex;flex-direction:column;align-items:center;justify-content:center;">
		 <img :src="url" :onerror="imgError" style="border-radius: 100%;width: 125px;height: 125px;">
		  <!-- <p class="center">{{myNickName}}</p> -->
		</div>
		<div style="margin-bottom: 25px;">
			<group style="margin-top: -20px;">
				  <cell title="昵称" class="cellHeight" align="left">{{nickName}}</cell>
				  <cell title="备注" class="cellHeight" align="left"></cell>
				  <cell title="性别" class="cellHeight" align="left">{{sex}}</cell>
				  <cell title="出生日期" class="cellHeight" align="left">{{birthday}}</cell>
				  <cell title="居住地" class="cellHeight" align="left">{{address}}</cell>
			</group>
		</div>
		<div>
			<x-button type="primary" v-if="send" style='width: 95%;height:35px;line-height:35px;font-size:15px' @click.native="sendMsg">发消息</x-button>
			<x-button type="primary" v-if="addFriend&&(!black)&&$route.query.userId!=userId1" style='width: 95%;height:35px;line-height:35px;font-size:15px' @click.native="addNewFriend">加为好友</x-button>
			<x-button type="warn" v-if="send" style="width: 95%;height:35px;line-height:35px;font-size:15px" @click.native="deleteFriend()">删除好友</x-button>
			<x-button type="warn" v-if="send" style="width: 95%;height:35px;line-height:35px;font-size:15px" @click.native="addBlack()">加入黑名单</x-button>
			<x-button type="warn" v-if="black" style="width: 95%;height:35px;line-height:35px;font-size:15px" @click.native="cancelBlack()">移出黑名单</x-button>
		</div>
		<div v-transfer-dom>
		  <alert v-model="show" @on-hide="ComfirmDelet">{{Please}}</alert>
		</div>
		<toast v-model="addblack" toast-content-font-size='12px' type="text" position="bottom">加入黑名单成功</toast>
		<toast v-model="addFriend1" toast-content-font-size='12px' type="text" position="bottom">加好友成功</toast>
	</div>
</template>

<script>
import {Toast,XHeader,Blur,Group, Cell,XButton,Alert,TransferDomDirective as TransferDom} from 'vux'
import apiRequest from '../../public/apiRequest.js'
import apiServer from '../../public/apiServer.js'
import msgRequest from '../../public/msgRequest.js'
import store from '../../store'
let token = sessionStorage.getItem('access_token');
var user=null;
export default {
	name:"UserInfo",
	directives:{
		TransferDom
	},
	created() {
		if(apiServer.isNull(window.sessionStorage.getItem("access_token"))){
			window.location.href = "/mobileWeb";
		}
		console.log("用户的Id "+this.$route.query.userId);
		this.userId1 = sessionStorage.getItem('userId');
		var that = this;
		console.log(JSON.parse(window.sessionStorage.getItem("friendsMap"))[this.$route.query.userId]);
		apiRequest.getUser(this.$route.query.userId,function(result){
			console.log(result);
			user = result
			that.birthday = apiServer.toDate(result.birthday);
			that.url =  apiServer.getAvatarUrl(that.$route.query.userId);
			that.nickName = result.nickname;
			that.sex = result.sex==0?"女":'男';
		})
		if(!apiServer.isNull(JSON.parse(window.sessionStorage.getItem("friendsMap"))[this.$route.query.userId])){
			that.send = true;
		}else{
			console.log("不是好友")
			that.addFriend = true;
		}
	},
	data(){
		return {
			url:'',
			nickName:'',
			sex:'',
			birthday:'',
			address:'',
			send:false,
			addFriend:false,
			show:false,// 是否显示弹窗
			Please:'',// 弹窗提示
			addblack:false,
			black:this.$route.query.black,//该用户为黑名单用户
			userId:this.$route.query.userId,
			addFriend1:false,//显示添加好友成功气泡
			imgError:'this.src="' + require('../../assets/download.png') + '"',
			userId1:''
		}
	},
	methods:{
		sendMsg:function(){
			user.jid=user.userId;
			user.isRoom= 0;
			user.toNickName=user.nickname;
			store.commit("setOpenUserId",user.toUserId);
			store.commit("setOpenUserName",user.toNickname);
			store.commit("setOpenIsRoom",0);
			this.$router.push({path:'/Chat',query:{toUser:user,isRoom:user.isRoom}});
		},
		addNewFriend:function(){
			let that = this;
			console.log(that.$route.query.userId);
			apiRequest.getUser(that.$route.query.userId,function(result){
				console.log(result)
				if(result.settings.friendsVerify==1){
					// 需要好友验证
					let content = "你好"
					let msg=msgRequest.sendMessage(500,null,null,null,content,result.userId,result.nickname);
					if(!apiServer.isNull(msg)){
						that.Please="打招呼成功，静候回音";
						that.show = true;
					}
				}else{
					console.log("无好友验证");
					//添加到通讯录
					apiRequest.addFriend(result.userId,result.nickname,function(result){
						console.log(result);
						that.addFriend1 = true
						setTimeout(function(){
							that.$router.go(-3)
						},700)
					});
					//存放新朋友信息，更新到消息列表
					let lastChatList = store.state.lastChatList
					let newFriendMsg = apiServer.getOneMsg(result.userId,result.nickname,"我们成为好朋友了，快来聊天吧",508,0)
					lastChatList.unshift(newFriendMsg)
					store.commit('setLastChatMsg',lastChatList)
				}
			})
		},
		// 删除好友
		deleteFriend:function(){
			console.log(this.$route.query.userId)
			let friends = this.$store.state.friendsMap;
			if(apiServer.isNull(friends[this.$route.query.userId])){
				this.Please = "好友关系不存在";
				this.show = true;
			}
			let that = this;
			apiRequest.deleteFriend(that.$route.query.userId,function(result){
				if(result.resultCode==1){
					that.Please = "删除成功";
					that.show = true;
					msgRequest.sendMessage(505,null,null,null,"",that.$route.query.userId,null);
					//维护消息列表角标
					apiServer.setDelMsgNum(that.userId)
					// 维护通讯录列表
					delete friends[that.$route.query.userId];
					store.commit("setfriendsMap",friends);
					// let msgList = store.state.msgList;
					// for(let i = 0; i<list.length;i++){
					// 	list[i].display = true
					// }
					//维护消息列表
					let msg = store.state.lastChatList
					for(let i = 0;i<msg.length;i++){
						if(msg[i].jid == that.$route.query.userId){
							msg.splice(i,1)
						}
					}
					store.commit("setLastChatMsg",msg)
					that.$forceUpdate();
				}

			})
		},
		// 加入黑名单
		addBlack(){
			let that = this
			apiServer.postData({
					url:'/friends/blacklist/add',
					data:{
						access_token:token,
						toUserId:that.$route.query.userId,
					}
				},function(data){
					// console.log(1)
					that.addblack = true
					setTimeout(function(){
						that.$router.go(-1);
					},600)
					let friends = that.$store.state.friendsMap;
					delete friends[that.$route.query.userId];
					store.commit("setfriendsMap",friends);
					let news = store.state.lastChatList;
					for(let i=0;i<news.length;i++){
						if(news[i].jid == that.userId){
							news.splice(i,1)
						}
					}
					store.commit("setLastChatMsg",news);
					apiRequest.getBlackList(null,null,function(data){
						store.commit("setBlackList",data);
					})
					apiServer.setDelMsgNum(that.userId)
				})
		},
		// 移出黑名单
		cancelBlack(){
			let that = this
			apiServer.postData({
					url:'/friends/blacklist/delete',
					data:{
						access_token:token,
						toUserId:that.userId
					}
				},function(data){
					console.log(data)
					apiRequest.getMyFriends(function(){
						that.$router.go(-1)
					})
					let news = store.state.lastChatList;
					news.unshift(apiServer.getOneMsg(that.userId,that.nickName,"我们又是好朋友了"))
					store.commit("setLastChatMsg",news);
					apiRequest.getBlackList(null,null,function(data){
						store.commit("setBlackList",data);
					})
				})
		},
		// 确认删除
		ComfirmDelet(){
			// this.$router.go(-1);
			this.$router.push({path:"/index"})
		}
	},
	components:{
		XHeader,
		Blur,
		Group,
		Cell,
		XButton,
		Alert,
		Toast
	}
}
</script>

<style>
	.center{
		text-align: center;
	}
	.cellHeight{
		height: 25px;
}
#cardInfo .vux-header .vux-header-left .left-arrow:before{
	border: 1px solid #fff;
	border-width: 1px 0 0 1px;
}
 #cardInfo .vux-header .vux-header-left a{
	 float: left;
    margin-right: 8px;
    color: #fff;
 }
</style>
