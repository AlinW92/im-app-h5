<template>
	<div id="seleP">
		<div class="header">
			<x-header style="background:#55BEB7">选择好友<button class="SelBtn" style="color:white" slot="right" @click="selectOK">确定</button></x-header>
		</div>
		<div style="margin-top: 45px;">
			<flexbox v-for="item in items" style="border-top: 1px solid #D9D9D9;background:white" @click.native="select(item)">
				<!-- <input :id=item.toUserId  type="checkbox" class="weui-check" :value=item.toUserId> -->
				<check-icon :value.sync="item.show" @click.native="preventDefault(item)">
					&nbsp;
				</check-icon>
				<img :src=item.avatar class="friendsImg" style='margin-left:0' :onerror="imgError">
				<span>{{item.toNickname}}</span>
			</flexbox>
		</div>
	</div>
</template>

<script>
import {XHeader,Flexbox,CheckIcon} from 'vux'
import apiServer from '../../public/apiServer.js'
var selectUserList=[];
export default {
	name:'addRoom_selectUser',
	created(){
		if(apiServer.isNull(window.sessionStorage.getItem("access_token"))){
			window.location.href = "/mobileWeb";
		}
		this.items = this.$store.state.friendsMap;
		
		for(var key in this.items){
			this.items[key].show = false
		}
		for(let n=0;n<selectUserList.length;n++){
			this.items[selectUserList[n]].show=false;
		}
		selectUserList=[];
	},
	data(){
		return{
			items:[],
			imgError:'this.src="' + require('../../assets/download.png') + '"'
		}
	},
	methods:{
		preventDefault(item){
			item.show = !item.show
		},
		select:function(item){
			console.log(item);
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
			console.log(selectUserList);
			this.$forceUpdate();
// 			if($("#"+value).prop("checked")){
// 				$("#"+value).prop("checked",false);
// 				console.log($("#"+value)[0].checked)
// 				for(var i = 0; i < selectUserList.length; i++) {
// 				    if(selectUserList[i] == value) {
// 				     selectUserList.splice(i, 1);
// 				     break;
// 				    }
// 				 }
// 			}else{
// 				$("#"+value).prop("checked",true);
// 				selectUserList.push(value);
// 			}
		},
		selectOK:function(){
			console.log(selectUserList)
			this.$router.push({path:'/addRoom',query:{list:selectUserList}})
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
.SelBtn {
	background:#1AAD19;
	border:none;
	padding:4px 6px;
	color:white;
	border-radius: 5px;
}
#seleP .vux-header .vux-header-left .left-arrow:before{
	border: 1px solid #fff;
	border-width: 1px 0 0 1px;
}
 #seleP .vux-header .vux-header-left a{
	 float: left;
    margin-right: 8px;
    color: #fff;
 }
</style>
