<!-- 群组信息 -->
<template>
	<div id="roomMemmber">
		<div class="header">
			<x-header style="background:#55BEB7">群主成员</x-header>
		</div>
        <div  style="position:absolute;left:0;top:46px;right:0">
            <div v-for="item in allMember" class="MenberList" @click="toBaseInfo(item.userId)">
                <img :src="item.avatar" alt="" :onerror="imgError">
                <span class="Roomrole1" v-if="item.role==1">群主</span>
                <span  class="Roomrole2" v-else-if="item.role==0">群管理员</span>
                <span class="Roomrole3" v-else>普通成员</span>
                <span style="color:black;font-size:15px">{{item.nickname}}</span>
            </div>
        </div>
	</div>
</template>

<script>
import {XHeader,XButton,Group,Cell,XSwitch,Alert,TransferDomDirective as TransferDom} from 'vux'
import apiRequest from '../../public/apiRequest.js'
import apiServer from '../../public/apiServer.js'
import store from '../../store'
export default {
	name:'room_menber',
	directives:{
		TransferDom
	},
	created(){
       
	},
	mounted(){
         console.log(this.allMember,this.roomId)
        
        
	
	},
    methods:{
        toBaseInfo(userId){
            this.$router.push({path:'/UserInfo',query:{userId:userId}});
        }
       
    },
	data(){
		return{
            allMember:this.$store.state.allMember,
            roomId:this.$store.state.roomId,
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
</style>
