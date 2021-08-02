<template>
	<div id="chat" style="height:100%;" @click="cancelKeyboard">
		<div class="header" @click.stop="">
			<x-header :left-options="{preventGoBack:true}" @on-click-back="hhh" style="background:#55BEB7">{{header}}<span v-if="$store.state.openIsRoom == 1">（{{memberNum}}人）</span><img src="../assets/chat_more.png" alt="" slot="right" @click="moreInfo" class="moreInfoImg"></x-header>
		</div>
		<scroller :on-refresh="refresh" ref="my_scroller" refreshText="正在加载" :noDataText="noDataText">
			<div @click="keybagDon" id="chatMsgContent" class="chat_div">
				<div v-for="(item,index) in items" style="margin:4px 0">
					<!-- 上传群文件 -->
					<div v-if="item.type==401" style="font-size: 12px;">
						<span style="background-color: #B5B5B5;color: white;padding: 2px;border-radius: 5px;">
							{{item.fromUserName}} 上传了群文件：{{item.fileName}}
						</span>
					</div>
					<!-- 删除群文件 -->
					<div v-if="item.type==402" style="font-size: 12px;">
						<span style="background-color: #B5B5B5;color: white;padding: 2px;border-radius: 5px;">
							{{item.fromUserName}} 删除了群文件：{{item.fileName}}
						</span>
					</div>
					<!-- 修改群名称 -->
					<div v-if="item.type==902" style="font-size: 12px;">
						<span style="background-color: #B5B5B5;color: white;padding: 2px;border-radius: 5px;">
							{{item.fromUserName}} 修改群名为:{{item.content}}
						</span>
					</div>
					<!-- 新公告 -->
					<div v-if="item.type==905" style="font-size: 12px;">
						<span style="background-color: #B5B5B5;color: white;padding: 2px;border-radius: 5px;">
							{{item.fromUserName}} 发布新公告:{{item.content}}
						</span>
					</div>
					<!-- 增加新成员 -->
					<div v-if="item.type==907" style="font-size: 12px;">
						<span style="background-color: #B5B5B5;color: white;padding: 2px;border-radius: 5px;">
							{{item.fromUserName}} 邀请群成员:{{item.toUserName}}
						</span>
					</div>
					<!-- 设置、取消管理员 -->
					<div v-if="item.type==913" style="font-size: 12px;">
						<span v-if="item.content==1" style="background-color: #B5B5B5;color: white;padding: 2px;border-radius: 5px;">
							{{item.fromUserName}} 设置{{item.toUserName}} 为管理员
						</span>
						<span v-if="item.content==0" style="background-color: #B5B5B5;color: white;padding: 2px;border-radius: 5px;">
							{{item.fromUserName}} 取消{{item.toUserName}} 为管理员
						</span>
					</div>
					<!-- 设置群成员禁言 -->
						<div v-if="item.type==906" style="font-size: 12px;">
						<span  v-if="!(item.content == 0)" style="background-color: #B5B5B5;color: white;padding: 2px;border-radius: 5px;">
							{{item.fromUserName}} 对{{item.toUserName}} 设置了禁言，截止{{timeFuntion(item.content)}}
						</span>
						<span v-if="item.content == 0" style="background-color: #B5B5B5;color: white;padding: 2px;border-radius: 5px;">
								{{item.fromUserName}} 对{{item.toUserName}} 取消了禁言
						</span>
					</div>
					<!-- 踢某人出群 -->
					<div v-if="item.type==904" style="font-size: 12px;">
						<span style="background-color: #B5B5B5;color: white;padding: 2px;border-radius: 5px;">
						{{item.toUserName}} 被踢出群组
						</span>
					</div>

					<!-- 全体禁言 -->
					<div v-if="item.type==920" style="font-size: 12px;">
						<span style="background-color: #B5B5B5;color: white;padding: 2px;border-radius: 5px;">
							已开启全体禁言
						</span>
					</div>
					<!-- 收到撤回消息 -->
					<div v-if="item.fromUserId!=myUserId&&item.type==202" style="font-size: 12px;">
						<span style="background-color: #B5B5B5;color: white;padding: 2px;border-radius: 5px;">
					{{item.content[0].data||item.fromUserName + ' 撤回了一条消息'}}
						</span>
					</div>
					<div v-if="item.fromUserId==myUserId&&item.type == 202">
							<span style="background-color: #B5B5B5;color: white;padding: 2px;border-radius: 5px;font-size: 12px;">
								你 撤回了一条消息
							</span>
						</div>
							<div v-if="item.hasRead">
							<span style="background-color: #B5B5B5;color: white;padding: 2px;border-radius: 5px;font-size: 12px;">
								对方查看了您的这条阅后即焚消息
							</span>
						</div>
					<flexbox
					v-if="item.fromUserId!=myUserId&&item.type<100"
						@touchstart.native="gotouchstart(item)"
						@touchmove.native="gotouchmove(item)"
						@touchend.native="gotouchend(item)"
					class="cancelPadding" style="align-items:flex-start;position:relative">
						<div class="longShow" v-if="item.longShow" @click.stop="">
							<div @click="deleteNew(index,item)">删除</div>
							<div v-clipboard:copy="item.content[0].data" v-clipboard:success="onCopy" v-clipboard:error="onError"  class="tag-read">复制</div>
							<div @click="orderSend(index,item)">转发</div>
							<!-- <div style="border-right:none">收藏</div> -->
							<div class="trian"></div>
						</div>
						<img :onerror="imgError" @click="userInfo(item)" :src="getImg(item)" alt="" class="chatImg">
						<div class="chat-limit-length bubble js_message_bubble bubble_default left" :class="[item.type==1||item.type==3||item.type==84?'padd':'',item.type==8||item.type==9?'pacc':'']" style="min-height: 20px">
							<span class="yspan" v-if="item.type==1">
								<span  v-if="!item.isReadDel" v-for="con in item.content" style="width:300px">
									<span style="white-space:pre-wrap;" v-if="con.type=='txt'">{{con.data}}</span>
									<img v-if="con.type=='emoji'" :src="con.data" alt="" style="width: 25px;height: 25px;">
								</span>
								<span v-if="item.isReadDel" @click="seeFire(item)">点击查看 T</span>
							</span>
							<!-- <previewer v-if="item.type==2" :list="list" ref="previewer" :options="options" @on-index-change="logIndexChange"></previewer> -->
							<div v-if="item.type==2" :images="[item.content]" >
								<img :src=item.content alt="" style="width: 125px" @click="openBig(item.content)">
							</div>

							<div v-if="item.type==3" @click="openVoice(item.content,item.timeLen)"><img src="../assets/voice.png" alt="" style="width: 25px;height: 25px;vertical-align:middle;"><span>{{item.timeLen}}</span></div>
							<!-- 位置 -->
							<div v-if="item.type==4" @click="openMap(item.location_x,item.location_y)">
								<img :src=item.content alt="" style="width:200px;height:65px">
								<p style="font-size: 11px;width:200px;background:white" >{{item.objectId}}</p>
							</div>
							<!-- gif -->
							<div v-if="item.type==5">
								<img :src="item.content" alt="" style="width: 125px">
							</div>
							<!-- 视频 -->
							<div v-if="item.type==6">
								<video
								style="width: 120px;vertical-align:bottom;height:210px" controls="controls">
									<source :src="item.content" type="video/mp4">
								</video>
							</div>
							<!-- 名片 -->
							<div v-if="item.type==8" @click="openCard(item.objectId)"   style="width:200px;background:white;height:67px">
								<div class="fileTop" style="padding:5px"><img class="fileImage" :src="item.avatar" alt="" style="width:35px;height: 35px;" :onerror='imgError'><span>{{item.content}}</span></div>
								<p style="color:gray;font-size:11px;padding-left:5px">名片</p>
							</div>
							<!-- 文件 -->
							<div v-if="item.type==9" style="width:200px" class="file" @click="openFile(item)">
								<div class="fileTop">
									<div class="fileMsg_div">
										<img class="fileImage" src="../assets/file.png" alt="">
									</div>
									<div class="fileMsg_div">
										<span>{{item.fileName.split("/")[item.fileName.split("/").length-1]}}</span>
									</div>
								</div>
								<p>文件</p>
							</div>
							<!-- 红包 -->
							<div v-if="item.type==28"  style="width:200px;height:80px;border-radius:8px">
								<div class="hongbao"><img src="../assets/ic_chat_hongbao.png" alt=""><span>{{item.content}}</span></div>
								<p class="hongbaoP">红包</p>
							</div>
							<!-- 戳一戳 -->
							<div v-if="item.type==84">
								[不支持请在手机端查看]
							</div>

						</div>
						<!-- 阅后即焚相关信息 -->
						<div v-if="item.isReadDel||item.Time" style="height:45px;width:20px;display:flex;align-items:center;justify-content:center;">
							<img style="height:16px;width:16px" src="../assets/fire.png" alt="">
							<span></span>
						</div>
						<div v-if="item.Time" style="height:45px;width:20px;display:flex;align-items:center;justify-content:center;font-size:10px;"><span class="readFire">{{item.time}}</span></div>

					</flexbox>

					<flexbox v-else-if="item.fromUserId==myUserId&&item.type<100"
						@touchstart.native="gotouchstart(index,item)"
						@touchmove.native="gotouchmove(index,item)"
						@touchend.native="gotouchend(index,item)"
					:style="style1" >
						<div click.stop="" class="longShow2" v-if="item.longShow" :style="item.display?{}:style2">
							<div @click="deleteNew(index,item)">删除</div>
							<div @click="orderSend(index,item)">转发</div>
							<div v-clipboard:copy="item.content[0].data" v-clipboard:success="onCopy" v-clipboard:error="onError"  class="tag-read">复制</div>
							<div style="border-right:none" @click="clickBack(item)">撤回</div>
							<div class="trian"></div>
						</div>
						<div class="isRead">
							<span v-if="(item.isRead||item.isReadShow)&&$route.query.isRoom==0" style="background:#95D051">已读</span>
							<span v-else-if="$route.query.isRoom&&$store.state.showReadNum[$store.state.openUserId]" style="background:#95D051">{{item.readNum||0}}人</span>
							<span v-else-if="$route.query.isRoom == 0" style="background:skyblue">送达</span>
							<img v-show="item.isReadDel" style="width:20px;height:20px" src="../assets/fire.png" alt="">
						</div>
						<div class="chat-limit-length js_message_bubble bubble bubble_primary right" :class="[item.type==1||item.type==3||item.type==84?'padd':'',item.type==8||item.type==9?'pacc':'']" style="margin-left:0;!important;min-height: 20px;border-left: 5px;position:relative">
								<!-- <div v-if="item.type==1" class="bubble_cont">
									<div class="plain">
										<pre v-for="con in item.content" class="js_message_plain" style="text-align: right;">
											<span v-if="con.type=='txt'" style="">{{con.data}}</span>
											<img v-if="con.type=='emoji'" :src="con.data" alt="" style="width: 25px;height: 25px;">
										</pre>
									</div>
								</div> -->
							<div v-if="item.type==1" style="background-color: #8AE7D8;">
								<span v-for="con in item.content" style="">
									<img v-if="con.type=='emoji'" :src="con.data" alt="" style="width: 25px;height: 25px;">
									<pre v-if="con.type=='txt'" style="">{{con.data}}</pre>
								</span>
							</div>
							<!-- 图片 -->
							<div v-if="item.type==2" :images="[item.content]"  style="background:#F0EFF4">
								<img :src=item.content alt="" @click="openBig(item.content)"   style="width: 120px">
							</div>
							<!-- 语音 -->
							<div v-if="item.type==3" @click="openVoice(item.content,item.timeLen)"><img src="../assets/voice.png" alt="" style="width: 25px;height: 25px;vertical-align:middle;"><span>{{item.timeLen}}</span></div>
							<!-- 位置 -->
							<div v-if="item.type==4" @click="openMap(item.location_x,item.location_y)">
								<img :src=item.content alt="" style="width: 200px;height:65px">
								<p style="font-size: 11px;background:white">{{item.objectId}}</p>
							</div>
							<!-- gif -->
							<div v-if="item.type==5">
								<img :src="item.content" alt="" style="width: 125px">
							</div>
							<!-- 视频 -->
							<div v-if="item.type==6">
								<div style="display: flex;">
									<video
									 style="width: 120px;vertical-align:bottom;height:210px" controls="controls">
										<source :src="item.content" type="video/mp4">
									</video>
								</div>
							</div>
							<!-- 名片 -->
							<div v-if="item.type==8" @click="openCard(item.objectId)" style="width:200px;background:white;height:67px">
								<div class="fileTop" style="padding:5px"><img :src="item.avatar" class="fileImage" alt="" style="width: 35px;height: 35px;" :onerror='imgError'><span>{{item.content}}</span></div>
								<p  style="color:gray;font-size:11px;padding-left:5px">名片</p>
							</div>
							<!-- 文件 -->
							<div v-if="item.type==9"  style="width:200px" class="file" @click="openFile(item)">
								<div class="fileTop">
									<div class="fileMsg_div">
										<img class="fileImage" src="../assets/file.png" alt="">
									</div>
									<div class="fileMsg_div">
										<span style='display:inline-block;left:8px;width:125px;'>{{item.fileName.split("/")[item.fileName.split("/").length-1]}}</span>
									</div>
								</div>
								<p>文件</p>
							</div>
							<!-- 红包 -->
							<div v-if="item.type==28"  style="width:200px;height:80px;border-radius:8px">
								<div class="hongbao"><img src="../assets/ic_chat_hongbao.png" alt=""><span>{{item.content}}</span></div>
								<p class="hongbaoP">红包</p>
							</div>
							<!-- 戳一戳 -->
							<div v-if="item.type==84">
								[不支持请在手机端查看]
							</div>
						</div>

						<!-- <div style="text-align: right;">
							<span v-if="item.type==1" >{{item.content}}</span>
						</div> -->

						<img @click="userInfo(item)" :src="getMyImg()" :onerror="imgError"  alt="" class="chatImg" style="float:right" >
					</flexbox>
				</div>
				<!-- <div style="padding:3px 0" v-scroll>
					<img src="../../build/logo.png" alt=""  class="chatImg">
				</div> -->
				<div :class="smileShow||moreShow?'showTabbar':''"></div>
			</div>
		</scroller>

		<!-- 底部导航栏 -->
		<div id="chatMsgTabbar" class="tabberWarpY" style="" @click.stop="">
			<tabbar >
				<!-- 语音模块暂时隐藏 -->
				<!-- <div style="width: 12%;line-height: 100%;margin-top: 10px;">
					<img v-if="isShowVoice" src="../assets/im_voice_nor.png" alt="" class="tabber_img" @click="clickVoice()">
					<img v-if="!isShowVoice" src="../assets/im_keyboard_nor.png" alt="" class="tabber_img" @click="closeVoice()">
					<audio id="voice_audio" controls autoplay style="display: none;"></audio>
				</div> -->
				<div style="width: 12%;line-height: 100%;margin-top: 10px;">
					<img v-if="isopenSmile" src="../assets/expressY.png" alt="" class="tabber_img" @click="openSmile">
					<img v-if="!isopenSmile" src="../assets/im_keyboard_nor.png" alt="" class="tabber_img" @click="closeSmile">
				</div>
				<div style="width: 78%;height:42px;padding-top:7px" @click.stop="">
					<textarea v-if="isShowVoice" v-model="introduct" placeholder="" ref="Inputcontent" @focus="onfocus" style="width: 100%;height:34px;line-height:34px;resize:none;padding:0" @input="inputMsg"/>
					<x-button style="height:35px;line-height:35px" v-if="!isShowVoice" @touchstart.native="startVoice" @touchend.native = "endVoice" class="langVoice">长按录音</x-button>
				</div>
				<div style="width: 15%;line-height: 100%;margin-top: 10px;">
					<img v-if="addShow" src="../assets/moreY.png" alt="" class="tabber_img" @click="addMore">
					<img style="width:43px" src="../assets/send.png" v-if="!addShow" alt="" class="tabber_img" @click="send(1,null,null,null)">
				</div>
			</tabbar>
		</div>
		<!-- 更多 -->
		<div v-if="moreShow" class="tabberWarpY" style=""  @click.stop="">
			<grid :show-vertical-dividers="false" :show-lr-borders="false" style="height: 60px;padding:5px" :cols=4 :rows=2>
				<grid-item style="padding-top: 5px;w-vertical-dividers">
					<img slot="icon" @click="selectImg" src="../assets/im_photo_button_normal.png" alt="" id="moreT">
					<input id="photoImg" accept="image/*" @change="imgChange" ref="img" type="file" style="display: none;">
					<p>相册</p>
				</grid-item>
				<!-- <grid-item style="padding-top: 5px;">
					<img slot="icon" src="../assets/im_pickup_button_normal.png" alt="" id="moreT">
					<p>拍摄</p>
				</grid-item> -->
				<grid-item style="padding-top: 5px;">
					<img slot="icon" src="../assets/im_audio_button_normal.png" @click="selectAudio" alt="" id="moreT">
					<p>语音通话</p>
				</grid-item>
				<grid-item style="padding-top: 5px;">
					<img slot="icon" @click="selectAddress" src="../assets/im_map_button_normal.png" alt="" id="moreT">
					<p>位置</p>
				</grid-item>
				<grid-item style="padding-top: 5px;">
					<img slot="icon" @click="selectCard" src="../assets/im_card_button_normal.png" alt="" id="moreT">
					<p>名片</p>
				</grid-item>
			</grid>
			<grid :show-vertical-dividers="false" :show-lr-borders="false" style="height: 60px;">

				<grid-item style="padding-top: 5px;">
					<img slot="icon" @click="selectFile" src="../assets/im_file_button_normal.png" alt=""  id="moreT">
					<input id="fileInput" @change="fileChange" type="file" style="display: none;" ref="file" multiple="multiple">
					<p>文件</p>
				</grid-item>
				<grid-item></grid-item>
					<grid-item></grid-item>
						<grid-item></grid-item>
			</grid>
		</div>
		<!-- 表情 -->
		<div v-if="smileShow" class="tabberWarpY"  @click.stop="">
			<swiper :aspect-ratio="240/800" show-dots dots-position="center" style="height:118px">
				<swiper-item style="width: 100%;">
					<!-- <span v-for="emoji in emojiObj.map1" style="margin-left: 10px;margin-right: 10px;">
						<img :src="(emojiObj.path+emoji)" @click="selectEmoji(emoji)" alt="" style="width: 7%;max-width: 40px;">
					</span> -->
					<grid :cols=8 :show-lr-borders="false" :show-vertical-dividers="false">
						<grid-item v-for="emoji in emojiObj.map1" style="padding: 3px; 1px">
							<img slot="icon" :src="(emojiObj.path+emoji)" @click="selectEmoji(emoji)" alt="" style="width: 30px;max-width: 40px;">
						</grid-item>
					</grid>
				</swiper-item>
				<swiper-item>
					<!-- <span v-for="emoji in emojiObj.map2" style="margin-left: 10px;margin-right: 10px;">
						<img :src="emojiObj.path+emoji" @click="selectEmoji(emoji)" alt="" style="width: 7%;max-width: 40px;">
					</span> -->
					<grid :cols=8 :show-lr-borders="false" :show-vertical-dividers="false">
						<grid-item v-for="emoji in emojiObj.map1" style="padding: 3px 1px;">
							<img slot="icon" :src="(emojiObj.path+emoji)" @click="selectEmoji(emoji)" alt="" style="width: 30px;max-width: 40px;">
						</grid-item>
					</grid>
				</swiper-item>
				<swiper-item>
					<!-- <span v-for="emoji in emojiObj.map3" style="margin-left: 10px;margin-right: 10px;">
						<img :src="emojiObj.path+emoji" @click="selectEmoji(emoji)" alt="" style="width: 7%;max-width: 40px;">
					</span> -->
					<grid :cols=8 :show-lr-borders="false" :show-vertical-dividers="false">
						<grid-item v-for="emoji in emojiObj.map1" style="padding: 3px 1px;">
							<img slot="icon" :src="(emojiObj.path+emoji)" @click="selectEmoji(emoji)" alt="" style="width: 30px;max-width: 40px;">
						</grid-item>
					</grid>
				</swiper-item>
			</swiper>

		</div>

		<div>
		  <actionsheet :menus="menus" v-model="showMenus" @on-click-menu="clickAudio" show-cancel></actionsheet>
		</div>
		<div :class="imageShow?'marsh':'disp'" @click="smallImage"  @click.stop="">
			<img :src="BigImage" style="width:100%" alt="">
		</div>
		<div :class="voiceShow?'recordVioce':'disp'" style=""  @click.stop="">
			<img style="width:100px;border-radius: 7px" src="../assets/recordnew.gif" alt="">
		</div>
	</div>
