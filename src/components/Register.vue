<template>
	<div style="height:100%;background:white;">
		<div class="header">
			<x-header @on-click-back="lastPage"  style="background:#55BEB7">注册用户</x-header>
		</div>
		<div class="headImage">
			<img src="../assets/black.png" alt="">
		</div>
		<div class="resInfo">
			<div>
				<div class="Ylist">
					<img class="resImage" src="../assets/lu.png" alt="">
					<input type="text" placeholder="请输入手机号" v-model="pnumber">
					<!-- <vue-tel-input ref="prefix" @country-changed="countryChanged" placeholder="" style="width:13%;height:24px;position:absolute;left:16%;"></vue-tel-input> -->
				</div>
				<div class="Ylist">
					<img class="resImage" src="../assets/lp.png" alt="">
					<input type="password" placeholder="设置密码" v-model="password" @focus="focusinput">
				</div>
				<div class="Ylist" v-if="showConfig">
					<img class="resImage" src="../assets/ly.png" alt="">
					<input type="text" placeholder="图形码" ref="chart" v-model="giaphicCode">
					<img @click="focusinput" class="backImage"  src="../assets/ic_refre_msg_code(1).png" alt="" style="position:relative;right:-54px">
					<img :src="tel" alt="" style="position:relative;right:60px;width:60px">
				</div>
				<div class="Ylist" v-if="showConfig">
					<img class="resImage" src="../assets/lm.png" alt="">
					<input type="text" placeholder="验证码" v-model="confirm">
					<button class="Ysubmit" @click="ysubmit">发送</button>
				</div>
				<div v-if="Code" style="display:flex;justify-content:flex-end;font-size:13px;margin-top:10px">
					<span @click="pushBaseInfo">收不到验证码？</span>
				</div>
			</div>
		</div>
		<div class="resLater">
			<span @click="resClick">注册</span>
		</div>
		<div>
		  <alert v-model="show">{{showText}}</alert>
		</div>
	</div>
</template>

<script>
import {XHeader,Flexbox, FlexboxItem,Alert,md5} from 'vux'
import apiServer from '../public/apiServer.js'
import axios from 'axios'
import { setTimeout, setInterval, clearInterval } from 'timers';
import apiRequest from '../public/apiRequest';
let timer = null
import Vue from 'vue'
import VueTelInput from 'vue-tel-input'

Vue.use(VueTelInput)

