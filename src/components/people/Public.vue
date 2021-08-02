<template>
	<div>
		<div class="header">
			<x-header  style="background:#55BEB7">公众号</x-header>
		</div>
	</div>
</template>

<script>
import {XHeader,Flexbox, FlexboxItem} from 'vux'
import apiRequest from '../../public/apiRequest.js'
import store from '../../store'
export default {
	name:"Public",
	data(){
		return{
			
		}
	},
	created(){
		if(apiServer.isNull(window.sessionStorage.getItem("access_token"))){
			window.location.href = "/mobileWeb";
		}
	},
	components:{
		XHeader,
		Flexbox,
		FlexboxItem
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
</style>