</template>

<script>

import {XHeader,Flexbox, FlexboxItem,XTextarea,Tabbar, TabbarItem,Swiper,SwiperItem,Grid,GridItem,PopupRadio,Actionsheet,XButton} from 'vux'
import apiServer from '../public/apiServer.js'
import apiRequest from '../public/apiRequest.js'
import msgRequest from '../public/msgRequest.js'
import store from '../store'
import WEBIM from '../public/webim.js'
import Recorder from "recorder-js"
import {initUserMedia,openUserMedia,startRecording,stopRecording} from '../public/chat-voice.js'
import Vue from 'vue'
let token = sessionStorage.getItem('access_token');
let userId = sessionStorage.getItem("userId")
let nickName = sessionStorage.getItem("nickName")
window.PointerEvent = undefined
var pageIndex = 0;
var isDirectives=0;// 控制滚动条的初始位置
var toUser=0;
let timeOutEvent = null
let now = null;
export default {
	name:'Chat',
	inject:['reload'],
	directives: {
		scroll: {
			inserted(el) {
				if(isDirectives==0){
					console.log("底部")
					el.scrollIntoView()
				}
			}
		}
	},
	created() {
		//获取群组人数
		if(this.$route.query.toUser.isRoom == 1 || this.$store.state.openIsRoom == 1){
			let that = this
			console.log(this.$route.query.toUser)
			apiRequest.getRoom(this.$store.state.myRooms[this.$store.state.openUserId].id,function(result){
				that.memberNum = result.data.members.length
			})
		}
	},
	updated(){
	},
	mounted(){
		if(!apiServer.isNull(this.$route.query.toUser.jid)){
			// console.log("为空")
			toUser=this.$route.query.toUser;
		}
		window.localStorage.setItem("isOpenRoom",this.$route.query.isRoom)
		if(apiServer.isNull(window.sessionStorage.getItem("access_token"))){
			window.location.href = "/mobileWeb";
		}
		isDirectives=0;
		pageIndex=0;
		var that = this;

		console.log("1 "+this.$store.state.openUserId);
		console.log(this.$route.query.toUser)
		if(apiServer.isNull(this.$store.state.openUserId)){
			console.log("openUserId 为空");
			store.commit("setOpenUserId",this.$route.query.toUser.jid);
			store.commit("setOpenUserName",this.$route.query.toUser.toNickName);
			store.commit("setOpenIsRoom",this.$route.query.toUser.isRoom);
		}
		if(apiServer.isNull(this.toUserId)){
			console.log("2 "+ that.$store.state.openUserId);
			this.toUserId=this.$store.state.openUserId;
			console.log("3 "+this.toUserId)
		}
		if(apiServer.isNull(this.header)){
			console.log("头部为空 "+this.$store.state.openUserName)
			this.header = this.$store.state.openUserName;
		}

		String.prototype.replaceAll = function(s1,s2){
			return this.replace(new RegExp(s1,"gm"),s2);
		}
		if(this.items.length==0){
			console.log("item 长度为哦0")
			// console.log(this.$store.state.openIsRoom)
			apiRequest.getHistory(0,this.$store.state.openIsRoom,null,this.toUserId,function(data){
				console.log("item 长度为哦0",data,545)
				var list=[];
				data = data.reverse();
				for(var i=0;i<data.length;i++){
					var s = JSON.parse(data[i].message.replaceAll("&quot;","\""));
					// console.log(s,888,)
					s.content =WEBIM.decryptMessage(s);
					s.isRead = data[i].isRead;
					s.jid = data[i].receiver_jid
					if(s.type==1){
						// console.log(s,111)
						s =msgRequest.changeText(s);
						// console.log(s,222)
					}
					// if(message.type==902){// 修改群名称
					// 	message.content = message.fromUserName+" 修改群名为:"+message.content;
					// }else if(message.type==905){
					// 	message.content = message.fromUserName+" 发布新公告:"+message.content;
					// }else if(message.type==907){
					// 	message.content = message.fromUserName+" 邀请群成员:"+message.toUserName
					// }
					if(s.type==5){// gif
						s.content = "/static/assets/gif/"+s.content;
					}
					if(s.type==8){// 名片消息
						s.avatar = apiServer.getAvatarUrl(s.objectId);
					}
					// if(s.type>100){
					// 	continue;// 音视频消息
					// }
					if(s.type==83){
						continue;// 某个成员领取红包
					}
					if(s.type==86){
						continue;// 红包退回通知
					}
					if(s.type==202){

					}
					// console.log(s);
					list.push(s);

				}

				// 获取阅后即焚的消息列表
				let readDelRecord = store.state.readDelRecord
				let array = []
				for(let key in readDelRecord){
					if(key == store.state.openUserId){
						array = readDelRecord[key]
					}
				}
				//给阅后即焚消息添加content.type
				for(let i=0;i<array.length;i++){
					if(array[i].type == 1 && typeof(array[i].content)!="object"){
						array[i].content = [{data:array[i].content,type:'txt'}]
					}
				}
				console.log(555555,array)
				//将阅后即焚消息插入消息列表中
				for(let i = 0;i<array.length;i++){
					Vue.set(array[i],"time",10)
					for(let j = 0; j<list.length-1;j++){
						if(array[i].timeSend>list[j].timeSend&&array[i].timeSend<list[j+1].timeSend){
							console.log(66666)
							list.splice(j+1,0,array[i])
						}
						if(array[i].timeSend>list[list.length-1].timeSend){
						  console.log(646646)
							list.push(array[i])
						}
					}


				}
				// if(apiServer.isNull(store.state.msgList)){
					store.commit("setMsgList",list);
				// }
				// if(apiServer.isNull(window.sessionStorage.getItem("newMsgUserId"))||window.sessionStorage.getItem("newMsgUserId")==that.toUserId){
					that.items = store.state.msgList;
				// }
				console.log("设计院");
				console.log(that.items)
				for(let i = 0;i<that.items.length;i++){
					if(window.sessionStorage.getItem("userId") != that.items[i].fromUserId){
						if(that.items[i].isRead == 0&&!that.items[i].isReadDel){
							msgRequest.sendReadReceipt(that.items[i].fromUserId,that.items[i],1);
						}
					}
					// 若群开启已读人数设置
					if(store.state.showReadNum){
						// console.log(window.localStorage.getItem("readNum"+that.items[i].messageId))
						that.items[i].readNum = window.localStorage.getItem("readNum"+that.items[i].messageId,66)
						let backID = JSON.parse(window.sessionStorage.getItem("backID"))
						for(let j = 0;j<backID.length;j++){
							if(that.items[i].messageId == backID[j]&&!that.items.isReadDel){
								if(window.localStorage.getItem("readNum"+that.items[i].messageId)){
										// that.items[i].readNum = window.sessionStorage.getItem("readNum"+that.items[i].messageId)
										that.items[i].readNum = window.localStorage.getItem("readNum"+that.items[i].messageId)
								}else{
									that.items[i].readNum = 0
									window.localStorage.setItem("readNum"+that.items[i].messageId,that.items[i].readNum)
								}
							}
							 if(that.items[i].messageId == backID[j]&&that.items[i].isReadDel){
								//对方查看了您的这条阅后即焚消息
								let obj = {}
								obj.hasRead = 1
								// console.log(obj,67678)
								that.items.splice(i,1,obj)
							}
						}
					}
				}
			})
		}
		console.log("dom挂载完成")

		isDirectives = 0;
		setTimeout(() => {
			this.$refs.my_scroller.scrollBy(0,700,true)
		}, 200)

			// 判断该会话是否开启阅后即焚
		this.isShowFire = store.state.readDel[store.state.openUserId]
		console.log(6767,this.isShowFire)
	},
	data(){
		return {
			header:'',// 标题
			items:[],// 消息数组
			toUserId:'',
			myUserId:window.sessionStorage.getItem("userId"),
			introduct:'',
			addShow:true,
			sendButton:true,// 发送按钮
			isopenSmile:true,// 表情
			emojiObj:apiServer.emojiObj,
			smileShow:false,// 表情是否显示
			moreShow:false,// 更多按钮是否显示
			menus: {
				menu1: '视频通话',
				menu2: '语音通话'
			},
			showMenus: false,
			noDataText:'没有更多了',
			isShowVoice:true,// 语音按钮
			imageShow:false,
			BigImage:"",
			voiceShow:false,
			imgError:'this.src="' + require('../assets/download.png') + '"',
			isReadShow:false,
			style1:{'position':'relative','align-items':'flex-start','justify-content': 'flex-end'},
			style2:{'display':"none"},
			backID:store.state.backID,
			oldVals:null,
			isShowFire:false,//该会话是否开启阅后即焚
			memberNum:'', //群组人数
		}
	},
		watch:{
			items(newval,oldVal){
				console.log(newval,oldVal,22223333)
				let that = this
				if(isDirectives!=1){
					setTimeout(() => {
						this.$refs.my_scroller.scrollBy(0,300,true)
					}, 200)
				}
				//socket的消息没有recall这个属性
				// for(let i = 0;i<newval.length;i++){
				// 	if(window.sessionStorage.getItem("userId") != newval[i].fromUserId){
				// 		if(i==newval.length -1&&!newval[i].isReadDel){
				// 			msgRequest.sendReadReceipt(newval[i].fromUserId,newval[i],1);
				// 		}
				// 	}
				// 			// 判断messageId是否存在
				// for(let j = 0;j<newval.length-1;j++){
					
				// 	if(newval[newval.length-1].recall == newval[j].messageId){
				// 		// console.log(54)
				// 		that.items[j].content[0].data = newval[newval.length-1].content[0].data
				// 		that.items[j] = newval[newval.length-1]
				// 		that.items.pop(that.items[newval.length-1])
				// 	}
				// }
				// }
				store.commit("setMsgList",that.items);

			},
			//监听对方是否读取消息
			backID(newVal,oldVal){
				let that = this
			  // console.log(44)
				for(let i = 0;i<this.items.length;i++){
					if(newVal.indexOf(this.items[i].messageId)>0){
						this.items[i].isReadShow = true
							store.commit("setMsgList",that.items);
							window.sessionStorage.setItem("backID",JSON.stringify(store.state.backID))
							$("#chatMsgContent").click()
					}

					// 已读回执变化，界面改变
					if(store.state.showReadNum){
						for(let j = 0;j<newVal.length;j++){
								if(that.items[i].messageId ==newVal[j]&&that.items[i].isReadDel){
											console.log("对方查看了您的这条阅后即焚消息")
											//对方查看了您的这条阅后即焚消息
											let obj = {}
											obj.hasRead = 1
											// console.log(obj,67679)
											that.items.splice(i,1,obj)
										}
										store.commit("setMsgList",that.items)
						}
						  //若变化来自已读回执
							if(that.items[i].hasOwnProperty('readNum')){
									for(let j = 0;j<newVal.length;j++){
											if(that.items[i].messageId ==newVal[j]){
														// 对最新的回执进行已读+1
												if(j==newVal.length-1){
													// console.log("fsfsf")
														that.items[i].readNum++
														window.localStorage.setItem("readNum"+that.items[i].messageId,that.items[i].readNum)
												}
										}
								}

							}else{
								// 若变化来自新来的消息
								that.items[i].readNum = 0
							}
						// that.$refs.Inputcontent.focus()
						}
				}

			},
			delMsg(msg){
				if(msg.fromUserId == this.toUserId){
					this.$router.push({path:"/Index"})
				}
			}
		},
		computed:{
			timeFuntion(){
				return function(time){
					return apiServer.toDate(time)
				}
			},
			nowtime(){
				return new Date().getTime()
			},
			delMsg(){
				return store.state.delMsg
			}
		},
	methods:{
		seeFire(item){
			let that = this
			let msgList = store.state.msgList
			console.log(item)
			item.isReadDel = 0
			// 点击查看发送已读回执
			msgRequest.sendReadReceipt(item.fromUserId,item,1);
			item.Time = true
			let timer = null
			timer = setInterval(() => {
				item.time--
				console.log(item.time)
				// store.commit("setMsgList",msgList)
				if(item.time <= 0){
					clearInterval(timer)
					for(let i = 0;i<msgList.length;i++){
						if(item.messageId == msgList[i].messageId){
							msgList.splice(i,1)
							store.commit("setMsgList",msgList)
						}
					}
				}
			},1000)
			// 阅后即焚被点击之后删除对应会话阅后即焚消息
			let readDelRecord = store.state.readDelRecord
			let array = []
			for(let key in readDelRecord){
				if(key == store.state.openUserId){
					array = readDelRecord[key]
				}
			}
			for(let i = 0;i<array.length;i++){
				if(item.messageId == array[i].messageId){
					console.log("阅后即焚啦")
					array.splice(i,1)
					store.commit("setReadDelRecord",readDelRecord)
				}
			}

		},
		onCopy (e) {
			// console.log(e,1)
		},
		// 复制失败时的回调函数
		onError (e) {
				// console.log(e,1)
		},
		// 撤回某条消息
		clickBack(item){
			console.log(item,3399)
			let that = this
			now = item
			item.display = false
			 var msg=msgRequest.sendMessage(202,null,null,null,item.messageId,userId,nickName);
			 let is= 0
			 if(that.$route.query.isRoom){
				 is = 2
			 }else{
				 is = 1
			 }
			 apiServer.postData({
							url:'/tigase/deleteMsg/',
							data:{
								userId:userId,
								token:token,
								type:is,
								delete:2,
								messageId:item.messageId,
								roomJid:that.$route.query.toUser.jid
							}
						},function(data){
							console.log(data,"撤回了")
						})
		},
		// 转发某条消息
		orderSend(index,item){
			let that = this
			this.$router.push({path:'/OrderSend',query:{news:item}});
		},
		// 删除某条消息记录
		deleteNew(index,item){
			// console.log(item,555)
			let that = this
			this.items.splice(index,1)
			if(that.$route.query.isRoom){
					apiServer.postData({
							url:'/tigase/deleteMsg/',
							data:{
								userId:userId,
								token:token,
								type:2,
								delete:1,
								messageId:item.messageId,
								roomJid:that.$route.query.toUser.jid
							}
						},function(data){
							console.log(data,"群删除了")
						})
			}else{
				apiServer.postData({
					url:'/tigase/deleteMsg/',
					data:{
						userId:userId,
						token:token,
						type:1,
						delete:1,
						messageId:item.messageId
					}
		},function(data){
			console.log(data,"群删除了")
		})
			}
		},
		// 手指按下
		gotouchstart(index,item){
			// for(let i = 0;i<this.items.length;i++){
			// 		this.items[i].longShow = false
			// 	}
				this.$refs.Inputcontent.blur()
			// console.log(item,8899)
			let that = this
				timeOutEvent = setTimeout(function(){
					// console.log(11)
					for(let i = 0;i<that.items.length;i++){
						that.items[i].longShow = false
					}
					item.longShow = true
					console.log(item,54545)
				},500);//这里设置定时器，定义长按500毫秒触发长按事件，时间可以自己改，个人感觉500毫秒非常合适
				return false;
		},
		//手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
		gotouchend(index,item){
			// Vue.set(this.items,index,item)
				clearTimeout(timeOutEvent);//清除定时器
				if(timeOutEvent!=0){
						//这里写要执行的内容（尤如onclick事件）
				}
				return false;
		},
		//如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
		gotouchmove(){
				clearTimeout(timeOutEvent);//清除定时器
				timeOutEvent = 0;
		},
		// 点击空白处取消界面其他焦点事件
		cancelKeyboard(){
			if(!apiServer.isNull(this.$refs.Inputcontent)){
				this.$refs.Inputcontent.blur()
			}
			console.log(this.items);
				for(let i = 0;i<this.items.length;i++){
					this.items[i].longShow = false
				}

		},
		keybagDon(){
			this.isopenSmile = true;
			this.smileShow = false;
			this.moreShow =false;
			$("#chatMsgContent").removeClass("chatContent");
			$("#chatMsgTabbar").removeClass("tabberBottom");
		},
		smallImage(){
			this.imageShow = false
			this.BigImage = ''
		},
		openBig(img){
				this.BigImage = img
				this.imageShow = true
		},
		hhh:function(){
			console.log(this.$route.query.room)
			if(this.$route.query.room){
				this.$router.push('/Room');
			}else{
				this.$router.push({path:"/Index"})
			}

		},
		/* 输入框获得焦点 */
		onfocus:function(){
			this.closeSmile();
			$(window).scrollTop(0);
		},
		inputMsg:function(){
			// console.log();
			if(this.introduct.length>0){
				this.addShow = false;
			}
			if(this.introduct.length==0){
				this.addShow = true;
			}
		},
		refresh:function(){
			console.log("下拉刷新");
			isDirectives=1;
			var that = this;
			this.$refs.my_scroller.finishPullToRefresh();
			console.log(pageIndex);
			pageIndex = pageIndex+1;

			apiRequest.getHistory(pageIndex,this.$store.state.openIsRoom,null,this.toUserId,function(data){
				console.log("item 长度为哦0")
				var list=[];
				data = data.reverse();
				for(var i=0;i<data.length;i++){
					// console.log(55555)
					var s = JSON.parse(data[i].message.replaceAll("&quot;","\""));
					s.content =WEBIM.decryptMessage(s);
					if(s.type==1){
						s =msgRequest.changeText(s)
					}
					if(s.type==5){// gif
						s.content = "/static/assets/gif/"+s.content;
					}
					if(s.type==8){// 名片消息
						s.avatar = apiServer.getAvatarUrl(s.objectId);
					}
					if(s.type==83){
						continue;// 某个成员领取红包
					}
					if(s.type==86){
						continue;// 红包退回通知
					}
// 					if(s.type>100){
// 						continue;// 音视频消息
// 					}
					s.isRead = data[i].isRead;
					list.push(s);
				}

				list = list.concat(that.$store.state.msgList)
				for(let i = 0; i<list.length;i++){
					list[i].display = true
				}
				console.log(that.$store.state.msgList,11)

				// if(apiServer.isNull(that.$store.state.msgList)){
				store.commit("setMsgList",list);
				// }

				that.items = that.$store.state.msgList;
				// console.log(that.items)
					// for(let i = 0;i<that.items.length;i++){
					// if(window.sessionStorage.getItem("userId") != that.items[i].fromUserId){
					// 	console.log(that.items[i])
					// 	msgRequest.sendReadReceipt(that.items[i].fromUserId,that.items[i],1);
					// }

				}

			)

		},
		// 发送消息
		send:function(type,text,fileName,fileSize){
				// this.$refs.Inputcontent.focus()
				// setTimeout(() => {
				// 	this.$refs.my_scroller.scrollBy(0,700,true)
				// }, 100)
			console.log(this.introduct);
			var content ="";
			// var fileName = "";
			// var fileSize = "";
			// 清空文本框、隐藏发送按钮
			if(type==1){
				content = this.introduct;
				console.log(content,77)
			}else if(type==2){// 图片
				content = text;
			}else if(type==9){// 文件
				content = text;
			}
			console.log(this.toUserId)

			var msg=msgRequest.sendMessage(type,fileName,fileSize,null,content,this.toUserId,this.header);
			if(WEBIM.isEncrypt(msg)){
				msg.content=WEBIM.decryptMessage(msg);
			}
			let mess = msg.content
			console.log(mess,msg.content,"kankana啊啊啊啊啊啊啊啊啊")
			if(type==1){
				msg = msgRequest.changeText(msg);
			}
			store.commit("setMsgListOne",msg);
			if(msg.isReadDel == 1){
				let list = store.state.readDelRecord
				if(apiServer.isNull(list[msg.toUserId])){
					list[msg.toUserId] = []
				}
				list[msg.toUserId].push({})
				Object.assign(list[msg.toUserId][list[msg.toUserId].length-1],msg)
				list[msg.toUserId][list[msg.toUserId].length-1].content = msg.content[0].data
				store.commit("setReadDelRecord",list)
			}
			// 发送消息后更新消息界面此会话的最新条消息
			let lastList = store.state.lastChatList
			let flag = false
			for(let i = 0;i<lastList.length;i++){
					// console.log(9,lastList[i].from,store.state.openUserId)
				if(lastList[i].jid == store.state.openUserId){
					console.log(9,lastList[i],msg)

					// for(let h = 0;h<mess.content;h++){
					// 	if(mess.content[h].type=="emoji"){
					// 		console.log("是表情啊")
					// 		Vue.set(lastList[h],'isemoj', true)
					//    }else{
					// 	   	Vue.set(lastList[h],'isemoj', false)
					//    }
					// }
					if(msg.type==1){
						lastList[i].content =mess
					}else{
						lastList[i].content = mess.content[0].data
					}
					 //这个id肯定是要保存的，就是不明白为什么不把整条msg保存起来
					lastList[i].messageId = msg.messageId
					lastList[i].isReadDel = msg.isReadDel
					let last = lastList[i]
					lastList.splice(i,1)
					lastList.unshift(last)
					let flag = true
					// console.log(msg,76)
				}
			}
			// if(!flag){
			// 	let newM = apiServer.getOneMsg(msg.toUserId,this.$route.query.toUser.toNickName)
			// 	if(msg.type==1){
			// 		newM.content = mess
			// 	}else{
			// 		newM.content = mess.content[0].data
			// 	}
			// 	newM.type = msg.type
			// 	newM.isReadDel = msg.isReadDel
			// 	newM.isRoom = msg.isRoom
			// 	newM.messageId = msg.messageId
			// 	// 待改 将msg转化成lastList中的一项
			// 	lastList.unshift(newM)
			// }
			console.log("看看lastlist",lastList)
			//若消息列表没有该会话，则添加该会话记录
			store.commit("setLastChatMsg",lastList)
			// this.items.push(msg);
			this.introduct ="";
			this.addShow = true;
			isDirectives=0;
			if(this.isShowVoice){
				this.$refs.Inputcontent.focus()
			}
			//  this.$forceUpdate()
			// this.reload()


		},
		// 获取聊天界面好友头像
		getImg:function(item){
			if(apiServer.isNull(item.receiver)){
				return apiServer.getAvatarUrl(item.fromUserId);
			}else{
				return apiServer.getAvatarUrl(item.receiver);
			}

		},
		// 获取我的头像
		getMyImg:function(){
			return apiServer.getAvatarUrl(window.sessionStorage.getItem("userId"));
		},
		// 点击语音
		clickVoice:function(){
			this.isopenSmile = true
			console.log("发送语音");
			// if(!openUserMedia){
			// 	initUserMedia(false);
			// }
			this.isShowVoice = !this.isShowVoice;
			$("#chatMsgContent").removeClass("chatContent");
			$("#chatMsgTabbar").removeClass("tabberBottom");
			this.moreShow = false
			this.smileShow = false
			window.navigator.mediaDevices.getUserMedia({
				audio:{
					sampleRate:44100,
					channelCount:2,
					volume:1.0
				}
			}).then(mediaStream =>{
				console.log(mediaStream)
			})
		},
		// 关闭语音
		closeVoice:function(){

			this.isShowVoice = !this.isShowVoice;
			stopRecording();
		},
		// 点击笑脸图标
		openSmile:function(){
			setTimeout(() => {
				this.$refs.my_scroller.scrollBy(0,300,true)
			}, 200)
			this.isopenSmile = false;
			this.smileShow = true;
			if(!this.isShowVoice){
				this.isShowVoice = !this.isShowVoice
			}
			$("#chatMsgContent").addClass("chatContent");
			$("#chatMsgTabbar").addClass("tabberBottom");
		},
		// 点击键盘图标
		closeSmile:function(){
			setTimeout(() => {
				this.$refs.my_scroller.scrollBy(0,300,true)
			}, 200)
			this.isopenSmile = true;
			this.smileShow = false;
			if(this.moreShow){
				this.moreShow =false;
			}
			if(!this.isShowVoice){
				this.isShowVoice = true
			}
			$("#chatMsgContent").removeClass("chatContent");
			$("#chatMsgTabbar").removeClass("tabberBottom");
			this.$refs.Inputcontent.focus()
		},
		openFile:function(data){
			console.log(data);
			this.$router.push({path:'/FileInfo',query:{FileInfo:data}});
		},
		// 打开更多
		addMore:function(){
			setTimeout(() => {
				this.$refs.my_scroller.scrollBy(0,300,true)
			}, 200)
			console.log(this.moreShow);

			if(this.smileShow){
				this.smileShow =false;
			}
			if(!this.isopenSmile){
				this.isopenSmile = true;
			}
			this.moreShow = !this.moreShow;
			if(this.moreShow){
				$("#chatMsgContent").addClass("chatContent");
				$("#chatMsgTabbar").addClass("tabberBottom");
					setTimeout(() => {
							this.$refs.my_scroller.scrollBy(0,0,true)
				}, 10)
			}else{
				$("#chatMsgContent").removeClass("chatContent");
				$("#chatMsgTabbar").removeClass("tabberBottom");
			}
		},
		// 选择表情
		selectEmoji:function(emoji){
			console.log(emoji);
			if(emoji=="del.png"){
				console.log("删除")
				// this.introduct=emoji;
				let msglen=this.introduct.length-1;
				let start = this.introduct.lastIndexOf("[");
				let end = this.introduct.lastIndexOf("]");
				let len = end-start;
				if(end!=-1 && end==msglen){
					this.introduct = this.introduct.slice(0,start);
				}
			}
			var txt="";
			for(var key in apiServer.emoji.map){
				if(apiServer.emoji.map[key]==emoji){
					console.log("表情的key:",key);
					txt=key;
				}
			}
			this.introduct =this.introduct+txt;
			//输入框获取焦点
			this.inputMsg();
		},
		// 选择图片  移动端允许拍照选择

		// <!-- capture属性-->
		// <input capture="video" .../>
		selectImg:function(){
			console.log("选择图片")
			this.$refs.img.click();
		},
		// 语音视频通话
		selectAudio:function(){
			console.log("选择视频语音通话")
			this.showMenus = true;
		},
		clickAudio:function(key){
			if(key=="menu1"){
				console.log("视频")
			}else if(key == "menu2"){
				console.log("语音")
			}
		},
		// 发送位置
		selectAddress:function(){
			this.$router.push({path:'/Map',query:{map:this.$route.query.toUser}});
		},
		// 发送名片
		selectCard:function(){
			console.log("选择名片");
			this.$router.push({path:'/Card',query:{card:this.$route.query.obj}});
		},
		// 选择文件
		selectFile:function(){
			console.log("选择文件")
			this.$refs.file.click();
		},
		// 发送图片
		imgChange:function(){
			var file=$("#photoImg")[0].files[0];
			console.log(file,7777799)
			var formData = new FormData();
			var that = this;
			formData.append("file",file);
			formData.append("validTime",0);
			console.log("上传图片",formData)
			apiServer.postFile({
				data:formData
			},function(result){
				console.log(result);
				console.log(result.data.data.images[0].oUrl);
				that.send(2,result.data.data.images[0].oUrl,null,null);
			})

		},
		// 发送文件
		fileChange:function(){
			var file = $("#fileInput")[0].files[0];
			console.log("上传文件");
			var formData = new FormData();
			var that = this;
			var fileSize = file.size;
			formData.append("file",file);
			apiServer.postFile({
				data:formData
			},function(result){
				console.log(result)
				if(!apiServer.isNull(result.data.data.others[0])){
					console.log(result.data.data.others[0].oUrl);
					that.send(9,result.data.data.others[0].oUrl,result.data.data.others[0].oFileName,fileSize);
				}else if(!apiServer.isNull(result.data.data.images[0])){
					console.log(result.data.data.images[0].oUrl);
					that.send(9,result.data.data.images[0].oUrl,result.data.data.images[0].oFileName,fileSize);
				}else if(!apiServer.isNull(result.data.data.audios[0])){
					console.log(result.data.data.audios[0]);
					that.send(9,result.data.data.audios[0].oUrl,result.data.data.audios[0].oFileName,fileSize);
				}else if(!apiServer.isNull(result.data.data.videos[0])){
					console.log(result.data.data.videos[0]);
					that.send(9,result.data.data.videos[0].oUrl,result.data.data.videos[0].oFileName,fileSize);
				}


			})
		},
		// 点击地图消息
		openMap:function(x,y){
			// console.log(x+"  "+y)
			this.$router.push({path:'/Map',query:{location_x:x,location_y:y}});
		},
		openCard:function(userId){
			console.log("点击名片");
			this.$router.push({path:'/UserInfo',query:{userId:userId}});
		},
		openVoice:function(videoUrl,length){
			var type=videoUrl.substr(videoUrl.lastIndexOf('.')+1,videoUrl.length);
			if("amr"==type){
				var url=apiServer.sysConfig.uploadFileUrl+"upload/amrToMp3";
				var data=WEBIM.createOpenApiSecret();
				data.paths = videoUrl;
				var obj={
					url:url,
					data:data
				}
				var that = this;
				apiServer.postToMp3(obj,function(result){
					videoUrl = result.data.data[0].oUrl;
					// console.log(videoUrl);
					that.audio = new Audio();
					that.audio.src = videoUrl;
					let playPromise;
					//
					playPromise = that.audio.play();
					let second = length;
					if (playPromise) {
						playPromise.then(() => {
							// 音频加载成功
							// 音频的播放需要耗时
						  that.tiemr = setInterval(() => {
							second--;
							if (second <= 0) {
							  that.audio.pause()
							  clearInterval(that.tiemr);
							}
						  }, 1000);
						}).catch((e) => {
						  // 音频加载失败
						  console.error(e);
						});
					  }
				})

			}else if("wav"==type){
				// videoUrl = result.data.data[0].oUrl;
				// console.log(videoUrl);
				this.audio = new Audio();
				this.audio.src = videoUrl;
				let playPromise;
				//
				playPromise = this.audio.play();
				let second = length;
				if (playPromise) {
					playPromise.then(() => {
						// 音频加载成功
						// 音频的播放需要耗时
					  this.tiemr = setInterval(() => {
						second--;
						if (second <= 0) {
						  this.audio.pause()
						  clearInterval(this.tiemr);
						}
					  }, 1000);
					}).catch((e) => {
					  // 音频加载失败
					  console.error(e);
					});
				}
			}else{

			}


		},
		moreInfo:function(){
			console.log("点击更多")
			console.log(toUser)
			if(toUser.isRoom==1){
				console.log(this.$store.state.myRooms[toUser.jid]);
				let chatRoom=this.$store.state.myRooms[toUser.jid];
				this.$router.push({path:'/RoomInfo',query:{room:chatRoom}});
			}else{
				// 进入单聊聊天设置
				this.$router.push({path:'/ChatSetting',query:{toUserId:this.$store.state.openUserId,isShowFire:this.isShowFire,isRoom:this.$route.query.isRoom}});
			}

		},
		startVoice:function(){

			this.voiceShow = true
			console.log("开始录音");
			 if(!openUserMedia){
				 console.log("oggggg")
				 // initUserMedia(false);
				 // startRecording();
			    return ;
			  }else{
			  	 startRecording();
			  }
		},
		endVoice:function(){
			this.voiceShow = false;
			console.log("结束录音");
			var obj=stopRecording();
			console.log("stopRecording:",obj)
			var url="";
			var that = this;
			obj.then(val=>{
				console.log(val);
				var data= new FormData();
				console.log(window.localStorage.getItem("userId"));
				console.log(val.blob);
				data.append("userId",window.sessionStorage.getItem("userId"));
				data.append("file",val.blob);
				data=WEBIM.createOpenApiSecret(data);
				apiServer.postVoiceFile({
					data:data
				},function(result){
					url=result.data;
					console.log("上传的文件")
					console.log(result.data);
					var msg=msgRequest.sendvoiceMessage(url,obj.time,that.toUserId,that.header);
					store.commit("setMsgListOne",msg);
					isDirectives=0;
				})
			});
			if(!openUserMedia){
				initUserMedia(false);
			}
		},
		// 点击用户头像进入详情
		userInfo:function(item){
			// console.log(item.fromUserId);
			this.$router.push({path:'/UserInfo',query:{userId:item.fromUserId}});
		}

	},
	components:{
		XHeader,
		Flexbox,
		FlexboxItem,
		XTextarea,
		Tabbar,
		TabbarItem,
		Swiper,
		SwiperItem,
		Grid,
		GridItem,
		PopupRadio,
		Actionsheet,
		XButton
	}
}
</script>

