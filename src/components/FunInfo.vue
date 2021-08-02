<template>
  <div class="funInfo">
    <div class="header">
        <x-header style="background:#55BEB7">基本信息</x-header>
    </div>
    <div class="text-center" style="width:100%;position:relative;height:230px">
      <img src="../assets/lu.png" @click="selectImg" v-if="isdefultImg" alt="" style="width:100%;height:250px">
      <img :src="img" v-if="ifshow" alt="" style="width:100%;height:250px">
      <div v-else  style="width:100%;height:200px"></div>
      <input id="photoImg" accept="image/*" @change="imgChange" ref="img" type="file" style="display: none;">
    </div>
    <div>
      <group>
        <cell title="昵称" class="cellHeight" align="left"><x-input placeholder="请输入姓名" v-model="nickName" required></x-input></cell>
        <popup-radio title="性别" :options="sexList" v-model="sex" class="cellHeight" @on-change="sexChange" align="left"></popup-radio>
        <datetime title="出生日期" v-model="birthday" class="cellHeight" @on-change="dataChange" align="left" ref="datetime"></datetime>
        <x-address title="居住地" style="height:45px" placeholder="请选择地区(默认选第一个)" :list="addressData" @on-shadow-change="addressChange" align="left"></x-address>
      </group>
    </div>
    <div class="bottombtn">
      <span @click="Register">确定</span>
    </div>
     <alert v-model="show" >{{text}}</alert>
  </div>
</template>

<script>
import {Alert,XHeader,Group,Cell,XButton,Datetime,XAddress,ChinaAddressV4Data ,PopupRadio
,XInput} from 'vux'
import apiRequest from '../public/apiRequest.js'
import apiServer from '../public/apiServer.js'
 export default {
   data () {
     return {
        value:['2017-01-15', '03', '05'],
        sex:'',
        sexList:['男','女'],
        addressData:ChinaAddressV4Data,
        birthday:'',
        nickName:'',
        telephone:'',
        password:'',
        show:false,
        text:"",
        userAvatar: undefined,
        showFace: false,
        imgList: [],
        size: 0,
        limit:6, //限制图片上传的数量
        tempImgs:[],
        ifshow:false,
        isdefultImg:true,
        img:"",
        formData:'',
     }
   },
   created(){
     this.telephone=this.$route.query.telephone;
     this.password=this.$route.query.password;
    //  if(apiServer.isNull(window.sessionStorage.getItem("access_token"))){
		// 	window.location.href = "/mobileWeb";
    // }
    let obj = {}
    obj.file = {}
    obj.file.src = "../assets/download.png"
    this.imgList.push(obj)
   },
   methods:{
    imgChange:function(){
        let that = this
        console.log(12)
        var file=$("#photoImg")[0].files[0];
        console.log(file,7777799)
        this.formData = new FormData();
        this.formData.append("file",file);
        var URL = window.URL || window.webkitURL;
        var imgURL = URL.createObjectURL(file);
        this.img = imgURL;
        this.isdefultImg = false;
        this.ifshow = true;

		},
    selectImg:function(){
			console.log("选择图片")
			this.$refs.img.click();
		},

     sexChange(){

     },
     dataChange(){

     },
     addressChange(ids,names){
       this.address = names
     },
    Register(){
      if(apiServer.isNull(this.nickName) || apiServer.isNull(this.$refs.img.value) || apiServer.isNull(this.sex) || apiServer.isNull(this.$refs.datetime.value)){
        this.text = "请输入完整的个人信息和上传头像"
        this.show = true
      }else{
        let that = this
      console.log(this.telephone,this.password,this.nickName,this.birthday)
     let birthday = apiServer.toTimestamp(this.birthday)
        apiRequest.register(this.telephone,this.password,this.nickName,birthday,async function(result){
          if(result.resultCode ==1){
              console.log("注册成功")
              that.text = "注册成功"
              that.show = true
              //下面的that.formData为undefined导致axios执行了catch回调,未定义是因为用户没有输入头像信息
              that.formData.append("userId",result.data.userId)
              apiServer.postAvatarFile({
                  data:that.formData
              },function(result1){
                  console.log(result1);
                  console.log(result1.data.data.images[0].oUrl);
                  that.ifshow = true
                  that.img = result1.data.data.images[0].oUrl
              })

              setTimeout(function(){
                  window.location.href = "/mobileWeb";
              },900);//这里设置定时器，定义长按500毫秒触发长按事件，时间可以自己改，个人感觉500毫秒非常合适
          }else {
              console.log("手机号已经注册")
              that.text = "手机号已被注册"
              that.show = true
          }
          console.log(result);
        });
      }

    }
   },
   components: {
    	XHeader,
			Group,
			Cell,
			XButton,
			Datetime,
			XAddress,
			ChinaAddressV4Data,
      PopupRadio,
      XInput,
      Alert,
   }
 }
