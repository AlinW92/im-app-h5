<!-- 群组信息 -->
<template>
	<div id="roomInfo">
		<div class="header">
			<x-header style="background:#55BEB7">{{roomInfo}}</x-header>
		</div>
	<div style="position:absolute;left:0;top:46px;right:0">
			<div class="roomMemmber">
			<cell @click.native="getRoomMenber" title="群组成员" style="background:white;height:30px;font-size:13px;padding:5px 15px 0 15px" align="left" is-link>共{{allMember.length}}人</cell>
			<div style="width:100%" class="allMemmber">
				<div class="roomPeople" v-for="item in allMember">
					<img :src='item.avatar' style='width:45px;height:45px' class="showimgBackground" alt="">
					<p>{{item.nickname}}</p>
				</div>
				<div class="roomPeople addy" style="margin-bottom:30px">
					<img @click="selectPeople" src="../../assets/roomadd.png" alt="">
				</div>
				<div class="roomPeople addy"  style="margin-bottom:30px">
					<img @click="deletePeople" src="../../assets/roomlose.png" alt="">
				</div>
			</div>
		</div>
		<group>
			<cell @click.native="ModifyRoomName" title="群组名称" class="cellHeight line-limit" align="left" is-link>{{roomName}}</cell>
			<cell @click.native="ModifyRoomDesc" title="群组说明" class="cellHeight line-limit" align="left" is-link>{{roomDesc}}</cell>
			<cell @click.native="toRoomPublic" title="群内公告" class="cellHeight line-limit" align="left" is-link>{{roomNotic}}</cell>
			<cell title="群共享文件" class="cellHeight" align="left" is-link @click.native="shareFile"></cell>
			<cell v-if="isRole!=3" title="禁言" @click.native="noWords" class="cellHeight" align="left" is-link></cell>
			<x-switch v-if="isRole!=3" title="全员禁言" v-model="allBanned"></x-switch>
			<x-switch v-if="isRole!=3" title="显示已读人数" v-model="showReadNum"></x-switch>
		</group>
		<div style="margin-top: 5%;">
			<x-button v-if="isRole==1" type="warn" style="width: 95%;" @click.native="deleteRoom">解散群组</x-button>
			<x-button v-if="isRole!=1" type="warn" style="width: 95%;" @click.native="quitRoom">退出群组</x-button>
		</div>
		<div v-transfer-dom>
		  <alert v-model="show">{{Please}}</alert>
		</div>
		<div class="modifyRoomName" v-if="ifModifyRoomName" @click="hideModify">
			<div class="innerModify" @click.stop="">
			<div style="color:gray;padding:0px 0 10px;font-size:15px">修改群名</div>
			<div class="otherName">
				<div class="inputModify">请输入备注名</div>
				<input type="text" :placeholder="roomName" v-model="otherName">
			</div>
			<div @click="comfirmModify" style="background:#55BEB7;color:white;padding:5px;margin-top:20px">确定</div>
		</div>
		</div>

			<div class="modifyRoomName" v-if="ifModifyRoomDesc" @click="hideModify">
			<div class="innerModify" @click.stop="">
			<div style="color:gray;padding:0px 0 10px;font-size:15px">修改说明</div>
			<div class="otherName">
				<div class="inputModify">请输入说明</div>
				<input type="text" :placeholder="roomDesc" v-model="otherDesc">
			</div>
			<div @click="comfirmModifydesc" style="background:#55BEB7;color:white;padding:5px;margin-top:20px">确定</div>
		</div>
		</div>
		<toast v-model="showToast1" toast-content-font-size='12px' type="text" position="bottom">群主与群管理员才能修改群名称</toast>
		<toast v-model="showToast2" toast-content-font-size='12px' type="text" position="bottom">群主与群管理员才能修改群说明</toast>
		<toast v-model="showToast3" toast-content-font-size='12px' type="text" position="bottom">群主或管理员才有权限操作</toast>
		<toast v-model="showToast4" toast-content-font-size='12px' type="text" position="bottom">退出成功</toast>
		<toast v-model="showToast5" toast-content-font-size='12px' type="text" position="bottom">解散成功</toast>
	</div>
	</div>
</template>

