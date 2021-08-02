import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

// const state={// 设置要全局访问的state对象
// 	showFooter:true,
// 	changableNum:0,
// 	// 要设置的初始属性值
// }

const store = new Vuex.Store({
	state:{
		// 初始化状态
		userId:'123',//登陆用户的id
		access_token:'222',//登陆用户的token
		sysMsgNum:0,// 系统消息数量
		friendsMsgNum:[], // 好友消息数量列表 userId
		friendsMap:{}, // 好友列表
		myRooms:{}, // 使用jid保存
		rooms:{},// 使用id保存
		lastChatList:[], // 最后一条消息记录列表
		msgList:[],// 消息列表保存某一个人的消息列表
		newMsgList:[],// 最新一条消息列表
		openUserId:"",// 会话窗口userId
		openUserName:"", // 会话窗口userName
		openIsRoom:0,// 会话窗口是否为群组
		roomInfo:{},// 群组信息
		roomId:"",//最新打开群组的jid
		allMember:[],//最新打开群组的群成员信息
		newFriendMsgList:null,//新的好友验证消息列表
		newMessageJid:null,//新消息的jid
		backID:[],//message已读ID
		blackList:[], //黑名单列表
		showReadNum:{} ,//已读人数个数
		readDel:{},//开启阅后即焚的会话
		readDelRecord:{},//每个会话的阅后即焚记录
		delMsg:{},//记录收到505那条消息
	},
	mutations:{
		setDelMsg(state,msg){
			state.delMsg = msg
		},
		// 处理状态（修改）
		setUserId(state,userId){
			state.userId = userId;
		},
		setAccess_token(state,access_token){
			state.access_token = access_token;
		},
		setfriendsMap(state,map){
			for(var i=0;i<map.length;i++){
				var obj=map[i];
				state.friendsMap[obj.toUserId] =obj;
			}
			sessionStorage.setItem("friendsMap",JSON.stringify(state.friendsMap));
			// sessionStorage.setItem("friendsMap",state.friendsMap);

		},
		setRoomList(state,list){
			for(var i=0;i<list.length;i++){
				var obj=list[i];
				state.myRooms[obj.jid]=obj;
				state.rooms[obj.id]=obj;
			}
		},
		setMyRooms(state,map){
			state.myRooms = map;
		},
		setRooms(state,map){

			state.rooms = map;
		},
		setRoomListByOne(state,room){
			state.rooms[room.id] = room;
			state.myRooms[room.jid]=room;
		},
		// 设置最后一条消息记录
		setLastChatMsg(state,list){

			state.lastChatList = list;

		},
		setMsgList(state,list){
			for(let i = 0; i<list.length;i++){
				// list[i].longShow = false
				Vue.set(list[i],'longShow', false)
				Vue.set(list[i],'display', true)
				//这个判断确保赋值一次
				if(list[i].time==undefined){
					Vue.set(list[i],"time",10)
				}
				// list[i].display = true
				// list[i].setWords = false
			}
			state.msgList = list;
		},
		setMsgListOne(state,msg){
			state.msgList.push(msg);
		},
		setOpenUserId(state,userId){
			state.openUserId = userId;
		},
		setOpenUserName(state,userName){
			state.openUserName = userName;
		},
		setOpenIsRoom(state,isRoom){
			state.openIsRoom = isRoom;
		},
		setSysMsgNum(state,num){
			console.log("设置系统消息数量")
			state.sysMsgNum = state.sysMsgNum+num;
			// window.sessionStorage.setItem("sysMsgNum",parseInt(1));// 设置总的消息数量
		},
		setfriendsMsgNum(state,userId){
			state.friendsMsgNum.push(userId);

		},
		setRoomInfo(state,room){
			state.roomInfo = room;
		},
		setNewMsgList(state,msg){
			state.newMsgList.push(msg);
		},
		setNewFriendMsgList(state,list){
			state.newFriendMsgList = list
		},
		setBackID(state,oneId){
			state.backID.push(oneId);

			// state.backID = list
		},

		setBlackList(state,list){
			state.blackList = list
		},
		setshowReadNum(state,list){
			state.showReadNum = list
		},
		setReadDel(state,list){
			state.readDel = list
		},
		setReadDelRecord(state,list){
			state.readDelRecord = list
		}
	},
	actions:{

	},
	getters:{
		// 获取数据
		getUserId(state){
			return state.userId;
		},
		getAccess_token(state){
			return state.access_token;
		}
	}
});

export default store;



