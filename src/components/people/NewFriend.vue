<template>
	<div>
		<div class="header">
			<x-header  style="background:#55BEB7">新的朋友</x-header>
		</div>
		<div style="margin-top: 45px;background:white;">
			<flexbox v-for="(item,index) in items" style="border-top: 1px solid #D9D9D9;">
				<div>
					<img :src=item.avatar alt="" style="margin-left:15px;margin-right:10px;border-radius:100%" class="BlackListImg" :onerror='imgError'>
				</div>
				<flexbox orient="vertical" :gutter="0">
					<flexbox-item>{{item.toNickname}}</flexbox-item>
					<flexbox-item v-if="item.type==508">
						<p class="p_style">已互为好友</p>
					</flexbox-item>
					<flexbox-item v-if="item.type==500&&item.direction==0">
						<p class="p_style">等待对方验证</p>
					</flexbox-item>
					<flexbox-item v-if="item.type==501&&item.direction==0">
						<p class="p_style">已互为好友</p>
					</flexbox-item>
					<flexbox-item v-if="item.type==502&&item.direction==0">
						<p class="p_style">{{item.content}}</p>
						<div style="float: right;margin-top: -15px;">
							<!-- <x-button style="width: 70px;display: inline;font-size: 10px" @click.native="acceptFriends(item.toUserId,item.toNickname)">同意</x-button> -->
							<x-button style="width: 70px;display: inline;font-size: 10px;"@click.native="setAnswer(item.toUserId,item.toNickname)">回复</x-button>
						</div>
					</flexbox-item>
					<flexbox-item v-if="item.type==503&&item.direction==0">
						<p class="p_style">等待验证</p>
					</flexbox-item>
					<flexbox-item v-if="item.type==504&&item.direction==0">
						<p class="p_style">已取消好友</p>
					</flexbox-item>
					<flexbox-item v-if="item.type==505&&item.direction==0">
						<p class="p_style">已删除</p>
					</flexbox-item>
					<flexbox-item v-if="item.type==507&&item.direction==0">
						<p class="p_style"></p>
					</flexbox-item>
					<flexbox-item v-if="item.type==500&&item.direction!=0">
						<!-- <p class="p_style">已互为好友</p> -->
						<div style="float: right;margin-top: -30px;">
							<x-button style="width: 70px;display: inline;font-size: 10px" @click.native="acceptFriends(item.toUserId,item.toNickname)">同意</x-button>
							<x-button style="width: 70px;display: inline;font-size: 10px" @click.native="setAnswer(item.toUserId,item.toNickname)">回复</x-button>
						</div>
					</flexbox-item>
					<flexbox-item v-if="item.type==501&&item.direction!=0">
						<p class="p_style">已互为好友</p>
					</flexbox-item>
					<flexbox-item v-if="item.type==502&&item.direction!=0">
						<p class="p_style">{{item.content}}</p>
						<div style="float: right;margin-top: -15px;">
							<x-button style="width: 70px;display: inline;font-size: 10px" @click.native="acceptFriends(item.toUserId,item.toNickname)">同意</x-button>
							<x-button style="width: 70px;display: inline;font-size: 10px;" @click.native="setAnswer(item.toUserId,item.toNickname)">回复</x-button>
						</div>
					</flexbox-item>
					<flexbox-item v-if="item.type==503&&item.direction!=0">
						申请加我为好友
						<x-button>加好友</x-button>
					</flexbox-item>
					<flexbox-item v-if="item.type==504&&item.direction!=0">
						<p class="p_style">被取消了好友</p>
						<div style="float: right;margin-top: -30px;">
							<x-button style="width: 70px;display: inline;font-size: 10px" @click.native="addpeople(item)">加好友</x-button>
						</div>

					</flexbox-item>
					<flexbox-item v-if="item.type==505&&item.direction!=0">
						<p class="p_style">被取消了好友</p>
						<div style="float: right;margin-top: -15px;">
							<x-button style="width: 70px;display: inline;font-size: 10px" @click.native="addFriend(item.toUserId,index)">加好友</x-button>
						</div>
					</flexbox-item>
					<flexbox-item v-if="item.type==507&&item.direction!=0">
						<p class="p_style">已被拉黑</p>
					</flexbox-item>
					<!-- <flexbox-item v-if="item.type==509">
						<p></p>
					</flexbox-item> -->
				</flexbox>

				<!-- <img :src=item.avatar alt="" class="BlackListImg" @error='imgError(item)'>
				<p>{{item.toNickname}}</p> -->

			</flexbox>
		</div>
		<div v-transfer-dom>
		  <alert v-model="show">{{Please}}</alert>
		</div>
			<div class="modifyRoomName" v-if="ifShowAnswer" @click="hideModify">
			<div class="innerModify" @click.stop="">
			<div style="color:gray;padding:0px 0 10px;font-size:15px;display:flex;justify-content:center">回话</div>
			<div class="otherName">
				<div class="inputModify">请输入回复</div>
				<input type="text" placeholder="回复" v-model="answer">
			</div>
			<div @click="comfirmAnswer" style="background:#55BEB7;color:white;padding:5px;margin-top:20px;display:flex;justify-content:center">确定</div>
		</div>
	</div>
	</div>
