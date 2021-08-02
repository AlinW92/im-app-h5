
<template>
	<div id="roomPublic">
		<div class="head">
			<x-header style="background:#55BEB7">群公告<div @click="sendNotice" slot="right" style='color:white;font-size:14px'>发布</div></x-header>
		</div>
		<div style="margin-top:46px;">
			<div class="roomPublicList">
				<mt-cell-swipe v-for="item in roomInfo.notices"  class="publicItem" :right="[
                {
                    content: '删除',
                    style: { background: 'red', color: '#fff'},
                    handler: () => deleteSection(item)
                }
            ]" title="">
						<div style="border-bottom:1px #eee solid;" class="itemTop">
					<div>
						<img :src="item.avatar" :onerror="imgError" alt="">
						<span>{{item.nickname}}</span>
					</div>
					<div style="justify-content:flex-end;font-size:12px">{{timeFuntion(item.time)}}</div>
				</div>
				<div style='display:flex;justify-content:flex-start;padding:5px;font-size:14px'>{{item.text}}</div>
				</mt-cell-swipe>	
	
		</div>

		<div class="publicHide"  @click="hideModify" v-if="ifShow">
			<div class="hideInner" @click.stop="">
				<div style="height:45px;line-height:45px;font-size:14px;color:gray;">发布公告</div>
				<div class="inputStyle"><textarea v-model="NoticeContent" name="" id=""></textarea></div>
				<div class="comfirmBtn">
					<div style="text-align:center;height:40px;line-height:40px;border-right:1px solid #ccc" @click="cancelSend">取消</div>
					<div style="text-align:center;height:40px;line-height:40px;color:#55BEB7" @click="sendBtn">发送</div>
				</div>
			</div>
		</div>
		</div>
		<toast v-model="showToast3" toast-content-font-size='12px' type="text" position="bottom">群主或管理员才有权限操作</toast>
	</div>
</template>

<script>
import {XHeader,XButton,Toast,Group,Cell,XSwitch,Alert,TransferDomDirective as TransferDom} from 'vux'
import apiRequest from '../../public/apiRequest.js'
import apiServer from '../../public/apiServer.js'
import store from '../../store'

let token = sessionStorage.getItem('access_token');
export default {
	name:'roomPublic',
	inject:['reload'],
	created(){
			for(let i= 0;i<this.roomInfo.notices.length;i++){
			this.roomInfo.notices[i].avatar = apiServer.getAvatarUrl(this.roomInfo.notices[i].userId)
			}
		store.commit("setRoomInfo",this.roomInfo);
		// console.log(this.roomInfo,11)
		this.isRole = this.roomInfo.member.role
		// console.log(this.isRole)
	},
	mounted(){
	
	},
	computed:{
		timeFuntion(){
				return function(time){
					return apiServer.toDate(time)
				}
		}
	},
    methods:{
			deleteSection(item){
				
				// console.log(item)
				let noticeId = item.id
					let that = this

			apiServer.postData({
				url:'/room/notice/delete',
				data:{
					roomId:that.roomInfo.id,
					access_token:token,
					noticeId:noticeId
				}
			},function(data){
				console.log(data)
				apiRequest.getRoom(that.roomInfo.id,function(result){
				store.commit("setRoomInfo",result.data);
				that.reload()
		
			})
			})
					
			
			},
		// 取消发布公告
		cancelSend(){
			this.ifShow = false
		},
		// 发布公告
		sendBtn(){
			let that = this
			apiServer.postData({
				url:'/room/update',
				data:{
					roomId:that.roomInfo.id,
					access_token:token,
					notice:that.NoticeContent
				}
			},function(data){
				// console.log(data)
				apiRequest.getRoom(that.roomInfo.id,function(result){
				// console.log(2,result.data.notices,result.data.notices.length);
				// for(var i= 0;i< result.data.notices.length;i++){
				// 	that.roomInfo.notices[i].avatar = apiServer.getAvatarUrl(result.data.notices[i].userId)
				// }
				store.commit("setRoomInfo",result.data);
				// console.log(3,that.roomInfo)
				// console.log(that.$store.state.roomInfo)
				// that.roomInfo.notices.splice(0,that.roomInfo.notices.length - 1)
				// that.roomInfo = result.data
				that.ifShow = false
				that.reload()
				// that.$forceUpdate();
				// that.$router.push("/roomPublic")
			})
					
			})
		},
		// 点击发布
		sendNotice(){
			if(this.isRole == 3){
				this.showToast3 = true
			}else{
				this.ifShow = true
			}
		},
		// 点击外部取消发布
		hideModify(){
			this.ifShow = false
		},
		
    },
	data(){
		return{
			roomInfo:this.$store.state.roomInfo,
			ifShow:false,
			NoticeContent:"",
			imgError:'this.src="' + require('../../assets/download.png') + '"',
			isRole:null,
			showToast3:false,
			NoticeId:null
			
		}
	},

	components:{
		XHeader,
		XButton,
		Group,
		Cell,
		XSwitch,
		Alert,
		Toast,
	}
}
</script>

<style>
#roomPublic .mint-cell-title{
	display:none
}
#roomPublic .mint-cell-swipe-button {
    height: 100%;
    display: inline-block;
    padding: 0 10px;
    line-height: 74px;
}
#roomPublic .mint-cell {
    background-color: #fff;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: inherit;
    min-height: 70px;
    display: block;
    overflow: hidden;
    position: relative;
    text-decoration: none;
}
#roomPublic .mint-cell-value {
    color: #888;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    /* align-items: center; */
    width: 100%;
		flex-direction:column;
		align-items:flex-start
}
.head{
	position: fixed;
		top: 0;
		z-index: 1;
		width: 100%;
}
.roomPublicList {
	padding:10px;
}
.publicItem {
	background:white;
	border-radius: 5px;
	margin-bottom:15px;
}
.itemTop {
	width:100%;
	display: flex;
	padding:6px
}
.itemTop div {
	flex:1;
	display: flex;
	align-items: center;
	font-size: 15px

}
.itemTop img {
	width: 35px;
	height:35px;
	border-radius: 35px;
	margin-right: 8px
}
.publicHide {
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
.hideInner{
	width: 270px;
	background:white;
	border-radius: 10px;
	/* padding:10px 20px; */
}
.hideInner div {
	width: 100%;
}
.inputStyle {
	margin-bottom: 20px;
	display: flex;
}
.inputStyle textarea{
	flex: 1;
	border-width:0;
	background:#eee;
	border-radius: 3px;
	margin:0 10px;
}
.comfirmBtn {
	display: flex;
	font-size: 14px;
	border-top: 1px solid #ccc
}
.comfirmBtn div {
	flex:1
}
</style>
