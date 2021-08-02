<!-- 登录界面 -->
<template>
  <div class="login" :style="{  height: bodyHeight + 'px' }">
		<div class="header" ref="header">
			<x-header style="background:#55BEB7" :left-options="{showBack:false}">登录</x-header>
		</div>
		<div style="height:30%;display:flex;flex-direction:colum;justify-content:center;align-items:flex-end;padding-bottom:30px">
			<img src="../assets/logo1.png" style="" v-bind:class="logoSize">
		</div>
		<!-- <h2>{{ msg }}</h2> -->
		<Flexbox>
			<FlexboxItem>
				<div class="flex-demo" style="padding:5px 20px;position:relative">
					<img style="position:absolute;left:20px;top:6px;width:25px;" src="../assets/lu.png"  alt="">
					<!-- <img src="./assets/logo1.png" alt="" style="width: 10px;height: 10px;"> -->
					<input @focus="input1" style="padding-left:10px;height:30px;width:77%;" type="text" placeholder="请输入账号" v-model="telephone" ref="tel" />
					<span @click="deleText1" v-if="ishow1" style="position:absolute;right:50px;width:15px;height:15px;font-size:18px;top:10px">×</span>
					<!-- <vue-tel-input ref="prefix" @country-changed="countryChanged" placeholder="" style="float:left;width:13%;margin-left:10%;height:24px;"></vue-tel-input> -->
					<!-- <vue-tel-input :preferred-countries="['us', 'gb', 'ua']" :valid-characters-only="true" @input="onInput"/> -->
				</div>
			</FlexboxItem>
		</Flexbox>
		<Flexbox>
			<FlexboxItem>
				<div class="flex-demo"  style="padding:5px 20px;margin-bottom:20px;position:relative">
					<img style="position:absolute;left:20px;top:6px;width:25px" src="../assets/lp.png"  alt="">
					<input @focus="input2"  style="padding-left:10px;height:30px;width:77%" type="password" placeholder="请输入密码" v-model="password" />
					<span @click="deleText2" v-if="ishow2" style="position:absolute;right:50px;width:15px;height:15px;font-size:18px;top:10px">×</span>
				</div>
			</FlexboxItem>
		</Flexbox>
		<x-button type="primary" @click.native="loginClick" style='width: 90%;'>登录</x-button>
		<Flexbox>
			<FlexboxItem>
				<div class="flex-demo"  style="height:50px;line-height:50px">
					<span @click="forgetPassw">忘记密码</span>
				</div>
			</FlexboxItem>
			<FlexboxItem>
				<div class="flex-demo" style="height:50px;line-height:50px">
					<span @click="Register">注册用户</span>
				</div>
			</FlexboxItem>
		</Flexbox>
		<div v-transfer-dom>
		  <alert v-model="show">{{Please}}</alert>
		</div>
		<div v-transfer-dom>
		  <loading :show="LoadingShow" :text="LoadingText" ref="loading"></loading>
		</div>
  </div>
</template>

<script>
import { Group } from 'vux'
import { Cell } from 'vux'
import { XInput } from 'vux'
import { XButton } from 'vux'
import { Flexbox, FlexboxItem,XHeader,Loading } from 'vux'
import { Icon } from 'vux'
import { md5 } from 'vux'
import { AlertModule,Alert,TransferDomDirective as TransferDom } from 'vux'
import WEBIM from '../public/webim.js'
import axios from 'axios'
/* 调用js */
import apiServer from '../public/apiServer.js'
import {mapActions, mapState,mapGetters} from 'vuex' //注册 action 和 state
import Vue from 'vue'
import VueTelInput from 'vue-tel-input'

Vue.use(VueTelInput)