</template>

<script>
import {XHeader,Flexbox, FlexboxItem,Alert,TransferDomDirective as TransferDom} from 'vux'
import apiRequest from '../../public/apiRequest.js'
import apiServer from '../../public/apiServer.js'
import msgRequest from '../../public/msgRequest.js'
import store from '../../store'
export default {
	name:"NewFriend",
	inject:['reload'],
	directives:{
		TransferDom
	},
	created(){
		let that = this
		// this.NewMessage = store.state.newFriendMsgList
		// if(apiServer.isNull(that.NewMessage)){
		// 	window.location.href = "/mobileWeb";
		// }
		console.log("新的朋友");
		store.commit("setOpenUserId","newfriend");
		apiRequest.getNewFriendsList(null,null,function(data){

			console.log(data,45456355)
			// console.log(data);
			if(!apiServer.isNull(that.NewMessage)){
				let list=JSON.parse(that.NewMessage);
				let set=[];
				console.log(data)
				for(let i=0;i<list.length;i++){
					// if(!apiServer.isNull(list[i+1])){
					// 	if(list[i].fromUserId==list[i+1].fromUserId){
					// 		continue;
					// 	}
					// }
					list[i].avatar = apiServer.getAvatarUrl(list[i].fromUserId);
					list[i].toNickname = list[i].fromUserName;
					list[i].toUserId = list[i].fromUserId;
					set.push(list[i]);
				}
				let newList = set.concat(data);
				let allList=[];
				console.log("newList.length")
				console.log(1,newList)
				for(let j=0;j<newList.length;j++){
					if(newList[j].type==511){
						continue;
					}
					newList[j].timeSend = newList[j].timeSend || newList[j].modifyTime
					var flag = true;
				　　for(var i=0;i<allList.length;i++){
				　　　　if(newList[j].toUserId*1 == allList[i].toUserId*1){
							if(newList[j].timeSend > allList[i].timeSend){
								allList[i] = newList[j]
								console.log(allList[i],1)
							}
							flag = false
				　　　　　　
				　　　　};
				　　};
				　　if(flag){
						allList.push(newList[j]);
				　　};
					// if(!apiServer.isNull(newList[j+1])){

					// 	if(newList[j].toUserId==newList[j+1].toUserId){
					// 		continue;
					// 	}
					// }
					// allList.push(newList[j]);
				}
				console.log(2,allList);
				that.items = allList;
				// window.sessionStorage.setItem("newFriendMsgList",[]);
			}else{
				let lastList=[];
				for(let n=0;n<data.length;n++){
					if(!apiServer.isNull(data[n+1])){
						if(data[n].toUserId==data[n+1].toUserId){
							continue
						}
					}
					lastList.push(data[n]);
				}
				that.items =lastList;
			}
			let newFriendsList=JSON.parse(window.sessionStorage.getItem("newFriendsList"));
			for(let i = 0;i<newFriendsList;i++){
				for(let j=0;j<that.items.length;j++){
					if(newFriendsList[i].userId == that.items[j].userId){
						that.items[j].direction = newFriendsList[i].direction
						return
					}
				}
			}
			window.sessionStorage.setItem("sysMsgNum",window.sessionStorage.getItem("sysMsgNum")-window.sessionStorage.getItem("peoMsgNum"));
			window.sessionStorage.setItem("peoMsgNum",0);
		})
	},
	data(){
		return{
			items:[],
			show:false,// 是否显示弹窗
			Please:'',// 弹窗提示文字
			ifShowAnswer:false,
			answer:"",// 回话内容
			toUserId:'',// 回话给谁#id
			toNickname:'',// 回话给谁name
			imgError:'this.src="' + require('../../assets/download.png') + '"'
		}
	},
	watch:{
		NewMessage(newVal,oldVal){
			console.log("打印新旧val",newVal,oldVal)
		}
	},
	computed:{
		NewMessage(){
			console.log("监听总的消息数量")
			// console.log(this.$store.state.friendsMsgNum)
			return store.state.newFriendMsgList;
		}
	},
	methods:{
		addpeople(){

		},
		// 点击回复跳出弹框
		setAnswer(toUserId,toNickname){
			this.ifShowAnswer = true;
			this.toUserId = toUserId;
			this.toNickname = toNickname;
		},
		// 确定回话
		comfirmAnswer(){
			this.ifShowAnswer = false;
			console.log(this.answer);
			console.log(this.toUserId);
			msgRequest.sendMessage(502,null,null,null,this.answer,this.toUserId,this.toNickname);
		},
		// 点击外部取消回复
		hideModify(){
			this.ifShowAnswer = false;
		},
		// 同意加好友
		acceptFriends:function(userId,nickname){
			console.log(userId);
			let that = this;
			//维护消息列表
			let lastChatList = store.state.lastChatList
			let newFriendMsg = apiServer.getOneMsg(userId,nickname,"我们成为好朋友了，快来聊天吧",508,0)
			lastChatList.unshift(newFriendMsg)
			store.commit('setLastChatMsg',lastChatList)
			//维护通讯录
			apiRequest.addFriend(userId,nickname,function(result){
				console.log(result);

				that.Please = result.resultMsg;
				that.show = true;
				apiRequest.getMyFriends(function(){
					that.$router.go(-1)
				})
				that.reload()
			});
		},
		// 加好友
		addFriend:function(userId,index){
			let that = this;
			apiRequest.getUser(userId,function(result){
				console.log(result)
				if(result.settings.friendsVerify==1){
					// 需要好友验证
					let content = "你好"
					let msg=msgRequest.sendMessage(500,null,null,null,content,result.userId,result.nickname);
					if(!apiServer.isNull(msg)){
						that.Please ="打招呼成功，静候回音";
						that.show = true;
						// that.reload()
						that.items[index].type = 500
						that.items[index].direction = 0
						// Vue.set(that.items[index],'type', 500)
						// Vue.set(that.items[index],'direction', 0)
					}

				}else{
					console.log("无好友验证");
					//通讯录
					let outResult = result
					apiRequest.addFriend(result.userId,result.nickname,function(result){
						console.log(result);
						if(result.resultCode==1){
							// that.Please=result.resultMsg;//此接口没有该返回值
							that.Please="添加成功";
							that.show = true;
							// that.reload()
							that.items[index].direction = 0
							//存放新朋友信息，更新到消息列表
							let lastChatList = store.state.lastChatList
							let newFriendMsg = apiServer.getOneMsg(outResult.userId,outResult.nickname,"我们成为好朋友了，快来聊天吧",508,0)
							lastChatList.unshift(newFriendMsg)
							store.commit('setLastChatMsg',lastChatList)
						}
					});
				}
			})

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
	.header{
		position: fixed;
		top: 0;
		z-index: 1;
		width: 100%;

	}
	.BlackListImg{
		width: 50px;
		height:50px;
		margin-right: 5px;
		margin-left: 5px;
		margin-bottom: 5px;
		margin-top: 5px;
	}
	.p_style{
		color:gray;
		font-size:13px;
		display: inline
	}
		.modifyRoomName {
		width: 100%;
		height:100%;
		background:rgba(0, 0, 0, .4);
		position:absolute;
		left: 0;
		top:0;
		right:0;
		left:0;
		display: flex;
		justify-content: center;
		align-items: center
	}
	.innerModify {
		width: 280px;
		height: 170px;
		background:white;
		border-radius: 10px;
		padding:10px 20px;
	}
	.otherName {
		background:#eee;
		height:50px;
		padding:10px 8px;
		border-radius: 5px;
		overflow: hidden;
	}
	.otherName input {
		display: block;
		border:none;
		border-bottom: #55BEB7 2px solid;
		background:#eee;
		margin-top: 10px;
	}
	.inputModify {
		font-size: 11px;
		color: #55BEB7;
		font-weight: 600;
	}
</style>
