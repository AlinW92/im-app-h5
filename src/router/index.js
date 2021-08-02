import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Index from '@/components/Index'
import People from '@/components/People'
import Me from '@/components/Me'
import BaseInfo from "@/components/me/baseInfo"
import ResetPassword from "@/components/me/resetPassword"
import PrivacySetting from "@/components/me/privacySetting"
import Register from "@/components/Register"
import Chat from "@/components/Chat"
import Room from "@/components/people/Room"
import BlackList from "@/components/people/BlackList"
import NewFriend from "@/components/people/NewFriend"
import MyCompany from "@/components/people/MyCompany"
import Public from "@/components/people/Public"
import Card from "@/components/chat/Card"
import FileInfo from "@/components/chat/FileInfo"
import Map from "@/components/Map"
import UserInfo from "@/components/people/UserInfo"
import addRoom from "@/components/room/addRoom"
import addRoom_selectUser from "@/components/room/addRoom_selectUser"
import FunInfo from "@/components/FunInfo"
import ForgetPassword from "@/components/ForgetPassword"
import ChatSetting from "@/components/chat/ChatSetting"
import RoomInfo from "@/components/room/RoomInfo"
import SharedFile from "@/components/room/SharedFile"
import addFriend from "@/components/people/addFriend"
import searchFriend from "@/components/people/searchFriend"
import room_menber from "@/components/people/room_menber"
import roomPublic from "@/components/room/roomPublic"
import selectPeople from "@/components/room/selectPeople"
import deletePeople from '@/components/room/deletePeople'
import noWords from '@/components/room/noWords'
import OrderSend from "@/components/chat/OrderSend"
// import blackList from "@/components/me/blackList"
// import Test from "@/components/Test"


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
		{
			path:'/Index',
			name:'Index',
			component:Index
		},
		{
			path:'/People',
			name:'Index',
			component:People
		},
		{
			path:'/Me',
			name:'Me',
			component:Me
		},
		{
			path:'/BaseInfo',
			name:'BaseInfo',
			component:BaseInfo
		},
		{
			path:'/ResetPassword',
			name:'ResetPassword',
			component:ResetPassword
		},
		{
			path:'/PrivacySetting',
			name:'PrivacySetting',
			component:PrivacySetting
		},
		{
			path:'/Register',
			name:'Register',
			component:Register
		},
		{
			path:'/Room',
			name:'Room',
			component:Room
		},
		{
			path:'/BlackList',
			name:'BlackList',
			component:BlackList
		},
		{
			path:'/NewFriend',
			name:'NewFriend',
			component:NewFriend
		},
		{
			path:'/MyCompany',
			name:'MyCompany',
			component:MyCompany
		},
		{
			path:'/Public',
			name:'Public',
			component:Public
		},
		{
			path:'/Chat',
			name:'Chat',
			component:Chat
		},
		{
			path:'/Card',
			name:'Card',
			component:Card
		},
		{
			path:'/FileInfo',
			name:'FileInfo',
			component:FileInfo
		},
		{
			path:'/Map',
			name:'Map',
			component:Map
		},
		{
			path:'/UserInfo',
			name:'UserInfo',
			component:UserInfo
		},
		{
			path:'/addRoom_selectUser',
			name:'addRoom_selectUser',
			component:addRoom_selectUser
		},
		{
			path:'/addRoom',
			name:'addRoom',
			component:addRoom
		},
		{
			path:"/FunInfo",
			component:FunInfo
		},
		{
			path:"/forgetPassw",
			component:ForgetPassword
		},
		{
			path:'/ChatSetting',
			name:'ChatSetting',
			component:ChatSetting
		},
		{
			path:'/RoomInfo',
			name:'RoomInfo',
			component:RoomInfo
		},
		{
			path:'/SharedFile',
			name:'SharedFile',
			component:SharedFile
		},
		{
			path:'/addFriend',
			name:'addFriend',
			component:addFriend
		},
		{
			path:'/searchFriend',
			name:'searchFriend',
			component:searchFriend
		},
				{
			path:"/room_menber",
			name:"room_menber",
			component:room_menber
		},
		{
			path:"/roomPublic",
			name:"roomPublic",
			component:roomPublic
		},
		{
			path:"/selectPeople",
			name:'selectPeople',
			component:selectPeople
		},
		{
			path:"/deletePeople",
			name:'deletePeople',
			component:deletePeople
		},
		{
			path:"/noWords",
			name:"noWords",
			component:noWords
		},
		{
			path:"/OrderSend",
			name:"OrderSend",
			component:OrderSend
		}
  ]
})