export default {
	name:'Register',
	data(){
		return {
			me:'register',
			pnumber:"",
			password:"",
			chart:"",
			confirm:"",
			show:false,
			showText:"",
			tel:'',
			ifDisable:true,
			Code:false,
			count:0,
			confirmCode:"",
			showConfig:false,
			giaphicCode:"",
			dialCode:"86"
		}
	},
	created(){
		let that = this
		apiRequest.resConfig(function (data) {
			console.log(data,66)
			if(data.data.isOpenSMSCode){
				that.showConfig = true
			}
		})
		// if(apiServer.isNull(window.sessionStorage.getItem("access_token"))){
		// 	window.location.href = "/mobileWeb";
		// }
		$(".Ysubmit").text("发送")
		clearInterval(timer)
	},
	watch:{
		pnumber(){
			this.pnumber = this.pnumber.replace(/\D/g,'')
		},
		giaphicCode(newV,oldV){
			if(newV.length>4){
				this.giaphicCode = oldV
			}
		},
		password(newV,oldV){
			if(newV.length>16){
				this.password = oldV
			}
		}
	},
	methods:{
		countryChanged(obj){
			this.dialCode = obj.dialCode
		},
		lastPage(){
           this.$router.push({path:"/HelloWorld"})
       	},
		resClick(){
			let that = this
			$(".Ysubmit").text("发送")
			console.log(this.confirm)
			// console.log(this.password,this.pnumber,this.chart,this.confirm)
			if(this.pnumber == ""){
				this.showText = "请输入手机号码"
			}else if(this.password == "") {
				this.showText = "请输入密码"
			}else if(this.chart == ""&&this.showConfig==true){
				this.showText = "请输入图形码"
			}else if(this.confirm == ""&&this.showConfig==true){
				this.showText = "请输入验证码"
			}else{
					if(this.showConfig){
						this.chart = this.$refs.chart.value;
					if(this.confirmCode == this.confirm){
						this.showText = "注册成功"
						this.show = true
						this.$router.push({path:'/FunInfo',query:{telephone:this.pnumber,password:md5(this.password)}});
					}else{
						this.showText = "验证码错误"
					}
				}else{
			apiServer.postData({
				url:'/verify/telephone',
				data:{
					telephone:that.pnumber,
					areaCode:that.dialCode
				}
			},function(result){
				if(!result.resultCode){
					that.showText = "手机号码已注册"
					that.show = true
				}else{
					that.showText = "注册成功"
					that.show = true
					that.$router.push({path:'/FunInfo',query:{telephone:that.pnumber,password:md5(that.password)}});
				}
			})
				}

			}
			// this.$router.push({path:'/FunInfo',query:{telephone:this.pnumber,password:md5(this.password)}});
			// this.$router.push("/FunInfo",)
			// this.show = true
		},
		ysubmit(){
			let that = this
			this.password = this.password
			this.chart = this.$refs.chart.value;
			if(this.pnumber == ""){
				this.show = true
				this.showText = "请输入手机号码"
			}else if(this.password == "") {
				this.show = true
				this.showText = "请输入密码"
			}else if(this.chart == ""){
				this.show = true
				this.showText = "请输入图形码"
			}else{
				apiServer.postData({
				url:'/verify/telephone',
				data:{
					telephone:that.pnumber,
					areaCode:that.dialCode
				},
			},function(result){
				// console.log(result.resultCode)
				if(result.resultCode==1){
					// console.log(2)
					apiServer.postData({
					url:'/basic/randcode/sendSms',
					data:{
						version: 1,
						areaCode:that.dialCode,
						imgCode:that.chart,
						telephone:that.pnumber,
						isRegister:0
					}
				},function(data){
					console.log("点击发送返回的数据",data);
					if(data.resultCode == 1){
						that.confirmCode = data.data.code
						// that.confirm = that.confirmCode
						// console.log(that.confirmCode)
						that.showText = "发送成功"
						that.show = true
						// 发送成功后按钮禁用
						that.ifDisable = false
						// that.confirm = that.resultCode
						$(".Ysubmit").attr("disabled", "true");
						// 设置60秒内倒计时发送
						let index = 60
						 timer = setInterval(function(){
							index--
							if(index < 0){
								clearInterval(timer)
								$(".Ysubmit").text("发送")
							}
							if(index == 30){
								that.Code = true
							}
							if(index>=0){
								$(".Ysubmit").text(index)
							}else{
								index = 0
							}
						},1000)
						// 30秒后触发 无法发送验证码？
						setTimeout(function(){
							that.ifDisable = true
						},30000)
						// 60秒后禁用取消，才可重新发送
						setTimeout(function(){
							$(".Ysubmit").removeAttr("disabled")
						},60000)
					}else{
						// 若验证码错误次数超过5次，则30秒后再发送
						that.count++
						that.showText = "验证码错误"
						that.show = true
						// if(that.count >= 5){
						// 	that.showText = "请不要频繁发送验证码,请30秒后再次发送"
						// 	that.show = true
						// 	$(".Ysubmit").attr("disabled", "true");
						// 	// 按钮30秒内禁用
						// 	setTimeout(function(){
						// 		that.count =0
						// 		$(".Ysubmit").removeAttr("disabled");
						// 	},30000)
						// }else{
						// 	that.showText = "图形验证码错误"
						// 	that.show = true
						// }
					}
				})
				}else if(result.resultCode == 1040107){
					that.showText = "手机号已注册"
					that.show = true
				}
			})
		}
		// this.show = true
	},
		focusinput(){
			this.tel = ""
			// 触发验证码刷新
			if(this.pnumber){
				console.log(222);
				this.tel = apiServer.sysConfig.apiUrl +  "/getImgCode?telephone=" + this.dialCode + this.pnumber +"&a=" + Math.random()
			}
		},
		pushBaseInfo(){
			this.$router.push({path:'/FunInfo',query:{telephone:this.pnumber,password:md5(this.password)}});
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
 .headImage{
	 height:30%;
	 display: flex;
	 align-items: flex-end;
	 justify-content: center;
	 padding-bottom:30px;
 }
 .headImage img {
	 width: 100px;
	 height:100px;
 }
 .resInfo{
	 padding: 10px 30px;
 }
input {
	border: none;
	height:34px;
	width: 200px;
	padding-left: 10px;
}
input:focus {
	outline:none;
}
.Ylist {
	border-bottom: #ccc 1px solid;
	padding:5px 0;
	/* background: yellow; */
	display:flex;
	flex-direction: row;
	align-items: center;
	/* justify-content: space-between */
}
.resImage {
	width: 30px;
	height:30px;
}
.backImage {
	position:relative;
	left:35px;
	width: 50px;
	border-left: 1px solid #ccc
}
.Ysubmit {
	border:none;
	background: #1AAD19;
	padding:2px 10px;
	border-radius: 30px;
	width:50px;
	height:26px;
	font-size: 14px;
	color: white;
}
.resLater {
	height:90px;
	display:flex;
	align-items: center;
	justify-content: center
}
.resLater span {
	background: #1AAD19;
	color: white;
	padding:10px 70px;
	border-radius: 50px;
}
.vue-tel-input input{
	display: none;
}
.open>ul[data-v-53a07994] {
    width:450%;
}
</style>
