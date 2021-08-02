<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
		<!-- <index msgfromfather="" v-on:IndexTo='showTabbar' style="display: none;">

		</index> -->
		<Tabbar v-show="show" style="">
			 <TabbarItem selected link="/Index">
				 <img slot="icon" src="./assets/message2.png" alt="">
				 <span slot="label">消息</span>
			 </TabbarItem>
			 <TabbarItem link="/People">
				 <img slot="icon" src="./assets/people1.png" alt="">
				 <span slot="label">通讯录</span>
			 </TabbarItem>
			 <TabbarItem link="/Me">
							 <img slot="icon" src="./assets/me1.png" alt="">
							 <span slot="label">我</span>
			 </TabbarItem>
		</Tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem, Group, Cell,XHeader } from 'vux'
import Index from "./components/Index"
import _default from 'vuex'
import apiServer from './public/apiServer.js'

export default {
	name: 'App',
	provide (){
		return {
			reload:this.reload
		}
	},
	data:function(){
		return {
			show:false,
			isRouterAlive:true
		}
	},
	methods:{
		showTabbar:function(msg){
			console.log("msg");
			this.show=msg;
		},
		reload(){
			this.isRouterAlive = false
			this.$nextTick(function(){
				this.isRouterAlive = true
			})
    	}

	},
	created(){

	},
	mounted(){
		// window.history.forward(1);
// 	history.pushState(null, null, document.URL);
// 	window.addEventListener('popstate', function () {
//   history.pushState(null, null, document.URL);
// });

	},
	components: {
	  Tabbar,
	  TabbarItem,
	  Group,
	  Cell,
		XHeader,
		Index

	}
}
</script>

<style>
html,body {
	height: 100%;
}
	body{
		padding: 0;
		margin: 0;
	}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
	height:100%;
	background:#F0EFF4

}

 #app .weui-tabbar__label {
	margin: 0;
}
#app .weui-tabbar__item {
    display: block;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    padding: 6px 0 6px;
    color: #999999;
    text-align: center;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
#app .weui-tabbar {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    position: absolute;
    z-index: 500;
    bottom: 0;
    width: 100%;
    background-color:#fff;
}
#app .vux-header .vux-header-left .left-arrow:before{
	border: 1px solid #fff;
	border-width: 1px 0 0 1px;
}
 #app .vux-header .vux-header-left a{
	 float: left;
    margin-right: 8px;
    color: #fff;
 }
</style>
