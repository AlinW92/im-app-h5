<template>
	<div id="addFriend">
		<div>
			<x-header style="background:#55BEB7">添加好友</x-header>
		</div>
		<div>
			<group>
				<cell title="昵称或手机号码" class="cellHeight" align="left"><x-input placeholder="请输入昵称或手机号码" v-model="keyWord" style="float:right;width: 100%;margin-right: -55px;"></x-input></cell>
			</group>
		</div>
		<x-button @click.native="search" style="background:#55BEB7;width: 95%;color: white;margin-top: 10%;">搜索</x-button>
		
		<div v-transfer-dom>
		  <alert v-model="show">{{Please}}</alert>
		</div>
	</div>
	
</template>

<script>
import apiServer from '../../public/apiServer.js'
import {XHeader,Group,Cell,XButton,XInput,Alert,TransferDomDirective as TransferDom} from "vux"
export default {
	name:"addFriend",
	directives:{
		TransferDom
	},
	data(){
		return{
			keyWord:'',
			show:false,
			Please:''
		}
	},
	methods:{
		search:function(){
			console.log("搜索");
			if(apiServer.isNull(this.keyWord)){
				this.Please="请输入昵称";
				this.show = true;
				return;
			}
			this.$router.push({path:'/searchFriend',query:{keyWord:this.keyWord}});
		}
	},
	components:{
		XHeader,
		Group,
		Cell,
		XButton,
		XInput,
		Alert,
	}
}
</script>

<style>
	.cellHeight{
		height: 30px;
	}
	#addFriend .weui-cells {
    margin-top: 1.17647059em;
    background-color: #FFFFFF;
    line-height: 1.41176471;
    font-size: 14px;
    overflow: hidden;
    position: relative;
	margin-right:0
}
	#addFriend .vux-cell-primary {
   flex:none
}
#addFriend .weui-input {
    /* width: 100%; */
    border: 0;
    outline: 0;
    -webkit-appearance: none;
    background-color: transparent;
    font-size: inherit;
    color: inherit;
    height: 1.41176471em;
    line-height: 1.41176471;
}
</style>
