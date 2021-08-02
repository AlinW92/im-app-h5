<template>
	<div></div>
</template>

<script>
export default {
	name:'Voice',
	data(){
		return{
			
		}
	},
	methods:{
		
	},
	components:{
		
	},
	created(){
		if(apiServer.isNull(window.sessionStorage.getItem("access_token"))){
		window.location.href = "/mobileWeb";}	
	}
}
</script>

<style>
</style>
