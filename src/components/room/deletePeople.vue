<!-- 删除群成员 -->
<template>
	<div id="delete">
		<div class="header">
			<x-header style="background:#55BEB7">群主成员</x-header>
		</div>
        <div style="position:absolute;left:0;top:46px;right:0;height:100%;">
            <div>
            <div v-for="item in allMember" class="MenberList" @click="toDelete(item.userId,item.nickname)">
                <img :src="item.avatar" alt="" class="showimgBackground2" :onerror="imgError">
                <span class="Roomrole1" v-if="item.role==1">群主</span>
                <span  class="Roomrole2" v-else-if="item.role==0">群管理员</span>
                <span class="Roomrole3" v-else>普通成员</span>
                <span style="color:black;font-size:15px">{{item.nickname}}</span>
            </div>
        </div>
        <div class="deleteMash" @click="closeMash" v-if="ifShow">
            <div class="innerMash">
                <div style="height:60px;line-height:60px;font-size:14px">确定将{{nickname}}移出群组？</div>
                <div class="bottomDele">
                    <div @click="cancelDelete">取消</div>
                    <div @click="ComfirmDelete" style="border-left:1px solid #eee">确定</div>
                </div>
            </div>
        </div>
        </div>
	</div>
</template>

<script>
import {XHeader,XButton,Group,Cell,XSwitch,Alert,TransferDomDirective as TransferDom} from 'vux'
import apiRequest from '../../public/apiRequest.js'
import apiServer from '../../public/apiServer.js'
import store from '../../store'
let token = sessionStorage.getItem('access_token');
export default {
	name:'RoomInfo',
	directives:{
		TransferDom
	},
	created(){
       
	},
	mounted(){
         console.log(this.$route.query.allMember,this.roomId)
	},
    methods:{
        closeMash(){

        },
        toDelete(userId,nickname){
            this.ifShow = true
            this.userId = userId
            this.nickname = nickname
        },
        ComfirmDelete(){
            let that = this
              apiServer.postData({
                url:'/room/member/delete',
                data:{
                    access_token:token,
                    roomId:that.$route.query.roomId,
                    userId:that.userId
                }
            },function(data){
            // console.log(1)
            console.log(data)
            for(let i = 0;i<that.allMember.length;i++){
                if(that.allMember[i].userId == that.userId){
                    that.allMember.splice(i, 1); 
                }
            }
             that.ifShow = false
             that.$router.go(-1)
            })
           this.$forceUpdate();
        },
        cancelDelete(){
             this.ifShow = false
        }
       
    },
	data(){
		return{
            allMember:this.$route.query.allMember,
            roomId:this.$route.query.roomId,
            ifShow:false,
            userId:"",
            imgError:'this.src="' + require('../../assets/download.png') + '"'
		}
	},

	components:{
		XHeader,
		XButton,
		Group,
		Cell,
		XSwitch,
		Alert
	}
}
</script>

<style>
.showimgBackground2{
    display: inline-block;
    width: 35px;
    height: 35px;
    background: url(../../assets/download.png) no-repeat;
	background-size: 35px 35px
    /* margin: 25px 0; */
 }
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
.deleteMash {
    	width: 100%;
		height:100%;
		background:rgba(0, 0, 0, .4);
		position:absolute;
		left: 0;
		top:0;
		right:0;
		left:0;
		display: flex;
		justify-content: center;
		align-items: center
}
.innerMash {
    	width: 250px;
		background:white;
		border-radius: 10px;
}
.bottomDele {
    display: flex;
    border-top: 1px solid #eee;
}
.bottomDele div {
    flex:1;
    height:40px;
    line-height: 40px
}
</style>
