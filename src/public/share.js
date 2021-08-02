const http= new XMLHttpRequest();
var url = "http://192.168.0.128:8092/open/webAppCheck?appId=";// config请求路径
var appIocn = "";// app的图标
var appName="";// app名称
var appId="";// appid
var audioUrl="";
// 设备详情
var deviceInfo={
    isAndroid : false,
    isIOS : false
};
var sk={
    // 校验网页合法性
    config:function (obj) {
        appId=obj.skAppId;
        // if(obj.jsApiList.length>0){
        //     for(var i=0;i<obj.jsApiList.length;i++){
        //         switch (obj.jsApiList[i]){
        //             case "chooseSKPay":
        //
        //                 break;
        //             default:
        //                 break;
        //         }
        //     }
        // }
        url=url+obj.skAppId+"&jsApiList="+obj.jsApiList;
        http.open("get",url);
        http.send();
        http.onreadystatechange=function () {
            if(this.readyState==4 && this.status==200){
                console.log(JSON.parse(http.responseText).data);
                appIocn = JSON.parse(http.responseText).data.appIocn;
                appName = JSON.parse(http.responseText).data.appName;
            }else{
                console.log("调取校验接口失败，请检查参数");
            }
        }
    },
    // 检验当前客户端版本是否支持指定js接口
    checkJsApi:function () {

    },
    // 分享
    ready:function (callback) {
        console.log("appId "+appId+" ,appName "+appName+" ,appIocn "+appIocn);
        setTimeout(function () {
            callback();
        },3000);
    },
    // 分享给朋友
    updateAppMessageShareData:function (obj) {
        console.log("appId "+appId+" ,appName "+appName+" ,appIocn "+appIocn);
        var param={
            appId:appId,
            appSecret:'',
            appName:appName,
            appIcon:"https://file.shikutech.com:8090/avatar/o/4476/10004476.jpg",
            title:obj.title,
            subTitle:obj.desc,
            url:obj.link,
            imageUrl:obj.imgUrl
        }
        var u = navigator.userAgent, app = navigator.appVersion;
        deviceInfo.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
        deviceInfo.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if(deviceInfo.isAndroid){
            // alert(param);
            window.AndroidWebView.updateShareData(JSON.stringify(param));
        }
        if(deviceInfo.isIOS){
            updateShareData(JSON.stringify(param));
            // window.webkit.messageHandlers.updateShareData.postMessage(param);
        }
    },
    // 开始录音
    startSKAudio:function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        deviceInfo.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
        deviceInfo.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        alert(deviceInfo.isIOS);
        if(deviceInfo.isAndroid){
            window.AndroidWebView.startRecord();
        }
        if(deviceInfo.isIOS){
            startRecord();
            window.webkit.messageHandlers.startRecord.postMessage(null);
        }
    },
    // 结束录音
    stopSKAudio:function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        deviceInfo.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
        deviceInfo.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

        if(deviceInfo.isIOS){
            // alert(audioUrl);
            audioUrl=stopRecord();
            // audioUrl = window.webkit.messageHandlers.stopRecord.postMessage(null);
        }

        if(deviceInfo.isAndroid){
            audioUrl= window.AndroidWebView.stopRecord();
        }

        alert(audioUrl);
    },
    // 播放录音
    playSKVoice:function (url) {
        if(url==""||url==null||url==undefined){
            url = audioUrl;
        }

        var u = navigator.userAgent, app = navigator.appVersion;
        deviceInfo.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
        deviceInfo.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if(deviceInfo.isAndroid){
            window.AndroidWebView.playVoice(url);
        }
        if(deviceInfo.isIOS){
            playVoice(url);
            window.webkit.messageHandlers.playVoice.postMessage(url);
        }
    },
    // 暂停播放
    pauseSKVoice:function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        deviceInfo.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
        deviceInfo.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

        if(deviceInfo.isAndroid){
            window.AndroidWebView.pauseVoice();
        }
        if(deviceInfo.isIOS){
            pauseVoice();
            window.webkit.messageHandlers.pauseVoice.postMessage(null);
        }
    },
    // 停止播放
    stopSKVoice:function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        deviceInfo.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
        deviceInfo.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if(deviceInfo.isAndroid){
            window.AndroidWebView.stopVoice();
        }
        if(deviceInfo.isIOS){
            stopVoice();
            window.webkit.messageHandlers.stopVoice.postMessage(null);
        }
    },
    // 播放完成
    playFinish:function () {
        alert("播放完成");
    },
    // 视酷支付App内
    chooseSKPay:function (obj) {
        console.log(obj);
        var param={
            appId:obj.appId,
            prepayId:obj.prepayId,
            sign: obj.sign
        }
        var u = navigator.userAgent, app = navigator.appVersion;
        deviceInfo.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
        deviceInfo.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if(deviceInfo.isAndroid){
            window.AndroidWebView.chooseSKPayInApp(JSON.stringify(param));
        }
        if(deviceInfo.isIOS){
            chooseSKPayInApp(JSON.stringify(param));
            window.webkit.messageHandlers.chooseSKPayInApp.postMessage(JSON.stringify(param));
        }

    },
    chooseSKPayOut:function (obj) {
        var openApp =null;
        // 客户端校验给一个授权回调域名
        if (navigator.userAgent.match(/android/i)) {
            var flag = false;
            openApp = window.open("shikuimapp://www.shikuandroid.pay.com:80/?appId="+obj.appId+"&prepayId="+obj.prepayId+"&sign="+obj.sign);

            var lock=setInterval(function() {
                if(openApp.closed) {
                    clearInterval(lock);
                    flag = true;
                }
            }, 1000);
            window.setTimeout(function () {
                if(!flag){
                    window.location.href = "https://www.pgyer.com/shiku2";// 下载地址
                }

            }, 2000)

        }

        if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
            /*  $('.modal-body').html("数据："+requestData.appId+requestData.callbackUrl);
             $("#errorMsgByTelephone").modal('show');*/

            window.location.href="shikuimapp://www.shikuios.com:80/skPay?appId="+obj.appId+"&prepayId="+obj.prepayId+"&sign="+obj.sign;//ios app协议
            window.setTimeout(function () {
                   window.location.href = "https://itunes.apple.com/cn/app/%E8%A7%86%E9%85%B7%E5%8D%B3%E6%97%B6%E9%80%9A%E8%AE%AF/id1160132242?mt=8";

            }, 2000)
        }
    },
    paySuccess:function (data) {
        alert(data);
    },
    // 分享穿透
    SharePenetration:function (obj) {
        if (navigator.userAgent.match(/android/i)) {
            window.location.href="sk://com.sk.weichat/share?extra_share_content=%7b%22appId%22%3a%22sk1070738a2ba744a3%22%2c%22appSecret%22%3a%22cfde50d37b4c785c20112959c2afce36%22%2c%22appName%22%3a%22SK%e8%b7%91%e8%83%a1%e5%ad%90%22%2c%22appIcon%22%3a%22https%3a%2f%2fwww.sktech.net.cn%2fshare_game%2fimages%2fsk_majiang_logo.png%22%2c%22title%22%3a%22%e8%bd%bb%e6%9d%be%e9%ba%bb%e5%b0%86%e4%b8%80%e8%83%a1%e5%88%b0%e5%ba%95%ef%bc%81hing%e7%bf%bb%e5%85%a8%e5%9c%ba%ef%bc%8c%e8%b7%9f%e6%88%91%e4%b8%80%e8%b5%b7%e6%9d%a5%e7%bb%84%e5%b1%80%e5%90%a7%ef%bc%81%22%2c%22subTitle%22%3a%22%e4%b8%80%e6%ac%be%e9%9d%9e%e5%b8%b8%e7%ae%80%e5%8d%95%e4%b8%8a%e6%89%8b%e7%9a%84%e4%bc%91%e9%97%b2%e5%a8%b1%e4%b9%90%e9%ba%bb%e5%b0%86%e7%b1%bb%e7%9a%84%e6%a3%8b%e7%89%8c%e6%b8%b8%e6%88%8f%ef%bc%8c%e9%ba%bb%e5%b0%86%e6%96%87%e5%8c%96%e5%8f%af%e4%bb%a5%e8%bf%bd%e6%ba%af%e5%88%b0%e5%be%88%e4%b9%85%e4%bb%a5%e5%89%8d%e4%ba%86%2c%e8%80%8c%e4%b8%94%e9%ba%bb%e5%b0%86...%22%2c%22url%22%3a%22skphz%3a%2f%2fshikuCardgame.com%3a80%2f%3froomNo%3dundefined%22%2c%22downloadUrl%22%3a%22https%3a%2f%2fwww.sktech.net.cn%2fmoreGame%2fmoreGame.html%3ftdsourcetag%3ds_pcqq_aiomsg%22%2c%22imageUrl%22%3a%22https%3a%2f%2fwww.sktech.net.cn%2fshare_game%2fimages%2fsk_majiang_logo.png%22%7d";
        }
        if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
            window.location.href="shikuimapp://www.shikuios.com:80/skShare?appId="+appId+"&appName="+appName+"&appIcon="+appIocn+"&title="+obj.title+"&subTitle="+obj.subTitle+"&url="+obj.url+"&downloadUrl="+obj.downloadUrl+"&imageUrl="+obj.imageUrl;
        }
    },
    //一键登陆
    oneLogin:function (obj) {
        if (navigator.userAgent.match(/android/i)) {
            window.location.href="sk://com.sk.weichat/login?extra_login_content=%7bcallbackUrl%3a%22https%3a%2f%2fwww.shiku.co%2fmobileWeb%22%7d";
        }
        if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
            window.location.href="shikuimapp://www.shikuios.com:80/login?extra_login_content=%7bcallbackUrl%3a%22https%3a%2f%2fwww.shiku.co%2fmobileWeb%22%7d";
        }
    },
    // 分享战绩分享房间之前调用
    initGroupHelper:function (obj) {
        alert(obj);
    },
    // 分享房间
    shareRoom:function (obj) {
        var shareRoomurl = "http://192.168.0.128:8092/room/sendMsgByGroupHelper?roomId="
            +obj.roomId+"&userId="+obj.userId+"&title="+obj.title+"&desc="+obj.desc+"&imgUrl="+obj.imgUrl+"&type="+obj.type+"&url="+obj.url;
        http.open("get",shareRoomurl);
        http.send();
        http.onreadystatechange=function () {
            if(this.readyState==4 && this.status==200){
                console.log(JSON.parse(http.responseText).data);

            }else{
                console.log("调取校验接口失败，请检查参数");
            }
        }
    },
    // 分享战绩
    shareRecord:function (obj) {
        var shareRecordurl = "http://192.168.0.128:8092/room/sendMsgByGroupHelper?roomId="
            +obj.roomId+"&userId="+obj.userId+"&title="+obj.title+"&desc="+obj.desc+"&imgUrl="+obj.imgUrl+"&type="+obj.type+"&url="+obj.url;
        http.open("post",shareRecordurl);
        http.send();
        http.onreadystatechange=function () {
            if(this.readyState==4 && this.status==200){
                console.log(JSON.parse(http.responseText).data);

            }else{
                console.log("调取校验接口失败，请检查参数");
            }
        }
    }
}

// function share() {
//
//     var param={
//         appId:'00000',
//         appSecret:'11111',
//         shareType:'9',
//         appName:'测试App',
//         appIcon:'https://file.shikutech.com:8090/avatar/o/4476/10004476.jpg',
//         title:"小敏",
//         subTitle:"真帅",
//         url:"https://www.shiku.co/",
//         imageUrl:"http://47.91.232.3:8089/avatar/o/7050/10017050.jpg"
//     }
//     return JSON.stringify(param);
// }

function updateShareData() {
    
}
// 定义一个ios方法
function stopRecord() {

}
// 定义一个ios方法
function chooseSKPay() {

}