<style>
.isRead{
float: right;
color: white;
font-size:11px;
  -webkit-transform-origin-x: 0;
	-webkit-transform: scale(0.8);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center
}
.readFire{
	background:green;
	padding:2px;
	border-radius:100%;
	color:white;
	 -webkit-transform-origin-x: 0;
	-webkit-transform: scale(0.8);
	margin-left:3px;
	width:15px;
	height:15px;
	text-align: center;
}
.isRead span {
	border-radius: 2px;
	padding:2px
}
.isRead img {
	margin-top: 3px
}
	*{
		margin: 0;
		padding: 0;
	}
	body{
		text-align: center;
		/* background-color: #D0D0D0; */
	}
	a{
		text-decoration: none;
	}
	/* input, textarea {
		-webkit-user- select: auto!important;
		-khtml-user-select: auto!important;
		-moz-user-select: auto!important;
		-ms-user-select: auto!important;
		-o-user-select: auto!important;
		user-select: auto!important;
	} */
	.header{
		position: fixed;
		top: 0;
		z-index: 1;
		width: 100%;

	}
	.tabberWarpY{
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		background: #fff;
		padding:15px 0 15px;
	}
	.tabber_img{
		width: 2.0rem;
		height: 2.0rem;
	}
	.chatImg{
		width: 35px;
		height:35px;
		margin-right: 5px;
		margin-left: 5px;
		margin-bottom: 5px;
		margin-top: 5px;
		/* position: relative; */
		float: right;
		border-radius: 40px;
	}
	.chat-limit-length {
		/* max-width: 15.625rem; */
		/* max-width: 250px; */
		/* word-wrap:break-word; */
		/* overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin: 0; */
	}
	.moreImg{
		width: 50px;
		height: 50px;
	}
	.gridItem{
		padding-top: 5px;
	}
	.tabberBottom{
		margin-bottom: 138px;
	}
	.chat_div{
		margin-top: 45px;
		margin-bottom: 50px;
	}
	.chatContent{
		margin-bottom: 165px;
	}
	.padd.bubble_primary.right.arrow_primary:before, .padd.bubble_primary.right:after {
		border-left-color: #8AE7D8;
		border-left-width: 6px;
		background:#F0EFF4
	}
	.pacc.bubble_primary.right:after{
			border-left-color: #fff;
		border-left-width: 6px;
	}
	.bubble.right:after, .bubble.right:before {
		left: 100%;
	}
	.bubble:after, .bubble:before {
		position: absolute;
		top: 11px;
		border: 6px solid transparent;
		content: " ";
	}


	.bubble_cont {
    word-wrap: break-word;
    word-break: break-all;
    min-height: 25px;
	}


	.bubble.bubble_primary {
		background-color: #8AE7D8;
			float: right;
		max-width: 230px;

	}
	.bubble {
		max-width: 230px;
		/* min-height: 1em; */
	   word-wrap: break-word;
	  word-break: break-all;

		vertical-align: top;
		position: relative;
		text-align: left;
		font-size: 14px;
		border-radius: 3px;
		-moz-border-radius: 3px;
		-webkit-border-radius: 3px;
		margin: 6px 10px;
	}
	.bubble img {
		vertical-align: bottom
	}

	.padd{
		padding:5px 8px;
	}

	.bubble_cont .plain {
		padding: 6px 12px;
	}

	.bubble_cont {
		word-wrap: break-word;
		word-break: break-all;
		/* min-height: 25px; */
	}

	pre {
		margin: 0;
		font-family: inherit;
		font-size: inherit;
		white-space: pre-wrap;
		word-break: normal;
		display: block;
	}

	.js_message_plain {
		/* margin: 0;
		font-family: inherit;
		font-size: inherit;
		line-height: 0.2;
		white-space: pre-wrap;
		word-break: normal;
		display: block;
		border:0;
		background-color: 0;
		background-color: #fffefe00; */
	}
	.bubble.bubble_default {
		background-color: #fff;
	}
	.padd.left:after {
		border-right-color: #fff;
		border-right-width: 6px;
	}

	.pacc.left:after{
		border-right-color: #fff;
		border-right-width: 6px;
	}
	.bubble.left:after, .bubble.left:before {
		right: 100%;
	}

	.bubble.right:after, .bubble.right:before {
		left: 100%;

	}
	.moreInfoImg{
		margin-top: -2px;
		width: 25px;
	}
	.hongbao {
		background:#ff8a2a;
		padding:10px 5px;
		display: flex;
		align-items: center;
		color: white
	}
	.hongbao img {
			width: 35px;
			margin-right: 8px
	}
	.hongbaoP {
		background: white;
		font-size: 11px;
		padding:3px 10px;
		color:#aaa;
	}
	.fileImage {
		width: 40px;
	}
	.file {
		background:white;
		padding:3px 0;
	}
	.fileTop {
		border-bottom: 1px solid #ddd;
		font-size: 12px;
		font-weight: 500;
		margin:0px 5px;
		padding:0px 0px 4px;

	}
	.file p {
		font-size: 11px;
		color: gray;
		padding-left: 5px
	}
	.fileTop span {
		/* position: relative;
		top:-15px;
		left:5px */
		vertical-align: top;
		display: inline-block;
		margin-left: 7px;
		margin-top:3px;
	}
	#moreT {
		position: relative;
		width: 40px;
		height: 40px;
		margin-left: 50%;
		left:-20px;

	}
	.tabberWarpY p {
		color:gray;
		font-size: 11px;
		position: relative;
		top:13px
	}
	.weui-grids .weui-grid::after{
		border:none
	}
	/* .weui-grid__icon {
		margin:0 auto;
	} */

	.tabberWarpY .weui-grids:before{
		border:none;
	}
	.tabberWarpY .vux-slider > .vux-indicator-center {
		bottom:0;
	}
	#chat .vux-header .vux-header-left .left-arrow:before{
		border: 1px solid #fff;
		border-width: 1px 0 0 1px;
	}
    #chat .vux-header .vux-header-left a{
		float: left;
		margin-right: 8px;
		color: #fff;
    }

	.langVoice{
		moz-user-select: -moz-none;
	    -moz-user-select: none;
	    -o-user-select:none;
	    -khtml-user-select:none;
	    -webkit-user-select:none;
	    -ms-user-select:none;
	    user-select:none;
	}

	.marsh{
		background:black;
		height:100%;
		position:absolute;
		left:0;
		right:0;
		z-index:1000;
		display: flex;
		justify-content: center;
		align-items: center
	}
	.showTabbar{
		height:138px
	}
	.disp {
		display: none
	}
	.recordVioce {
		width:100px;
		height:100px;
		position:absolute;
		margin-top:90%;
		top:-50px;
		margin-left: 50%;
		left:-50px;
		opacity:0.8;

	}
	.fileMsg_div{
		display: table-cell;
		vertical-align: middle;
	}
	.longShow {
		background:rgba(0,0,0,.8);
		display: flex;
		flex-direction: row;
		position: absolute;
		top:-30px;
		left:13px;
		color:white;
		width: 65%;
		height:30px;
		justify-content: center;
		align-items: center;
		border-radius: 5px
	}
	.longShow2{
			background:rgba(0,0,0,.8);
		display: flex;
		flex-direction: row;
		position: absolute;
		top:-30px;
		right:13px;
		color:white;
		width: 65%;
		height:30px;
		justify-content: center;
		align-items: center;
		border-radius: 5px
	}
	.longShow div,.longShow2 div{
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		border-right: 1px solid #F0EFF4;
		font-size: 13px;
	}
	.trian {
		/* width:0;
		height:0;
		border-right:50px solid transparent;
		border-left:50px solid transparent;
		border-top:50px solid red; */
		position: absolute;
		/* left:0;
		top:0 */
	}
.tag-read {

}

</style>
