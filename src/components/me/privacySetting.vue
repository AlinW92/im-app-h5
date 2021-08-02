<!-- 隐私设置 -->
<template>
	<div id="pri">
		<x-header style="background:#55BEB7">隐私设置</x-header>
		<group>
			<x-switch title="允许加好友" v-model="allowAtt"></x-switch>
			<x-switch title="需要好友验证" v-model="friendsVerify"></x-switch>
			<x-switch title="消息加密传输" v-model="isEncrypt"></x-switch>
			
		</group>
		<div style="margin-top: 50px;">
			<x-button type="primary" @click.native="saveSetting" style="background:#55BEB7;width: 95%;color: white;margin-top: 10%;">保存</x-button>
			<!-- <x-button type="warn">清除本地数据</x-button> -->
		</div>
		<div v-transfer-dom>
		  <alert v-model="show">{{Please}}</alert>
		</div>
	</div>
	
</template>

<script>
import { AlertModule,Alert,TransferDomDirective as TransferDom } from 'vux'
import {XHeader,XSwitch,Group,XButton} from 'vux'
import apiServer from '../../public/apiServer.js'
	export default {
		name:"PrivacySetting",
		directives:{
			TransferDom
		},
		created() {
			if(apiServer.isNull(window.sessionStorage.getItem("access_token"))){
				window.location.href = "/mobileWeb";}
			console.log("页面加载中");
			var Setting = JSON.parse(window.sessionStorage.getItem("Usersetting"));
			this.allowAtt = Setting.allowAtt == 1?true:false;
			this.friendsVerify = Setting.friendsVerify == 1?true:false;
			this.isEncrypt = Setting.isEncrypt == 1?true:false;
		},
		data(){
			return {
				allowAtt:false,
				friendsVerify:false,
				isEncrypt:false,
				show:false,
				Please:''
			}
		},
		methods:{
			saveSetting:function(){
				var that=this;
				console.log(that.isEncrypt);
				apiServer.postData({
					url:'/user/settings/update',
					data:{
						allowAtt:that.allowAtt==true?1:0,
						friendsVerify:that.friendsVerify==true?1:0,
						isEncrypt:that.isEncrypt == true?1:0
					}
				},function(data){
					// console.log('aaa');
					if(data.resultCode==1){
						that.Please='修改成功';
						that.show=true;
						window.sessionStorage.setItem("Usersetting",JSON.stringify(data.data.settings));
					}
				})
			}
		},
		components:{
			XHeader,
			XSwitch,
			Group,
			XButton,
			Alert
		}
	}
</script>

<style>
#pri .vux-header .vux-header-left .left-arrow:before{
	    border: 1px solid #fff;
			    border-width: 1px 0 0 1px;
}
 #pri .vux-header .vux-header-left a{
	 float: left;
    margin-right: 8px;
    color: #fff;
 }
</style>
