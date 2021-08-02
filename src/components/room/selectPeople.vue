<template>
	<div id="seleRelative">
		<div class="header">
			<x-header  style="background:#55BEB7">选择联系人<button class="seleBtn" slot="right" @click="sendCard">确定</button></x-header>
		</div>
		<div style="margin-top: 45px;">
			<flexbox v-for="item in items" style="background:white;border-top: 1px solid #D9D9D9;" @click.native="select(item)">
				<!-- <input :id=item.toUserId  type="checkbox" class="weui-check" :value=item.toUserId style="margin-left: 10px;"> -->
				<check-icon :value.sync="item.show">
					&nbsp;
				</check-icon>
				<img :src='item.avatar' style="border-radius:100%" class="friendsImg showimgBackground" :onerror='imgError'>
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
import {XHeader,Flexbox,CheckIcon} from 'vux'
import msgRequest from '../../public/msgRequest.js'
import apiServer from '../../public/apiServer.js'
import WEBIM from '../../public/webim.js'
import store from '../../store'

export default {
	name:'selectPeople',
	created(){
	this.selectUserList2='';
	// console.log(this.roomSelect)
	if(apiServer.isNull(window.sessionStorage.getItem("access_token"))){
	window.location.href = "/mobileWeb";
	}
		WEBIM.initWebIM(apiServer.sysConfig.xmppUrl,window.sessionStorage.getItem("userId"),window.sessionStorage.getItem("nickName"),WEBIM.resource,window.sessionStorage.getItem("password"),6,apiServer.sysConfig.xmppDomain);
		console.log("进入发送名片2");
		this.items = this.$store.state.friendsMap;
		console.log(111,this.items)
		// console.log(selectUserList);
		for(var key in this.items){
			this.items[key].show = false
		}
		console.log(3)
		this.selectUserList2=[];
		// this.$forceUpdate();
		
	},
	data(){
		return {
			items:[],
			hobby2:false,
			demo1:false,
			roomSelect:false,
			selectUserList2:[],
			isCheck:false,
			imgError:'this.src="' + require('../../assets/download.png') + '"'
		}
	},
	methods:{
		select:function(item){
			this.isCheck = true
			// console.log(item);
			if(!apiServer.isNull(item.show)&&item.show==true){
				item.show=false;
				for(var i = 0; i < this.selectUserList2.length; i++) {
				    if(this.selectUserList2[i] == item.toUserId) {
				     this.selectUserList2.splice(i, 1);
				     break;
				    }
				 }
			}else{
				console.log(item.toUserId)
				// console.log()
				// this.selectUserList2=JSON.parse(this.selectUserList2);
				if(this.selectUserList2.length==0){
					this.selectUserList2.push(item.toUserId);
				}else{
					this.selectUserList2=JSON.parse(this.selectUserList2);
					this.selectUserList2.push(item.toUserId);
	
				}	
                this.selectUserList2 = JSON.stringify(this.selectUserList2)
				item.show=true;
			}
			// console.log(selectUserList);
			this.$forceUpdate();
		},
		sendCard:function(){
			let that = this
         let token = sessionStorage.getItem('access_token');
            apiServer.postData({
                url:'/room/member/update',
                data:{
                    access_token:token,
                    roomId:that.$route.query.roomId,
                    text:that.selectUserList2
                }
            },function(data){
            // console.log(1)
			console.log(data)
				for(let i = 0;i<that.items.length;i++){
					that.items[i].show = false
				}
            })
            this.$router.go(-1);
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