</script>

<style>
.yy {
  background: #1AAD19
}
.funInfo {
  height: 100%;
}
 .pImage{
   height: 35%;
   background:#eee;
   text-align: center;
 }
 .pImage img {
   height: 100%;
 }
 .cellHeight{
		height: 25px;
	}
  .bottombtn {
    height:100px;
    display: flex;
    justify-content: center;
    align-items: center
  }
 .bottombtn span {
   background: #1AAD19;
   padding:8px 150px;
   color: white
 }
  .app-bg >>>img{
        width: 100%;
        height: 100%;
        -webkit-transform: scale(1.03);
        -moz-transform: scale(1.03);
        -ms-transform: scale(1.03);
        -o-transform: scale(1.03);
        transform: scale(1.03);
    }
    textarea {
        padding: 10px;
    }

    .text-length {
        font-size: 14px;
        z-index: 999;
        width: 100%;
        text-align: right;
        margin-bottom: 10px;
        color: #e4e4e4;
    }

    .warning {
        color: #fe9900;
    }

    .add-img {
        width: 100%;

    }

    .add-img p {
        color: #999;
    }

    .mui-content {
        padding-bottom: 60px;
    }

    .mui-content .idea {
        margin-top: 8px;
        background-color: #FFFFFF;
    }

    .good-item {
        text-align: center;
        width: 33%;
        max-width: 100%;
        overflow: hidden;
        padding-right: 10px;
        padding-bottom: 10px;
        float: left;
    }

    .good-item span {
        font-size: 15px;
        height: 30px;
        line-height: 30px;
        border-radius: 50px;
        display: block;
        width: 100%;
        color: #333;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        border: 1px solid #CCCCCC;
    }

    .mui-table {
        padding-top: 10px;
        color: #333;
        padding-left: calc(0.5% + 10px);
    }

    .h-line-behind {
        line-height: 40px;

    }

    .question {
        border: 0;
        margin-bottom: 10px;
    }

    .add {
        display: inline-block;
        position: absolute;
        bottom:3px;
        color:white

    }

    .add-image {
        padding-top: 0px;

        width: 80px;
        top: 20px;
        height: 55px;
        border: 1px dashed white;
        background:rgba(0,0,0,.4)
    }

    .add-image .icon-camera {
        font-size: 24px;
    }

    .good-item .choose {
        color: #fff;
        background-color: #87582E;
        color: #FFF;
        border: 0;
    }

    .mui-btn-block {
        border: 0;
        border-radius: 0;
        background-color: #87582E;
        color: #fff;
        margin-bottom: 0;
        bottom: 0;
    }

    .mui-buttom {
        position: fixed;
        width: 100%;
        bottom: 0;
        z-index: 999;

    }

    /*九宫格*/
    .img-list {
        overflow: hidden;
        margin:0;
        padding:0;
    }

    .img-list > li {
        float: left;
        width: 32%;
        text-align: center;
        position: relative;
    }

    .img-list > li > div {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .img-list > li > div .app-bg {
        width: 100%;
        height: 100%;
    }

    .mui-fullscreen {
        z-index: 9999;
    }

    .del {
        position: absolute;
        width: 18px;
        top: 0;
        right: 0;
        z-index: 999
    }

</style>
