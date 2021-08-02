<template>
	<div id="map" style="width: 100%;height: 100%;">
		<div class="header">
			<x-header  style="background:#55BEB7">{{header}}</x-header>
		</div>
		<div style="margin-top: 45px;height: 100%;">
			<baidu-map :center="center" :zoom="zoom" class="map" @ready="handler" @click="getPoint">
				<bm-marker :position="position" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
					
				</bm-marker>
			</baidu-map>
		</div>
		<div class="tabberWarp">
			<tabbar>
				<x-button @click.native="sendAddress">发送</x-button>
			</tabbar>
		</div>
	</div>
	
</template>

<script>
import {XHeader,Tabbar,XButton} from 'vux'
import {BaiduMap,BmMarker} from 'vue-baidu-map'
import apiServer from '../public/apiServer.js'
import WEBIM from '../public/webim.js'
import msgRequest from '../public/msgRequest.js'
import store from '../store'


var address = "";
var imgApiUrl = "https://api.map.baidu.com/staticimage?width=320&height=240&&zoom=15&markers=";
export default {
		name:'Map',
		created(){
			if(apiServer.isNull(window.sessionStorage.getItem("access_token"))){
				window.location.href = "/mobileWeb";
			}
			console.log(this.$route.query.location_x);
			console.log(this.$route.query.location_y);
			
			console.log("进入地图选择")
			WEBIM.initWebIM(apiServer.sysConfig.xmppUrl,window.sessionStorage.getItem("userId"),window.sessionStorage.getItem("nickName"),WEBIM.resource,window.sessionStorage.getItem("password"),6,apiServer.sysConfig.xmppDomain);
			
		},
		data(){
			return {
				header:'所在位置',
				center: {lng: 116.404, lat: 39.915},
				zoom: 15,
				position:{lng: 114.02597366, lat: 22.54605355}
			}
		},
		methods:{
			handler({BMap, map}) {
				if(!apiServer.isNull(this.$route.query.location_x)){
					this.center.lat=this.$route.query.location_x;
					this.center.lng=this.$route.query.location_y;
					this.position.lat = this.$route.query.location_x;
					this.position.lng = this.$route.query.location_y;
				}else{
					this.getLocation();
				}
			},
			getPoint(e){
				console.log(e)
				this.center.lat=e.point.lat;
				this.center.lng=e.point.lng;
				this.position.lat = e.point.lat;
				this.position.lng = e.point.lng;
				let geocoder = new BMap.Geocoder(); 
				geocoder.getLocation(e.point,rs=>{
					console.log(rs.address)
					address = rs.address;
				})
			},
			getLocation(){
				var that =this;
				var geolocation = new BMap.Geolocation();
				geolocation.enableSDKLocation();
				geolocation.getCurrentPosition(function(r){
					if(this.getStatus() == BMAP_STATUS_SUCCESS){
						that.center.lat=r.point.lat;
						that.center.lng=r.point.lng;
						that.position.lat = r.point.lat;
						that.position.lng = r.point.lng;
						console.log("自动定位")
						let geocoder = new BMap.Geocoder();
						geocoder.getLocation(r.point,rs=>{
							console.log(rs.address)
							address = rs.address;
						})
					}        
				});
			},
			sendAddress:function(){
				console.log(this.$store.state.openUserId)
				var toUserId = this.$store.state.openUserId;
				var toNickName = this.$store.state.openUserName;
				var content = imgApiUrl+this.position.lng+","+this.position.lat+"&zoom=15";
				console.log(content);
				var msg=msgRequest.sendAddress(4,address,this.center.lat,this.center.lng,content,toUserId,toNickName);
				msg.content = WEBIM.decryptMessage(msg)	
				store.commit("setMsgListOne",msg);

				// 发送消息后更新消息界面此会话的最新条消息
			let lastList = store.state.lastChatList
			let flag = false
			for(let i = 0;i<lastList.length;i++){
					// console.log(9,lastList[i].from,store.state.openUserId)
				if(lastList[i].jid == store.state.openUserId){
					console.log(9,lastList[i],msg)
					lastList[i].content ='[位置]'
					let last = lastList[i]
					lastList.splice(i,1)
					lastList.unshift(last)
					let flag = true
					// console.log(msg,76)
				}
					if(!flag){
						let newM = msg
			// 待改 将msg转化成lastList中的一项
						lastList.unshift()
					}
			}
			//若消息列表没有该会话，则添加该会话记录
			store.commit("setLastChatMsg",lastList)
			setTimeout(()=>{this.$router.go(-1)},200)
			}
		},
		components:{
			XHeader,
			Tabbar,
			XButton,
			// 百度地图
			BaiduMap,
			BmMarker
		}
		
}
</script>

<style>
	.header{
		position: fixed;
		top: 0;
		z-index: 1;
		width: 100%;
		
	}
	.map{
		width: auto;
		min-height: 500px;
		height: 940px;
	}
	.tabberWarp{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background: #fff; 
	}
#map .vux-header .vux-header-left .left-arrow:before{
	border: 1px solid #fff;
	border-width: 1px 0 0 1px;
}
 #map .vux-header .vux-header-left a{
	 float: left;
    margin-right: 8px;
    color: #fff;
 }
</style>