<script>
import {XHeader,XButton,Group,Cell,XSwitch,Alert,Toast,TransferDomDirective as TransferDom} from 'vux'
import apiRequest from '../../public/apiRequest.js'
import apiServer from '../../public/apiServer.js'
import store from '../../store'
let token = sessionStorage.getItem('access_token');
export default {
	name:'RoomInfo',
	directives:{
		TransferDom
	},
	created(){

		let that = this;
		if(!apiServer.isNull(that.$route.query.room.id)){
			console.log(1)
			that.$store.state.roomId = that.$route.query.room.id
		}
		console.log(that.$store.state.roomId)
		// console.log(this.$route.query.room.id)
		// store.commit("setshowReadNum",that.showReadNum)
		if(!apiServer.isNull(that.$store.state.roomId)){
			console.log("获取群组详情")
			apiRequest.getRoom(that.$store.state.roomId,function(result){
				console.log(result);
				store.commit("setRoomInfo",result.data);
					that.roomName = that.$store.state.roomInfo.name;
					that.roomDesc = that.$store.state.roomInfo.desc;
					that.roomNotic = that.$store.state.roomInfo.notice.text;
					if(apiServer.isNull(that.roomNotic)){
						that.roomNotic = "暂无公告";
					}
					that.isRole = result.data.member.role;
					// console.log(that.isRole);
					that.roomId = result.data.id;
					that.roomJid = result.data.jid;
					that.showReadNum = store.state.showReadNum[that.roomJid]
					// let isReadNum = that.$store.state.showReadNum
					// isReadNum[that.roomJid] = false;
					// store.commit("setshowReadNum",isReadNum)
					// that.showReadNum = isReadNum[that.roomJid]
					that.allMember = result.data.members
				for(let i=0;i<that.allMember.length;i++){
					that.allMember[i].avatar = apiServer.getAvatarUrl(that.allMember[i].userId)
				}
				that.$store.state.allMember = that.allMember

			})

		}

	},
	watch:{
		allBanned(val){
			let that= this
			let time = parseInt((new Date().getTime())/1000)
			if(val){
				 apiServer.postData({
                    url:'/room/update',
                    data:{
                        talkTime:15*24*60*60+time,
                        access_token:token,
                        time:time,
                        roomId:that.roomId
			    }
            },function(data){
                console.log(data)
                // that.ifShowNowords = false
                // that.showToast = true
            })
			}else{
				 apiServer.postData({
                    url:'/room/update',
                    data:{
                        talkTime:0,
                        access_token:token,
                        time:time,
                        roomId:that.roomId
			    }
            },function(data){
                console.log(data)
                // that.ifShowNowords = false
                // that.showToast = true
            })
			}
		},
		showReadNum(val){
			let that = this
			let isReadNum = that.$store.state.showReadNum
			isReadNum[that.roomJid] = val;
			store.commit("setshowReadNum",isReadNum)
			let val2 = 0
			if(val){
				val2 = 1
			}else{
				val2 = 0
			}
			 apiServer.postData({
                    url:'/room/update',
                    data:{
                        access_token:token,
						roomId:that.roomId,
						showRead:val2
			    }
            },function(data){
				console.log(data)

                // that.ifShowNowords = false
                // that.showToast = true
            })

		}
	},
	mounted(){


	},

	data(){
		return{
			roomInfo:'群组信息',
			roomName:'', // 群组名称
			roomDesc:'',// 群组说明
			roomNotic:'',// 群组公告
			allBanned:false,// 全体禁言
			isRole:0,// 角色
			roomId:'',// 群组Id
			roomJid:'',// 群组jid
			show:false,// 是否弹出提示
			Please:'',// 提示内容
			allMember:[],
			ifModifyRoomName:false,
			ifModifyRoomDesc:false,
			otherName:"",
			otherDesc:"",
			showToast1:false,
			showToast2:false,
			showToast3:false,
			showToast5:false,
			showToast4:false,
			showReadNum:store.state.showReadNum[this.roomJid],//显示已读人数
		}
	},
	methods:{

		// 点击禁言
		noWords(){
				this.$router.push({path:"noWords",query:{allMember:this.allMember}})
		},
		// 点击进入群公告
		toRoomPublic(){
				this.$router.push({path:"roomPublic",query:{allMember:this.allMember}})
		},
		// 点击外部隐藏修改弹窗
		hideModify(){
				this.ifModifyRoomDesc = false;
				this.ifModifyRoomName = false;
		},
		// 确定修改群名
		comfirmModify(){

			let that = this
			this.roomName = this.otherName
			this.ifModifyRoomName = false
			apiServer.postData({
			url:'/room/update',
			data:{
				roomId:that.roomId,
				access_token:token,
				roomName:that.roomName
			}
		},function(data){
			console.log(data)
		})


		},
		// 确认修改群说明
		comfirmModifydesc(){
		let that = this
		this.roomDesc = this.otherDesc
		this.ifModifyRoomDesc = false
		apiServer.postData({
			url:'/room/update',
			data:{
				roomId:that.roomId,
				access_token:token,
				desc:that.roomDesc
			}
		},function(data){
			console.log(data)
		})
		},
		// 修改群名
		ModifyRoomName(){
			if(this.isRole==3){
				this.showToast1 = true
		}else{
			this.ifModifyRoomName = true
			}
		},
		// 修改群说明
		ModifyRoomDesc(){
				if(this.isRole==3){
				this.showToast2 = true
		}else{
			this.ifModifyRoomDesc = true
			}
		},
		// 跳转添加群成员界面
		selectPeople(){
			let user = sessionStorage.getItem('userId');
				this.$router.push({path:'/selectPeople',query:{card:user,roomId:this.roomId}});
		},
		// 删除群成员
		deletePeople(){
			let user = sessionStorage.getItem('userId');
			if(this.isRole==3){
					this.showToast3 = true
			}else{
			this.$router.push({path:'/deletePeople',query:{allMember:this.allMember,roomId:this.roomId}});
		}
		},
		// 跳转群成员界面
		getRoomMenber(){
			this.$router.push({path:"room_menber",query:{allMember:this.allMember}})
		},
		// 退出群组
		quitRoom:function(){
			let that = this;
			that.showToast4 = true
			apiRequest.quitRoom(that.roomId,function(result){
				if(result.resultCode==1){
					// that.Please = "退出群组成功";

					// that.show = true;
					let rooms=that.$store.state.rooms;
					let myRooms=that.$store.state.myRooms;
					delete rooms[that.roomId];
					delete myRooms[that.roomJid];
					store.commit("setMyRooms",myRooms);
					store.commit("setRooms",rooms);
					//维护消息列表
					let list = that.$store.state.lastChatList
					for(let i=0;i<list.length;i++){
						if(list[i].jid == that.roomJid){
							list.splice(i,1)
							break
						} 
					}
					that.$store.commit("setLastChatMsg",list)
					//由于退群还会收到一条消息导致角标异常
					let num = parseInt(window.sessionStorage.getItem("sysMsgNum")||0)
					num--
					window.sessionStorage.setItem("sysMsgNum",num)
					setTimeout(function(){
						that.$router.go(-2);
					},600)

				}
			})
		},
		// 解散群组
		deleteRoom:function(){
			let that = this;
			that.showToast5 = true
			apiRequest.deleteRoom(that.roomId,function(result){
				if(result.resultCode==1){

					// that.Please = "解散群组成功";
					// that.show = true;
					let rooms=that.$store.state.rooms;
					let myRooms=that.$store.state.myRooms;
					delete rooms[that.roomId];
					delete myRooms[that.roomJid];
					store.commit("setMyRooms",myRooms);
					store.commit("setRooms",rooms);
					//维护消息列表
					let list = that.$store.state.lastChatList
					for(let i=0;i<list.length;i++){
						if(list[i].jid == that.roomJid){
							list.splice(i,1)
							break
						} 
					}
					that.$store.commit("setLastChatMsg",list)
					setTimeout(function(){
						that.$router.go(-2);
					},600)

				}
			})
		},
		shareFile:function(){
			this.$router.push({path:'/SharedFile',query:{roomId:this.roomId}});
		}
	},
	components:{
		XHeader,
		XButton,
		Group,
		Cell,
		XSwitch,
		Alert,
		Toast
	}
}
</script>

