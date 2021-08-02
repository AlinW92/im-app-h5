<template>
 <div class="forget">
     <div class="header">
        <x-header  @on-click-back="lastPage" style="background:#55BEB7" :left-options="{showBack:true}">修改密码</x-header>
    </div>
    	<div style="position:absolute;left:0;right:0;top:46px">
            <div class="ForgetList">
                <img class="resImage" src="../assets/lu.png" alt="">
                <input type="text" v-model="pnumber" placeholder="请输入手机号" ref="pnumber">
                <!-- <vue-tel-input ref="prefix" @country-changed="countryChanged" placeholder="" style="width:13%;height:24px;position:absolute;left:9%;"></vue-tel-input> -->
            </div>
            <div class="ForgetList">
                <img class="resImage" src="../assets/lp.png" alt="">
                <input type="password" @focus="clickBack" v-model="inputPassword" placeholder="请输入新密码" ref="password">
            </div>
            <div class="ForgetList"  style="margin-top:2px">
                <img class="resImage" src="../assets/lp.png" alt="">
                <input type="password"  v-model="confirmPassword" placeholder="请确认新密码" ref="password">
            </div>
            <div class="ForgetList">
                <img class="resImage" src="../assets/ly.png" alt="">
                <input type="text" v-model="chart" placeholder="图形码" ref="chart">
                <img @click="clickBack" class="backImage" src="../assets/ic_refre_msg_code(1).png" alt="" style="position:relative;right:-54px">
                <img  alt="" :src="chartCode" style="position:relative;right:73px;width:70px">
            </div>
            <div class="ForgetList" style="background:#F0EFF4">
              <div style="height:100%;width:76%;display:flex;justify-content:flex-start;align-items:center;background:white">
                <img style="height:24px" class="resImage" src="../assets/lm.png" alt="">
                <input v-model="confirmCode" style="height:60%;width:85%" type="text" placeholder="请输入验证码">
              </div>
            <span class="submitCode" @click="ClickCode">发送</span>
            </div>
             <div class="ForgetList" style="background:#55BEB7;color:white;justify-content: center;" @click="modifyPassword">
               修改密码
            </div>
        </div>
        <div>
		  <alert @on-hide="onHide" v-model="show">{{showText}}</alert>
		</div>
</div>
</template>

<script>
import {XHeader,Group,Cell,XButton,Datetime,XAddress,ChinaAddressV4Data ,PopupRadio
,XInput,Alert,md5} from 'vux'
import apiServer from '../public/apiServer.js'
import Vue from 'vue'
import VueTelInput from 'vue-tel-input'

Vue.use(VueTelInput)
 export default {
   data () {
     return {
        value:['2017-01-15', '03', '05'],
            sex:'',
            sexList:['男','女'],
            addressData:ChinaAddressV4Data,
            birthday:'',
            nickName:'',
            chartCode:'',
            pnumber:"",
            inputPassword:"",
            confirmPassword:"",
            chart:"",
            confirmCode:"",
            otherConfirmCode:"",
            show:false,
            showText:'',
            isSuccess:false,
            dialCode:"86"
     }
   },
   created(){
    //  if(apiServer.isNull(window.sessionStorage.getItem("access_token"))){
	// 		window.location.href = "/mobileWeb";
	// 	}
   },
   mounted(){
   },
   methods:{
       countryChanged(obj){
			this.dialCode = obj.dialCode
		},
    //    点击确认修改密码返回登陆界面
       onHide(){
            if(this.isSuccess){
                this.$router.go(-1)
            }
       },
       lastPage(){
           this.$router.go(-1)
       },
    //    点击刷新图形码
       clickBack(){
           	if(this.pnumber){
                   this.chartCode = apiServer.sysConfig.apiUrl +  "/getImgCode?telephone=86" + this.pnumber +"&a=" + Math.random()
               }
       },
    //    点击发送验证码
       ClickCode(){
           let that = this
           	if(this.pnumber == ""){
				this.showText = "请输入手机号码"
			}else if(this.inputPassword == "") {
				this.showText = "请输入新密码"
			}else if(this.confirmPassword == ""){
				this.showText = "请确认新密码"
			}else if(this.chart ==""){
                this.showText = "请输入图形码"
            }else{
                    //  console.log(2)
                if(this.inputPassword == this.confirmPassword){
                          apiServer.postData({
				url:'/verify/telephone',
				data:{
					telephone:that.pnumber,
					areaCode:"86"
				}
			},function(result){
				console.log(result)
				if(result.resultCode == 1040107){
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
					console.log(data);
					if(data){
                        if(data.resultCode == 1){
                            that.otherConfirmCode = data.data.code
                            // that.confirmCode = that.otherConfirmCode
                            console.log(that.otherConfirmCode)
                            that.showText = "发送成功"
                            that.show = true
					    }else{
                            that.showText = "图形验证码错误"
                            that.show = true
						}
                    }
					})
				}else if(result.resultCode == 1){
                    that.showText = "手机号未注册"
                    that.show = true
                }
			})
                }else{
                     that.showText = "密码和确认密码不一致"
                     that.show = true
                }
                }
                // this.show = true
       },
    //    点击修改密码
       modifyPassword(){
           let that = this
           that.isSuccess = true
           console.log(that.otherConfirmCode,that.pnumber,that.confirmPassword)
            // console.log(2)
          if(that.otherConfirmCode == that.confirmCode){
                apiServer.postData({
				url:'/user/password/reset',
				data:{
					version: 1,
					areaCode:that.dialCode,
					randcode:that.otherConfirmCode,
					telephone:that.pnumber,
					newPassword:md5(that.confirmPassword),
				}
			},function(data){

            if(data){
                console.log(data);
                if(data.resultCode == 1){
                that.showText = "修改密码成功"
                that.show = true
            }else{
                    that.showText = "修改失败"
                    that.show = true
                }
            }

            })
          }else{
               that.showText = "验证码错误"
               that.show = true
          }
        }
   },
   components: {
    	XHeader,
			Group,
			Cell,
			XButton,
			Datetime,
			XAddress,
			ChinaAddressV4Data,
            PopupRadio,
            XInput,
            Alert
   }
 }
</script>

<style>
*{
    padding:0;
    margin:0
}
.ForgetList{

 background:white;
 height: 40px;
 margin-top:10px;
 display: flex;
 justify-content: flex-start;
 align-items: center
}
.ForgetList img {
    height:60%;
    margin-left:8px;
}
.ForgetList input {
    width: 70%;
    margin-left: 6px;
    height:60%;
    border:none
}
.submitCode {
    background: rgb(85, 190, 183);
    color:white;
    /* padding:10px 20px; */
    height:40px;
    width: 20%;
    text-align: center;
    line-height: 40px;
    margin-left: 8px
}
.backImage {
    height:100%;
}
.vue-tel-input input{
	display: none;
}
.open>ul[data-v-53a07994] {
    width:500%;
}
</style>
