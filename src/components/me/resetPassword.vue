<!-- 修改密码 -->
<template>
	<div id="passw">
		<x-header  style="background:#55BEB7">修改密码</x-header>
		<x-input style="background:white" type="password" placeholder="请输入旧密码" v-model="oldPassword"></x-input>
		<x-input style="background:white" type="password" placeholder="请输入新密码" v-model="newPassword"></x-input>
		<x-input style="background:white" type="password" placeholder="确认新密码" v-model="qurePassword"></x-input>
		<div style="margin-top: 50px;">
			<x-button type="primary" @click.native="update" style="background:#55BEB7;width: 95%;color: white;margin-top: 10%;">修改密码</x-button>
		</div>
		<div v-transfer-dom>
		  <alert v-model="show" @on-hide="relogin">{{Please}}</alert>
		</div>
	</div>
</template>

<script>
import {XHeader,XInput,XButton,Alert,TransferDomDirective as TransferDom} from 'vux'
import { md5 } from 'vux'
import apiServer from '../../public/apiServer.js'
import apiRequest from '../../public/apiRequest.js'
	export default {
		name:"ResetPassword",
		directives:{
			TransferDom
		},
		data(){
			return {
				oldPassword:'',
				newPassword:'',
				qurePassword:'',
				show:false,
				Please:''
			}
		},
		created(){
			if(apiServer.isNull(window.sessionStorage.getItem("access_token"))){
				window.location.href = "/mobileWeb";
			}
		},
		methods: {
			relogin(){
				window.location.href = "/mobileWeb";
			},
			update:function(){
				if(apiServer.isNull(this.oldPassword)||apiServer.isNull(this.newPassword)||apiServer.isNull(this.qurePassword)){
					this.Please = "请输入值";
					this.show = true;
					return;
				}
				if(this.newPassword.length<6){
					this.Please = "密码长度必须大于6位";
					this.show = true;
					return;
				}
				if(this.newPassword!=this.qurePassword){
					this.Please = "两次输入密码不一致";
					this.show = true;
					return;
				}
				if(this.newPassword==this.oldPassword){
					this.Please = "新密码和旧密码不能一致";
					this.show = true;
					return;
				}
				var that =this;
				var obj={
					oldPassword:md5(that.oldPassword),
					newPassword:md5(that.newPassword),
					password1:md5(that.qurePassword)
				}
				
// 				if(apiServer.isNull(obj.oldPassword)||apiServer.isNull(obj.newPassword)||apiServer.isNull(obj.qurePassword)){
// 					this.Please = "请输入值";
// 					this.show = true;
// 					return;
// 				}
				apiRequest.updatePassword(obj,function(result){
					// console.log(result);
					if(result.resultCode==1){
						that.Please="修改成功";
						that.show = true;
					}
				});
			}
		},
		components:{
			XHeader,
			XInput,
			XButton,
			Alert
		},
	
	}
</script>

<style>
#passw .vux-header .vux-header-left .left-arrow:before{
	    border: 1px solid #fff;
			    border-width: 1px 0 0 1px;
}
 #passw .vux-header .vux-header-left a{
	 float: left;
    margin-right: 8px;
    color: #fff;
 }
</style>