<style>
.showimgBackground{
    display: inline-block;
    height: 45px;
	width: 45px;
    background: url(../../assets/download.png) no-repeat;
	background-size: 45px 45px
    /* margin: 25px 0; */
 }
	.cellHeight{
		height: 30px;
	}
	.allMemmber {
		display:flex;
		flex-wrap: wrap;
		background:white;
		padding:5px 0;
	}
	.roomPeople {
		width:25%;
		/* background:red */
		margin-bottom: 5px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.roomPeople img {
		width: 45px;
		height:45px;
		border-radius: 100%;
	}
	.roomPeople p {
		font-size: 12px;
		margin:0;
		padding:5px 0
	}
	#roomInfo .weui-cells{
	margin-top: 5px;
    background-color: #FFFFFF;
    line-height: 1.41176471;
    font-size: 17px;
    overflow: hidden;
    position: relative;
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
		border-radius: 5px
	}
	.otherName input {
		border:none;
		border-bottom: #55BEB7 2px solid;
		width: 100%;
		background:#eee;

	}
	.inputModify {
		display: flex;
		justify-content: flex-start;
		font-size: 11px;
		color: #55BEB7;
		font-weight: 600;
		margin-bottom: 10px
	}
	#roomInfo .weui-toast.weui-toast_text{
		/* /* font-size: 11px; */
		/* width:170px */
		padding:5px 10px;
		width: 60%;
	}
	.line-limit {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin: 0;
	}
</style>
