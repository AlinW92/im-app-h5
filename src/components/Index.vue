<!-- 消息界面 -->
<template>
	<div>
		<div class="header">
			<x-header style="background:#55BEB7" :left-options="{showBack:false}">消息</x-header>
		</div>
		<div style="padding-bottom: 60px;padding-top: 45px;background:#F0EFF4;" class="imageS">
			<flexbox style="border-top: 1px solid rgba(221, 221, 221,.8);background:white" @click.native="goNewFriend">
				<div><img src="../assets/im_10001.png"  :onerror='imgError' class="friendsImg" style="margin-left:15px;margin-right:10px"></div>
				<flexbox orient="vertical" :gutter="0">
					<flexbox-item>
						<span class="line-limit-length">新的朋友</span></flexbox-item>
						<flexbox-item ><p class="line-limit-length" style="color:gray;font-size:13px">好友验证消息</p>
						<badge v-if="showPeoMsgNum" :text="peoMsgNum" style="float: right;margin-top: -10px;margin-right:5px;"></badge>
					</flexbox-item>
				</flexbox>
			</flexbox>
			<flexbox v-for="item in items" style="border-top: 1px solid rgba(221, 221, 221,.8);background:white">
				<div @click="userInfo(item)">
					<img v-if="item.isRoom!=1" :src=item.avatar :onerror='imgError' class="friendsImg" style="margin-left:15px;margin-right:10px">
					<img v-if="item.isRoom==1" :src=item.avatar :onerror='imgGroupError' class="friendsImg" style="margin-left:15px;margin-right:10px">
				</div>
				<flexbox orient="vertical" :gutter="0" @click.native="goChat(item)">
						<flexbox-item><p class="line-limit-length" style="margin-top:-15px;margin-bottom:1px">{{item.toNickName}}</p></flexbox-item>
						<div style="width:100%;position:relative">
							<p class="line-limit-length" style="position:absolute;color:gray;font-size:13px" >{{item.content}}</p>
							<badge v-if="item.isMsgNum" :text="item.msgNum" style="float:right;position:absolute;right:0;margin-top:0px;margin-right:5px"></badge>
							<span style="float: right;position:absolute;right:0;top:-20px;font-size:11px;margin-right:5px">{{item.timeSend*1000 | dateFormat}}</span>
						</div>
						<!-- <badge :id="item.toUserId" :text="userMsgNum" style="float: right;margin-top: -20px;"></badge> -->
				</flexbox>
			</flexbox>
		</div>
		<div class="tabberWarp_index">
			 <Tabbar>
				 <TabbarItem selected link="/Index" :badge=msgNum>
					 <img slot="icon" src="../assets/message2.png" alt="">
					 <span slot="label">消息</span>
				 </TabbarItem>
				 <TabbarItem link="/People">
					 <img slot="icon" src="../assets/people1.png" alt="">
					 <span slot="label">通讯录</span>
				 </TabbarItem>
				 <TabbarItem link="/Room">
					 <img slot="icon" src="../assets/group.png" alt="">
					 <span slot="label">群组</span>
					 <!-- <badge text="888"></badge> -->
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
import { Tabbar, TabbarItem, Group, Cell,XHeader,Flexbox ,FlexboxItem,Badge } from 'vux'
import apiServer from '../public/apiServer.js'
import apiRequest from '../public/apiRequest.js'
import msgRequest from '../public/msgRequest.js'
import WEBIM from '../public/webim.js'
import store from '../store'
import moment from 'moment'
import 'moment/locale/zh-cn';
import preventBack from 'vue-prevent-browser-back';
moment.locale('zh-cn');
let friens=[];
var msgNumList=[];
export default {
	name: "Index",
	inject:['reload'],
	mixins: [preventBack],
	beforeCreate() {
		console.log('before')
		store.commit("setOpenUserId","");
		store.commit("setOpenUserName","");
		store.commit("setOpenIsRoom","");
		var that=this;
		// this.msgNum = this.$store.state.sysMsgNum;
		console.log("xmpp连接状态 "+WEBIM.isConnect())
		if(!WEBIM.isConnect()){
			// 初始化数据
			WEBIM.initWebIM(apiServer.sysConfig.xmppUrl,window.sessionStorage.getItem("userId"),window.sessionStorage.getItem("nickName"),WEBIM.resource,window.sessionStorage.getItem("access_token"),6,apiServer.sysConfig.xmppDomain);
			// 登陆xmpp
			WEBIM.loginIM(function(){
				// 获取好友列表 获取最后一条消息记录
				if(WEBIM.isConnect()){
					apiRequest.getMyFriends(function(){
						apiRequest.getMyRooms(function(){
							apiRequest.getLastChatList(function(data){
								for(let i=0;i<data.length;i++){
									data[i].timeSend = data[i].timeSend/1000+""
								}
								console.log(data,33333333333)
								//数据解码
								for(let i=0;i<data.length;i++){
									data[i].content = WEBIM.parseShowMsgTitle(data[i]);
									if(data[i].isEncrypt&&data[i].type == 1){
										data[i].content = WEBIM.decryptMessage(data[i])
									}
								}
								that.items = data.reverse();
								console.log(data,"heheh");

								if(!apiServer.isNull(window.sessionStorage.getItem("friendsMsgNum"))){
									msgNumList = JSON.parse(window.sessionStorage.getItem("friendsMsgNum"));
								}
								console.log(msgNumList);
								// this.msgNum = window.sessionStorage.getItem("sysMsgNum");
								console.log("未读消息用户列表 "+msgNumList);
								if(!apiServer.isNull(msgNumList)){
									for(var i=0;i<msgNumList.length;i++){
										console.log(msgNumList[i]+" 消息数量"+window.sessionStorage.getItem("msgNum"+msgNumList[i]));
										that.userMsgNum = window.sessionStorage.getItem("msgNum"+msgNumList[i]);
										// $("#"+msgNumList[i]).append("<badge text=''></badge>");
										console.log("ssss1111")
										console.log(that.items.length)
										for(var n=0;n<that.items.length;n++){
											console.log("......")
											if(that.items[n].jid==msgNumList[i]){
												// 遍历未读消息的消息数量 并将数量角标显示出来
												that.items[n].msgNum = that.userMsgNum;
												that.items[n].isMsgNum = true;
											}
											console.log("最新一条消息userId "+window.sessionStorage.getItem("newMsgUserId"))
											// 如果最新一条消息在消息列表已经存在
											if(that.items[n].jid==window.sessionStorage.getItem("newMsgUserId")){
												if(that.$store.state.newMsgList.length>0){
													that.items[n].content = that.$store.state.newMsgList[that.$store.state.newMsgList.length-1].content[0].data;
													that.items.unshift(that.items[n]);
													that.items.splice(n+1, 1);
													console.log(that.items);
												}
											}
										}
									}
								}
							})
						})
					})
					//获取黑名单
					if(that.$store.state.blackList.length == 0){
						apiRequest.getBlackList(null,null,function(data){
							that.$store.commit("setBlackList",data);
						})
					}
				}else{
					console.log("xmpp重新连接1")
				}
			});
		}

		console.log("消息数量"+this.$store.state.sysMsgNum)

	},
	filters:{
		dateFormat(val){
			return moment(val).calendar();
		}
	},
	created() {
		console.log('create')
		if(apiServer.isNull(window.sessionStorage.getItem("access_token"))){
			window.location.href = "/mobileWeb";
		}
				// 若有新的朋友消息则显示UI
		if(window.sessionStorage.getItem("peoMsgNum")>0){
			this.showPeoMsgNum = true
			this.peoMsgNum = window.sessionStorage.getItem("peoMsgNum")
		}
			// apiRequest.getLastChatList(function(data){
			// 					for(let i=0;i<data.length;i++){
			// 						data[i].content = WEBIM.parseShowMsgTitle(data[i]);
			// 						that.items[i].content = 	data[i].content;
			// 					}

			// 					console.log(data,"已经变了");

			// 				})
		var that=this;
		if(this.$store.state.lastChatList.length==0){
			console.log("最后一条消息列表为空")
			// 获取好友列表 获取最后一条消息记录
			if(WEBIM.isConnect()){
				apiRequest.getMyFriends(function(){
					apiRequest.getMyRooms(function(){
						apiRequest.getLastChatList(function(data){
							for(let i=0;i<data.length;i++){
								console.log(data,656565)
								data[i].content = WEBIM.parseShowMsgTitle(data[i]);
							}
							that.items = data.reverse();
							// console.log(that.items,22222);
						})
					})
				})
			}else{
				console.log("xmpp重新连接2")
			}

		}else{
			// 最后一条消息列表
			that.items = that.$store.state.lastChatList;
			// console.log(that.items,999999)
			// 获取消息总数量
			this.msgNum = window.sessionStorage.getItem("sysMsgNum")==0?"":window.sessionStorage.getItem("sysMsgNum");
			// this.num();

			console.log("ssdsadaa131232131")
			if(!apiServer.isNull(window.sessionStorage.getItem("friendsMsgNum"))){
				msgNumList = JSON.parse(window.sessionStorage.getItem("friendsMsgNum"));
			}
			// this.msgNum = window.sessionStorage.getItem("sysMsgNum");
			console.log("未读消息用户列表 "+msgNumList);
			if(!apiServer.isNull(msgNumList)){
				for(var i=0;i<msgNumList.length;i++){
					console.log(msgNumList[i]+" 消息数量"+window.sessionStorage.getItem("msgNum"+msgNumList[i]));
					// 每个未读消息的消息数量
					this.userMsgNum = window.sessionStorage.getItem("msgNum"+msgNumList[i]);
					// $("#"+msgNumList[i]).append("<badge text=''></badge>");
					for(var n=0;n<this.items.length;n++){
						if(this.items[n].jid==msgNumList[i]){

							this.items[n].msgNum = this.userMsgNum;
							this.items[n].isMsgNum = true;
						}
						console.log("最新一条消息userId "+window.sessionStorage.getItem("newMsgUserId"))
						if(this.items[n].jid==window.sessionStorage.getItem("newMsgUserId")){
								// 如果最新一条消息在消息列表已经存在
							if(this.$store.state.newMsgList.length>0){
								this.items[n].content = this.$store.state.newMsgList[this.$store.state.newMsgList.length-1].content[0].data;
								if(apiServer.isNull(this.items[n].content)){
									this.items[n].content = this.$store.state.newMsgList[this.$store.state.newMsgList.length-1].content;
								}
								// 将最新条消息加入消息列表
								this.items.unshift(this.items[n]);
								this.items.splice(n+1, 1);
								console.log(this.items);
							}
						}
					}
				}
			}
			console.log(999,this.$store.state.newMsgList);
			if(this.$store.state.newMsgList.length>0){

				if(window.sessionStorage.getItem("IndexUserIdlist").indexOf(this.$store.state.newMsgList[this.$store.state.newMsgList.length-1].fromUserId)==-1){
							var newLastMsg=this.$store.state.newMsgList[this.$store.state.newMsgList.length-1];

							let IndexUserIdList=[];
								IndexUserIdList = window.sessionStorage.getItem("IndexUserIdlist").split(",");
							// 若消息列表已有新消息
							if(newLastMsg.chatType==2){

								newLastMsg.avatar = require('../assets/groupdefault.png');
								newLastMsg.jid = newLastMsg.toUserId;
								newLastMsg.isRoom=1;
								if(newLastMsg.type==907&&newLastMsg.toUserId==window.sessionStorage.getItem("userId")){
									console.log(window.sessionStorage.getItem("IndexUserIdlist"));
									if(window.sessionStorage.getItem("IndexUserIdlist").indexOf(this.$store.state.newMsgList[this.$store.state.newMsgList.length-1].objectId)!=-1){
										console.log(this.$store.state.newMsgList[this.$store.state.newMsgList.length-1].objectId);
											return;
									}
									newLastMsg.toNickName = store.state.myRooms[newLastMsg.objectId].toNickname||store.state.myRooms[newLastMsg.objectId].name;
									newLastMsg.toNickName = newLastMsg.content;
									newLastMsg.content="群控制消息";
									newLastMsg.jid=newLastMsg.objectId;
									IndexUserIdList.push(newLastMsg.objectId);
								}else{
									newLastMsg.toNickName = store.state.myRooms[newLastMsg.toUserId].toNickname||store.state.myRooms[newLastMsg.objectId].name;
									newLastMsg.content = newLastMsg.content[0].data;
									IndexUserIdList.push(newLastMsg.toUserId);
								}


								if(apiServer.isNull(newLastMsg.content)){
									newLastMsg.content = newLastMsg.content;
								}
								newLastMsg.msgNum =  1;
								newLastMsg.isMsgNum = true;
								console.log(1122,newLastMsg);
								this.items.unshift(newLastMsg);
							}else{
								// console.log("会来这么么么么么么")
								if(newLastMsg.fromUserId==window.sessionStorage.getItem("userId")){
									return;
								}
								newLastMsg.avatar = apiServer.sysConfig.avatarBase+(parseInt(newLastMsg.fromUserId) % 10000) + "/" + newLastMsg.fromUserId + ".jpg";
								newLastMsg.jid = newLastMsg.fromUserId;
								newLastMsg.toNickName = store.state.friendsMap[newLastMsg.fromUserId].toNickname;
								newLastMsg.content = newLastMsg.content[0].data;
								if(apiServer.isNull(newLastMsg.content)){
									newLastMsg.content = newLastMsg.content;
								}
								if(newLastMsg.isReadDel){
									newLastMsg.content = "点击查看 T"
								}
								newLastMsg.msgNum =  1;
								newLastMsg.isMsgNum = true;
								this.items.unshift(newLastMsg);
							}
							// console.log("未找到");
							// console.log(newLastMsg);
							window.sessionStorage.setItem("IndexUserIdlist",IndexUserIdList);

						}
			}else{
				console.log("好尴尬1111");
				if(window.sessionStorage.getItem("peoMsgNum")>0){
					this.showPeoMsgNum = true;
					this.peoMsgNum = window.sessionStorage.getItem("peoMsgNum");
				}
			}
			// if(this.$store.state.msgList[this.$store.state.msgList.length-1]){

			// }
			// apiRequest.getLastChatList(function(data){
			// 	for(let i=0;i<data.length;i++){
			// 		data[i].content = WEBIM.parseShowMsgTitle(data[i]);
			// 	}
			// 	that.items = data;
			// 	console.log(data);
			// })
		}
		// this.msgNum = this.$store.state.sysMsgNum==0?"":(this.$store.state.sysMsgNum+"");
		this.msgNum = window.sessionStorage.getItem("sysMsgNum")==0?"":window.sessionStorage.getItem("sysMsgNum");
	},
	beforeUpdate(){
		// console.log("总的消息数量 "+window.localStorage.getItem("sysMsgNum"));
		// console.log("未读消息用户列表 "+window.localStorage.getItem("friendsMsgNum"));


		// console.log(this.items)
	},
	computed:{
		listenstage(){
			console.log("监听总的消息数量")
			console.log(this.$store.state.sysMsgNum)
			return this.$store.state.sysMsgNum;
		}
	},
	watch:{
		// 监听总的消息数量
		listenstage:function(val){
			let that = this
			// this.msgNum = val+"";
			this.msgNum = window.sessionStorage.getItem("sysMsgNum");
			//读取新朋友信息数
			if(window.sessionStorage.getItem("peoMsgNum")>0){
				this.showPeoMsgNum = true;
				this.peoMsgNum = window.sessionStorage.getItem("peoMsgNum");

			}
			// this.num();
			console.log("ssdsadaa131232131")
			//读取信息列表,存放的是未读消息用户id列表
			if(!apiServer.isNull(window.sessionStorage.getItem("friendsMsgNum"))){
				msgNumList = JSON.parse(window.sessionStorage.getItem("friendsMsgNum"));
			}
			console.log(msgNumList);
			// this.msgNum = window.sessionStorage.getItem("sysMsgNum");
			console.log("未读消息用户列表 "+msgNumList);

			if(!apiServer.isNull(msgNumList)){
				for(var i=0;i<msgNumList.length;i++){
					console.log(msgNumList[i]+" 消息数量"+window.sessionStorage.getItem("msgNum"+msgNumList[i]));
					//获取某个用户的未读消息数
					this.userMsgNum = window.sessionStorage.getItem("msgNum"+msgNumList[i]);
					// $("#"+msgNumList[i]).append("<badge text=''></badge>");
					for(var n=0;n<this.items.length;n++){
						//判断这个userid在不在页面信息列表上（包括个人和群），在的话直接赋值未读消息数
						if(this.items[n].jid==msgNumList[i]||this.items[n].objectId==msgNumList[i]){

							this.items[n].msgNum = this.userMsgNum;
							this.items[n].isMsgNum = true;
							// delete msgNumList[i];
							// msgNumList.splice(i,1);
						}
						console.log("最新一条消息userId "+window.sessionStorage.getItem("newMsgUserId"))
						//把最新一条消息放到最上面，显示最新一条消息内容
						if(this.items[n].jid==window.sessionStorage.getItem("newMsgUserId")||this.items[n].objectId==window.sessionStorage.getItem("newMsgUserId")){
							console.log(5)
							if(this.$store.state.newMsgList.length>0){
								this.items[n].content = this.$store.state.newMsgList[this.$store.state.newMsgList.length-1].content[0].data;
								if(apiServer.isNull(this.items[n].content)){
									this.items[n].content = this.$store.state.newMsgList[this.$store.state.newMsgList.length-1].content;
								}
								var newLastMsg=this.$store.state.newMsgList[this.$store.state.newMsgList.length-1];
								console.log("解密前的content",newLastMsg.content)
								newLastMsg.content = WEBIM.decryptMessage(newLastMsg);
								console.log("解密后的content",newLastMsg.content)
								console.log("转换前content",newLastMsg.content)
								this.items[n].content = WEBIM.parseShowMsgTitle(newLastMsg);
								console.log("转换后content",this.items[n].content)
								if(newLastMsg.isReadDel){
									console.log(6868)
									this.items[n].content = "点击查看 T"
								}
								this.items.unshift(this.items[n]);
								this.items.splice(n+1, 1);
							}
						}
					}

				}

				console.log("打印this.items：",this.items);

			}
			if(this.$store.state.newMsgList.length>0){
				for(let j=0;j<this.$store.state.newMsgList.length;j++){
								let newLastMsg=this.$store.state.newMsgList[j];
								console.log(33399)
								if(newLastMsg.type==907&&newLastMsg.toUserId==window.sessionStorage.getItem("userId")){
									newLastMsg.toUserId = newLastMsg.objectId;
								}
								let IndexUserIdList=[];
								IndexUserIdList = window.sessionStorage.getItem("IndexUserIdlist").split(",");
								if(newLastMsg.chatType==2){
									if(window.sessionStorage.getItem("IndexUserIdlist").indexOf(newLastMsg.toUserId)==-1){
										console.log(newLastMsg,545)
										console.log("jid的 "+newLastMsg.toUserId)
										newLastMsg.avatar = require('../assets/groupdefault.png');

										newLastMsg.isRoom = 1;
										// console.log(newLastMsg,71)
										console.log(store.state.myRooms)
										console.log("看看是什么 ")
										console.log(store.state.myRooms[newLastMsg.toUserId])

										console.log(IndexUserIdList);
										if(newLastMsg.type==907&&newLastMsg.toUserId==window.sessionStorage.getItem("userId")){
											console.log("是这里吗")
											newLastMsg.jid = newLastMsg.objectId;
											newLastMsg.toNickName = store.state.myRooms[newLastMsg.objectId].name;
											IndexUserIdList.push(newLastMsg.objectId);
										}else{
												console.log("是这里吗",22)
											newLastMsg.jid = newLastMsg.toUserId;
											newLastMsg.toNickName = store.state.myRooms[newLastMsg.toUserId].name;
											IndexUserIdList.push(newLastMsg.toUserId);
										}
										if(apiServer.isNull(newLastMsg.content)){
											newLastMsg.content = newLastMsg.content;
										}else{
											newLastMsg.content = newLastMsg.content[0].data;
										}
										// newLastMsg.msgNum = 1;

											// if(this.items[i].jid == newLastMsg.jid){
											newLastMsg.msgNum = 1;
											// console.log(newLastMsg.jid,window.sessionStorage.getItem("friendsMsgNum"),177777777)
											newLastMsg.isMsgNum = true;
											this.items.unshift(newLastMsg);

											// }else{
											// 			newLastMsg.isMsgNum = true;
											//      console.log(newLastMsg.jid,window.sessionStorage.getItem("friendsMsgNum"),777777777)
										  // 	// this.items.unshift(newLastMsg);
											// }

							window.sessionStorage.setItem("IndexUserIdlist",IndexUserIdList);
							console.log(222,newLastMsg);
						}

					}else{
						// if(newLastMsg.fromUserId==window.sessionStorage.getItem("userId")){
						// 	return;
						// }
						// //新朋友消息不在列表上，要添加
						// let listHasNewUserId = false
						// for(let i=0;i<this.items.length;i++){
						// 	if(this.items[i].jid==newLastMsg.fromUserId||this.items[i].objectId==newLastMsg.fromUserId){
						// 		listHasNewUserId = true
						// 		return
						// 	}
						// }
						// if(!listHasNewUserId){
						// 	console.log(8870,newLastMsg)
						// 	newLastMsg.avatar = apiServer.sysConfig.avatarBase+(parseInt(newLastMsg.fromUserId) % 10000) + "/" + newLastMsg.fromUserId + ".jpg";
						// 	newLastMsg.jid = newLastMsg.fromUserId;
						// 	newLastMsg.isRoom=0;
						// 	console.log(newLastMsg.fromUserId);
						// 	console.log(store.state.friendsMap[newLastMsg.fromUserId]);
						// 	newLastMsg.toNickName = this.$store.state.friendsMap[newLastMsg.fromUserId].toNickname;
						// 	if(newLastMsg.type==508){
						// 		newLastMsg.content = newLastMsg.content;
						// 	}else{
						// 		newLastMsg.content = this.$store.state.newMsgList[this.$store.state.newMsgList.length-1].content;
						// 	}
						// 	console.log("消息的内容  "+newLastMsg.content);
						// 	if(apiServer.isNull(newLastMsg.content)){
						// 		newLastMsg.content = newLastMsg.content;
						// 	}
						// 		if(newLastMsg.isReadDel){
						// 		newLastMsg.content = "点击查看 T"
						// 	}
						// 	newLastMsg.msgNum =  window.sessionStorage.getItem("msgNum"+newLastMsg.fromUserId)||1;
						// 	newLastMsg.isMsgNum = true;
						// 	this.items.unshift(newLastMsg);
						// 	// IndexUserIdList.push(newLastMsg.fromUserId);
						// 	// window.sessionStorage.setItem("IndexUserIdlist",IndexUserIdList);
						// 	console.log(1212121121,newLastMsg);
						// 	console.log(this.items);
						// }else{

						// }
					}
					// console.log("未找到");
					// console.log(newLastMsg);
				}
			}else{
				console.log("好尴尬")
				console.log(window.sessionStorage.getItem("friendsMsgNum"))

			}
			// if(msgNumList.length!=0){
			// 	console.log("漏了的 "+msgNumList.length)
			// }
			// this.reload()
		}
	},
	data() {
		return {
		  msgNum:"",
		  newFriendMsgNum:"1",
		  items:[],
		  userMsgNum:0,
		  showPeoMsgNum:false,
		  peoMsgNum:0,
		  imgError:'this.src="' + require('../assets/download.png') + '"',
		  imgGroupError:'this.src="' + require('../assets/groupdefault.png') + '"'
		}
	},
	props:["msgfromfather"],
	methods:{
		goChat:function(item){
			if(item.chatType == 2){
				item.jid = item.objectId
			}
			console.log(item.jid,99);
			store.commit("setOpenUserId",item.jid);
			store.commit("setOpenUserName",item.toNickName);
			store.commit("setOpenIsRoom",item.isRoom);
			store.commit("setMsgList",[]);
			console.log(msgNumList)
			if(msgNumList.length!=0){
				if(msgNumList.indexOf(item.jid)>=0){
					for(var i = 0; i < msgNumList.length; i++) {
					    if(msgNumList[i] == item.jid) {
							for(var n=0;n<this.items.length;n++){
								if(this.items[n].jid==msgNumList[i]){
									console.log("点的就是我 "+msgNumList[i])
									console.log(JSON.parse(window.sessionStorage.getItem("userUnread")));
									if(!apiServer.isNull(JSON.parse(window.sessionStorage.getItem("userUnread"))[msgNumList[i]])){
										for(let j=0;j<JSON.parse(window.sessionStorage.getItem("userUnread"))[msgNumList[i]].length;j++){
											let msg=JSON.parse(window.sessionStorage.getItem("userUnread"))[msgNumList[i]][j];
											console.log(item.jid,88);
											// 发送已读回执
											// msgRequest.sendReadReceipt(item.jid,msg,1);
											// JSON.parse(window.sessionStorage.getItem("userUnread")).remove(msgNumList[i]);

										}
									}


									let hmap = JSON.parse(window.sessionStorage.getItem("userUnread"));
									// 删除点进此用户未读消息
									delete hmap[msgNumList[i]];
									window.sessionStorage.setItem("userUnread",JSON.stringify(hmap));
									// this.items[n].msgNum = this.userMsgNum;
									this.items[n].isMsgNum = false;
								}
							}

					     	msgNumList.splice(i, 1); // 移除未读消息列表中的用户Id
							// window.sessionStorage.setItem("friendsMsgNum",msgNumList);
							// store.commit("setfriendsMsgNum",msgNumList);
							window.sessionStorage.setItem("friendsMsgNum",JSON.stringify(msgNumList));
							window.sessionStorage.setItem("sysMsgNum",window.sessionStorage.getItem("sysMsgNum")-window.sessionStorage.getItem("msgNum"+item.jid));
							// console.log("要减去的消息数量 "+window.sessionStorage.getItem("msgNum"+item.jid))
							store.commit("setSysMsgNum",-window.sessionStorage.getItem("msgNum"+item.jid));
							window.sessionStorage.setItem("msgNum"+item.jid,"");// 设置改用户的未读消息数量为0
							// item.isMsgNum = false;
							console.log(window.sessionStorage.getItem("msgNum"+item.jid))
					     	break;
					    }
					 }
				}
			}
			this.$router.push({path:'/Chat',query:{toUser:item,isRoom:item.isRoom}});

		},
		num:function(userId){
			// console.log()
			console.log("返回消息数量")
			if(apiServer.isNull(window.sessionStorage.getItem("msgNum"+userId))){
				return "";
			}else{
				console.log("返回消息数量")
				return window.sessionStorage.getItem("msgNum"+userId)+"";
			}
			// return window.sessionStorage.getItem("msgNum"+userId)+"";
		},
		userInfo:function(item){
			console.log(item);
			if(item.isRoom==1){
				let thisRoom=this.$store.state.myRooms[item.jid];
				this.$router.push({path:'/RoomInfo',query:{room:thisRoom}})
			}else{
				this.$router.push({path:'/UserInfo',query:{userId:item.jid}});
			}
		},
		goNewFriend:function(){
			this.$router.push({path:'/NewFriend'});
		}
	},
	mounted() {
		this.$emit("IndexTo",true);
	},
	components: {
    Tabbar,
    TabbarItem,
    Group,
    Cell,
	XHeader,
	Flexbox,
	Badge,
	FlexboxItem

  }
};
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
	.tabberWarp_index{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background: #fff;
	}
	.friendsImg{
		width: 45px;
		height: 45px;
		margin-right: 9px;
		margin-left: 14px;
		margin-bottom: 3px;
		margin-top: 7px;
		border-radius: 100%;
	}
	.badgeClass{
		/* float: right;
		margin-left: 50px;
		margin-left: -30px; */
	}
	.header{
		position: fixed;
		top: 0;
		z-index: 1;
		width: 100%;

	}
	.line-limit-length {
		max-width: 200px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin: 0;
	}
.imageS	.vux-flexbox {
    text-align: left;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    display: -webkit-flex;
    box-align: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}
.imageS {
	background:#fff
}
</style>