let userId='';
let token='';
let deviceInfo={
    isAndroid : false,
    isIOS : false
};
export default {
  name: 'HelloWorld',
  directives:{
	TransferDom
  },
  data () {
    return {
		msg: '欢迎使用即时通讯系统',
	  logoSize:'logoSize',
	  telephone:'',
	  password:'',
	  show:false,// 是否显示弹出框
	  Please:'',// 弹出框提示语
	  LoadingShow:false,// 是否显示加载中
		LoadingText:'',// 加载中提示语
		ishow1:false,
		ishow2:false,
		dataHref:'',
		bodyHeight:0,
		dialCode: "86"
    }
  },
	beforeCreate(){
		//清空会话存储，否则登录时会提示账号密码错误
		sessionStorage.clear()
	},
	created(){
		if(apiServer.getCookie("telephone")){
			this.password = apiServer.getCookie("password")
			this.telephone = apiServer.getCookie("telephone")
		}
	},
	mounted(){
		this.$refs.header.style.position = "static"
        this.bodyHeight=document.documentElement.clientHeight
	},
	watch:{
		telephone(){
			this.telephone = this.telephone.replace(/\D/g,'')
		}
	},
  methods:{
	  	countryChanged(obj){
			this.dialCode = obj.dialCode
			// this.$refs.prefix.onInput()
		},
	  	// onInput(formattedNumber, { number, valid, country }) {
		// 	// console.log(formattedNumber,number)
		// 	this.dialCode.number = number.international;
		// 	this.dialCode.country = country && country.name;
		// },
		// clickA(){
		// 	var ifr = document.createElement("iframe")
		// 	ifr.src = "sk://com.sk.weichat/login?callback=%7bcallbackUrl%3a%22https%3a%2f%2fwww.shiku.co%2fmobileWeb%22%7d"
		// 	if (navigator.userAgent.match(/android/i)) {
		// 		window.location.href="sk://com.sk.weichat/login?extra_login_content=%7bcallbackUrl%3a%22https%3a%2f%2fwww.shiku.co%2fmobileWeb%22%7d";
		// 	}
		// 	ifr.style.display="none";
		// 	document.body.appendChild(ifr)
		// 	window.setTimeout(function(){
		// 		document.body.removeChild(ifr)
		// 	},3000)
		// },
		// 切换input输入
		input1(){
			console.log(3)
			this.ishow1 = true
			this.ishow2 = false
		},
		input2(){
			this.ishow2 = true
			this.ishow1 = false
		},
		// 点击×号清除数据
		deleText1(){
			console.log(2)
			this.telephone = ""
		},
		deleText2(){
			this.password = ""
		},
	  // 登录
	  loginClick:function(){
		if(apiServer.isNull(this.telephone)){
			this.Please='请输入账号密码';
			this.show=true;
			return ;
		}else if(apiServer.isNull(this.password)){
			this.Please='请输入密码';
			this.show=true;
			return;
		}
		let md5Telephone=md5(this.telephone);
		let md5Password = md5(this.password);
		// alert(md5Telephone)
		// alert(md5Password)
		let that = this;
// 		this.LoadingShow=true;
// 		this.LoadingText="登录中"
// 		setTimeout(() => {
// 			this.$vux['loading'].hide()
// 		  }, 2000)
		apiServer.postData({
			url:'/user/login',
			data:{
				telephone:md5Telephone,
				password:md5Password,
				dialCode:that.dialCode,
			}
		},function(data){
			console.log(data);
			console.log(md5Telephone,md5Password)
			if(data.resultCode==1){
				console.log(data);
				console.log(md5Password);
				userId=data.data.userId;
				token = data.data.access_token;
				console.log(that.password);
				window.sessionStorage.setItem("userId",JSON.stringify(data.data.userId));
				window.sessionStorage.setItem("access_token",data.data.access_token);
				window.sessionStorage.setItem("nickName",data.data.nickname);
				window.sessionStorage.setItem("sex",JSON.stringify(data.data.sex));
				window.sessionStorage.setItem("birthday",JSON.stringify(data.data.birthday));
				window.sessionStorage.setItem("telephone",that.telephone);
				window.sessionStorage.setItem("Usersetting",JSON.stringify(data.data.settings));
				window.sessionStorage.setItem("login",JSON.stringify(data.data.login));
				window.sessionStorage.setItem("password",md5Password);

				// localStorage.setItem("telephone",that.telephone)
				// localStorage.setItem("password",that.password)
				apiServer.setCookie("telephone",that.telephone,356)
				apiServer.setCookie("password",that.password,356)
				that.$router.push({path:'/Index'});
			}else{
				// console.log(data.resultMsg);
				that.Please=data.resultMsg||"请求错误";
				that.show=true;
			}
		})

	  },
	  // 注册
	  Register:function(){
		  this.$router.push({path:'/Register'});
		},
		// 忘记密码
		forgetPassw(){
			this.$router.push({path:'/forgetPassw'});
		}
  },
  components: {
    Group,
		Cell,
		XInput,
		XButton,
		Flexbox,
    FlexboxItem,
		Icon,
		Alert,
		XHeader,
		Loading

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import '~vux/src/styles/1px.less';
.login{
	// margin-top: 50px;
	text-align: center;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
	padding: 0;
}
li {
  display: inline-block;
	margin: 0 10px;

}
a {
	color: #42b983;
}
.flex-demo {
  text-align: center;
  // color: #fff;
  // background-color: #20b907;
	// border: 1px solid black;
  border-radius: 4px;
  background-clip: padding-box;
}
.logoSize{
	width: 100px;
	height: 100px;
}
.login .weui-cell:before{
	border-top: none
}
input {
	border:none;
	border-bottom: 1px solid #ccc;
	background:none
}
.open>ul[data-v-53a07994] {
    width:470%;
}
</style>
