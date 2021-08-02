<!-- 群组禁言 -->
<template>
	<div id="noWords">
		<div>
			<x-header style="background:#55BEB7">群主成员</x-header>
		</div>
        <div>
            <div v-for="item in allMember" class="MenberList" @click="noWordsOne(item.userId)">
                <img :src="item.avatar" alt="">
                <span class="Roomrole1" v-if="item.role==1">群主</span>
                <span  class="Roomrole2" v-else-if="item.role==0">群管理员</span>
                <span class="Roomrole3" v-else>普通成员</span>
                <span style="color:black;font-size:15px">{{item.nickname}}</span>
            </div>
        </div>
      <div class="noWordsBottom" v-if="ifShowNowords" @click="cancelNowords">
          <div class="innerNowords" @click.stop=""> 
              <div v-for="(item,index) in noWordsText" @click="selectNoword(item,index)">{{item}}</div>
          </div>
      </div>
      <toast v-model="showToast" toast-content-font-size='12px' type="text" position="bottom">禁言成功</toast>
	</div>
</template>

<script>
import {XHeader,Toast,XButton,Group,Selector,Cell,XSwitch,Alert,TransferDomDirective as TransferDom} from 'vux'
import apiRequest from '../../public/apiRequest.js'
import apiServer from '../../public/apiServer.js'
import store from '../../store'
let token = sessionStorage.getItem('access_token');
let talkTime = null
export default {
	name:'noWords',
	directives:{
		TransferDom
	},
	created(){
       
	},
	mounted(){
         console.log(this.allMember,this.roomId)
        
        
	
	},
    methods:{
        selectNoword(item,index){
            let that = this
            let time = parseInt((new Date().getTime())/1000)
              console.log(item,index,time)
            for(let i = 0; i<that.noWordsTime.length; i++){
                if(item=="不禁言"){
                    talkTime = 0
                }else{
                    talkTime = that.noWordsTime[i]+time
                }
                if(i == index){
                apiServer.postData({
                    url:'/room/member/update',
                    data:{
                        talkTime:talkTime,
                        access_token:token,
                        userId:that.userId,
                        time:time,
                        roomId:that.roomId
			    }
            },function(data){
                console.log(data,44)
                that.ifShowNowords = false
                that.showToast = true
                let list = store.state.msgList
                for(let i = 0;i<list.length;i++){
                    //  list[i].setWords = false
                    // if(that.userId == list[i].toUserId){
                    //     if(item == "不禁言"){
                    //         list[i].setWords = list[i].content
                    //         console.log(list,555)
                    //     }
                    // }
                }
                	store.commit("setMsgList",list);
            })
                }
            }
        },
        cancelNowords(){
             this.ifShowNowords = false
        },
        noWordsOne(userId){
            this.ifShowNowords = true
            this.userId = userId
        }
       
    },
	data(){
		return{
            allMember:this.$store.state.allMember,
            roomId:this.$store.state.roomId,
            noWordsText:["不禁言","禁言30分钟","禁言1小时","禁言1天","禁言3天","禁言1周","禁言半个月"],
            noWordsTime:[0,30*60,60*60,24*60*60,3*24*60*60,7*24*60*60,15*24*60*60],
            ifShowNowords:false,
            userId:"",
            showToast:false,
            noControlWords:false
		}
	},

	components:{
		XHeader,
		XButton,
        Group,
        Selector,
		Cell,
		XSwitch,
        Alert,
        Toast
	}
}
</script>

<style>
.MenberList {
    height:50px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background:white;
    border-bottom: 1px solid #eee;
    padding-left: 10px;
}
.MenberList img {
    width: 35px;
    height:35px;
    border-radius: 35px
}
.MenberList span {
    margin-left: 10px;
    font-size: 12px;
    color: white;
    }
.Roomrole1 {
    background:orange;
    padding:1px 2px;
    border-radius: 3px
}
.Roomrole2 {
    background:green;
    padding:1px 2px;
     border-radius: 3px
}
.Roomrole3 {
    background:skyblue;
    padding:1px 2px;
    border-radius: 3px
}
.noWordsBottom {
    	width: 100%;
		height:100%;
		background:rgba(0, 0, 0, .4);
		position:fixed;
		left: 0;
		top:0;
		right:0;
		left:0;
		display: flex;
		justify-content: center;
		align-items: flex-end
}
.innerNowords {
    background:white;
    width: 100%;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px
}
.innerNowords div {
    height:30px;
    line-height: 30px;
    font-size:14px;

}
</style>
