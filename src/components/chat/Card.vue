<template>
	<div id="seleRelative">
		<div class="header">
			<x-header  style="background:#55BEB7">选择联系人<button class="seleBtn" slot="right" @click="sendCard">确定</button></x-header>
		</div>
		<div style="margin-top: 45px;">
			<flexbox v-for="item in items" style="background:white;border-top: 1px solid #D9D9D9;" @click.native="select(item)">
				<!-- <input :id=item.toUserId  type="checkbox" class="weui-check" :value=item.toUserId style="margin-left: 10px;"> -->
				<check-icon :value.sync="item.show" @click.native="preventDefault(item)">
					&nbsp;
				</check-icon>
				<img :src=item.avatar class="friendsImg" :onerror='imgError'>
				<span>{{item.toNickname}}</span>
				<!-- <div style="height: 65px;line-height: 65px;">
					<input :id=item.toUserId  type="checkbox" class="weui-check" :value=item.toUserId style="margin-left: 10px;">
					<img :src=item.avatar class="friendsImg" @error='imgError(item)'>
					<span>{{item.toNickname}}</span>
				</div> -->
			</flexbox>
		</div>

	</div>
</template>

<script>
import { XHeader ,Flexbox,CheckIcon} from 'vux'
import msgRequest from '../../public/msgRequest.js'
import apiServer from '../../public/apiServer.js'
import WEBIM from '../../public/webim.js'
import store from '../../store'
var selectUserList=[];
export default {
	name:'Card',
	created(){
	// console.log(this.roomSelect)
	if(apiServer.isNull(window.sessionStorage.getItem("access_token"))){
	window.location.href = "/mobileWeb";
	}
		WEBIM.initWebIM(apiServer.sysConfig.xmppUrl,window.sessionStorage.getItem("userId"),window.sessionStorage.getItem("nickName"),WEBIM.resource,window.sessionStorage.getItem("password"),6,apiServer.sysConfig.xmppDomain);
		console.log("进入发送名片");
		console.log(selectUserList);
		this.items = this.$store.state.friendsMap;
		for(var key in this.items){
			this.items[key].show = false
		}
		for(let n=0;n<selectUserList.length;n++){
			this.items[selectUserList[n]].show=false;
		}
		selectUserList=[];
		// this.$forceUpdate();
	},
	data(){
		return {
			items:[],
			hobby2:false,
			demo1:false,
			roomSelect:false,
			imgError:'this.src="' + require('../../assets/download.png') + '"'
		}
	},
	methods:{
		preventDefault(item){
			item.show = !item.show
		},
		select:function(item){
			// console.log(item.show);
			if(!apiServer.isNull(item.show)&&item.show==true){
				item.show=false;
				for(var i = 0; i < selectUserList.length; i++) {
				    if(selectUserList[i] == item.toUserId) {
				     selectUserList.splice(i, 1);
				     break;
				    }
				 }
			}else{
				selectUserList.push(item.toUserId);
				item.show=true;
			}
			// console.log(selectUserList);
			this.$forceUpdate();
		},
		sendCard:function(){
			var toUserId = this.$store.state.openUserId;
			var toNickName = this.$store.state.openUserName;
			console.log(toUserId)
			console.log(toNickName)
			for(var i=0;i<selectUserList.length;i++){
				console.log(this.$store.state.friendsMap[selectUserList[i]]);
				var user =this.$store.state.friendsMap[selectUserList[i]];
				console.log("user")
				console.log(user);
				var msg=msgRequest.sendMessage(8,null,null,user.toUserId,user.toNickname,toUserId,toNickName);
				msg.content = WEBIM.decryptMessage(msg)
				msg.avatar = apiServer.getAvatarUrl(msg.objectId);
				store.commit("setMsgListOne",msg);
			}

			let lastList = store.state.lastChatList
			let flag = false
			for(let i = 0;i<lastList.length;i++){
				if(lastList[i].jid == store.state.openUserId){
					console.log(9,lastList[i],msg)
					lastList[i].content ='[名片]'
					let last = lastList[i]
					lastList.splice(i,1)
					lastList.unshift(last)
					let flag = true
					// console.log(msg,76)
				}
				if(!flag){
					let newM = msg
					// 待改 将msg转化成lastList中的一项
					lastList.unshift()
				}
			}
			//若消息列表没有该会话，则添加该会话记录
			store.commit("setLastChatMsg",lastList)
			//socket要延长时间
			setTimeout(()=>{this.$router.go(-1)},900)
		}
	},
	components:{
		XHeader,
		Flexbox,
		CheckIcon
	}
}
</script>

<style>
	.cardImg{
		width: 50px;
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
	.seleBtn{
	background:#1AAD19;
	border:none;
	padding:4px 6px;
	color:white;
	border-radius: 5px;
	}
#seleRelative .vux-header .vux-header-left .left-arrow:before{
	border: 1px solid #fff;
	border-width: 1px 0 0 1px;
}
 #seleRelative .vux-header .vux-header-left a{
	 float: left;
    margin-right: 8px;
    color: #fff;
 }
</style>
