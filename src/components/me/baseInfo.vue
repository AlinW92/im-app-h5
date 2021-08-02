<!-- 个人基础信息 -->
<template>
	<div id="pInfo">
		<x-header  style="background:#55BEB7">个人信息</x-header>
		<group>
			<cell title="昵称" class="cellHeight" align="left"><x-input v-model="nickName"></x-input></cell>
			<popup-radio title="性别" :options="sexList" v-model="sex" class="cellHeight" @on-change="sexChange" align="left"></popup-radio>
			<datetime title="出生日期" v-model="birthday" class="cellHeight" @on-change="dataChange" align="left"></datetime>
			<!-- <x-address title="居住地" placeholder="sss" :list="addressData" @on-shadow-change="addressChange" align="left"></x-address> -->
			<cell title="手机号" class='cellHeight' align="left">{{telephone}}</cell>
		</group>
		<div>
			<x-button @click.native="update" style="background:#55BEB7;width: 95%;color: white;margin-top: 10%;">更新</x-button>
		</div>
		<div v-transfer-dom>
		  <alert v-model="show">{{Please}}</alert>
		</div>
	</div>
</template>

<script>
import {XHeader,Group,Cell,XButton,Datetime,XAddress,ChinaAddressV4Data ,PopupRadio,XInput,Alert } from 'vux'
import apiServer from '../../public/apiServer.js'
import apiRequest from '../../public/apiRequest.js'
	export default {
		name:"BaseInfo",
		created() {
			if(apiServer.isNull(window.sessionStorage.getItem("access_token"))){
				window.location.href = "/mobileWeb";
			}
			apiRequest.getUser(window.sessionStorage.getItem("userId"),function(result){
				console.log(result);
			})
			console.log("页面加载中");
			console.log(window.sessionStorage.getItem("userId"));
			console.log(window.sessionStorage.getItem("birthday"));
			this.nickName=window.sessionStorage.getItem("nickName");
			this.sex = window.sessionStorage.getItem("sex")==1?'男':'女'
			var aaa=apiServer.toDate(window.sessionStorage.getItem("birthday"));
			this.birthday = aaa;
			this.telephone = window.sessionStorage.getItem("telephone");
		},
		data(){
			return{
				value:['2017-01-15', '03', '05'],
				sex:'',
				sexList:['男','女'],
				addressData:ChinaAddressV4Data,
				birthday:'',
				nickName:'',
				telephone:'',
				Please:'更新成功',
				show:false
			}
		},
		methods:{
			dataChange:function(value){
				console.log("dataCheng "+value);
			},
			sexChange:function(value){
				console.log("sexCheng "+value);
			},
			addressChange:function(value){
				console.log("addressCheng "+value);
			},
			update:function(){
				console.log(this.nickName);
				console.log(Date.parse(this.birthday)/1000);
				console.log(this.sex);
				let that = this;
				let params={
					birthday:apiServer.toTimestamp(this.birthday),
					sex:this.sex=="女"?0:1,
					nickname:this.nickName
				}
				apiRequest.updateUser(params,function(result){
					that.show = true;
					if(result.resultCode==1){
						console.log(result.data.birthday);
						window.sessionStorage.setItem("birthday",JSON.stringify(result.data.birthday));
						window.sessionStorage.setItem("sex",JSON.stringify(result.data.sex));
						window.sessionStorage.setItem("nickName",result.data.nickname);
					}else{
						that.Please = "更新失败";
					}

				})
			}
		},
		components:{
			XHeader,
			Group,
			Cell,
			XButton,
			Datetime,
			XAddress,
			ChinaAddressV4Data,
			PopupRadio ,
			XInput ,
			Alert
		}
	}
</script>

<style>
	a{
		text-decoration:none;
	}
	.cellHeight{
		height: 30px;
	}
#pInfo .vux-header .vux-header-left .left-arrow:before{
	border: 1px solid #fff;
	border-width: 1px 0 0 1px;
}
 #pInfo .vux-header .vux-header-left a{
	 float: left;
    margin-right: 8px;
    color: #fff;
 }
 #pInfo .weui-input {
    width: 100%;
    border: 0;
    outline: 0;
    -webkit-appearance: none;
    background-color: transparent;
    font-size: inherit;
    color: inherit;
    height: 1.41176471em;
    line-height: 1.41176471;
	text-align: right
}
</style>
