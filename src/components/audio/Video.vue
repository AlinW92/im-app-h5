<template>
	<div>
		
	</div>
</template>

<script>
export default {
	name:'Video',
	data(){
		return{
			
		}
	},
	methods:{
		
	},
	components:{
		
	},
	create(){
		if(apiServer.isNull(window.sessionStorage.getItem("access_token"))){
	window.location.href = "/mobileWeb";}
	}
}
</script>

<style>

</style>
