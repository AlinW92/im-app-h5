<!-- 我的界面 -->
<template>
	<div style="height:100%">
		<x-header  style="background:#55BEB7;"  :left-options="{showBack:false}">我</x-header>
			<div style="height:35%;display:flex;justify-content:center;	flex-direction: column">
			  <p class="center"><router-link to='/BaseInfo'><img :src="url" style="border-radius: 100%;width: 125px;height: 125px;margin-top: 10px;"></router-link></p>
			  <p class="center" style="margin-top:10px">{{myNickName}}</p>
			</div>

		<div style="margin-bottom: 20px;">
			<group style="margin-top: -20px;">
				  <!-- <cell title="我的零钱" is-link class="cellHeight" link="/"></cell>
				  <cell title="我的收藏" is-link class="cellHeight" link=""></cell> -->
				  <cell title="隐私设置" is-link class="cellHeight" link="/PrivacySetting"></cell>
				  <cell title="修改密码" is-link class="cellHeight" link="/ResetPassword"></cell>
				  <cell title="黑名单" is-link class="cellHeight" @click.native="toBlack"></cell>
			</group>
		</div>
		<div>
			<x-button type="warn" @click.native="Logout" style="width: 95%;">退出当前账号</x-button>
		</div>
		<div class="tabberWarpZ">
			<Tabbar>
				 <TabbarItem link="/Index" :badge=msgNum>
					 <img slot="icon" src="../assets/message1.png" alt="">
					 <span slot="label">消息</span>
				 </TabbarItem>
				 <TabbarItem link="/People">
					 <img slot="icon" src="../assets/people1.png" alt="">
					 <span slot="label">通讯录</span>
				 </TabbarItem>
				 <TabbarItem link="/Room">
					 <img slot="icon" src="../assets/group.png" alt="">
					 <span slot="label">群组</span>
					 <!-- <badge text="888"></badge> -->
				 </TabbarItem>
				 <TabbarItem selected link="/Me">
					 <img slot="icon" src="../assets/me2.png" alt="">
					 <span slot="label">我</span>
				 </TabbarItem>
			</Tabbar>
		</div>
	</div>
</template>

<script>
	import { Tabbar, TabbarItem, Group, Cell,XHeader,Blur,XButton,ViewBox } from 'vux'
	import {mapActions, mapState,mapGetters} from 'vuex' //注册 action 和 state
	import apiServer from '../public/apiServer.js'
	import WEBIM from '../public/webim.js'
	import store from '../store'
	let token = sessionStorage.getItem('access_token');
	export default {
		name:"Me",
		computed:mapState([
			  'userId'
		]),
		created() {
			if(apiServer.isNull(window.sessionStorage.getItem("access_token"))){
				window.location.href = "/mobileWeb";
			}
			console.log("页面加载中");
			console.log(window.sessionStorage.getItem("userId"));
			console.log(window.sessionStorage.getItem("access_token"));
			this.msgNum = window.sessionStorage.getItem("sysMsgNum")==0?"":window.sessionStorage.getItem("sysMsgNum");
			this.url = apiServer.getAvatarUrl(window.sessionStorage.getItem("userId"));
			this.myNickName = window.sessionStorage.getItem("nickName");
			apiServer.postData({
        		url:'/friends/blacklist',
				data:{
					access_token:token
				}
			},function(data){
				console.log(data)
				store.commit("setBlackList",data.data)
			})
		},
		data() {
		  return {
		    url:'',
			myNickName:'',
			msgNum:''

		  };
		},
		computed:{
			listenstage(){
				console.log("监听总的消息数量")
				return this.$store.state.sysMsgNum;
			}
		},
		watch:{
			listenstage:function(val){
				console.log("进入监听")
				this.msgNum = window.sessionStorage.getItem("sysMsgNum")==0?"":window.sessionStorage.getItem("sysMsgNum");
			}
		},
		methods:{
			// 退出登录
			Logout:function(){
				// this.$store.commit('setUserId','');
				// this.$store.commit('setAccess_token','');
				WEBIM.disconnect();
				window.sessionStorage.clear();
				// this.$router.push({path:'/'});
				window.location.href = "/mobileWeb";
			},
			toBlack(){
				this.$router.push("/blackList")
			}
		},
		components: {
		  Tabbar,
		  TabbarItem,
		  Group,
		  Cell,
		  XHeader,
		  Blur,
		  XButton,
		  ViewBox
		}

	}
</script>

<style>
	body{
		background-color: #FBF9FE;
	}
	.tabberWarpZ{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background: #fff;
		/* margin-top: 50px; */

	}
	.cellHeight{
		height: 30px;
	}
	.center{
		text-align: center;
	}
	p{
		margin:0
	}
</style>
