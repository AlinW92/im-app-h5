import Recorder  from "recorder-js"
import video from "video.js"
import apiServer from './apiServer.js'
import WEBIM from "./webim.js"
import msgRequest from "./msgRequest.js"

var audio_context;
export var recorder;

var time=1;
var timer;
export var openUserMedia=false;
 var mediaStreamTrack;
function __log(e, data) {
    console.log( "\n" + e + " " + (data || ''));
  }
function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);
     __log('Media stream created.');

    // Uncomment if you want the audio to feedback directly
    input.connect(audio_context.destination);
    __log('Input connected to audio context destination.');
    
    recorder = new Recorder(input);
     __log('Recorder initialised.');
  }
// function timeOut(){
// 			console.log("计时器")
// 			if(time<=60){
// 				time++;
// 			}
// 		};
export function startRecording() {
	console.log("调用start")
	console.log(recorder)
    recorder.start();
    time=1;
	timer=window.setInterval(function(){
		console.log("计时器")
		if(time<=60){
			time++;
		}
	},1000);
	
    // timer=video.setInterval("timeOut()",1000);
//     $("#voice_img").hide();
//     $("#voice_gif").show();
    // button.disabled = true;
    // button.nextElementSibling.disabled = false;
	console.log(timer)
     __log('Recording...');
  }

  export function stopRecording() {
   
     window.clearInterval(timer);
	 console.log("录音时间time "+time);
//      $("#voice_gif").hide();
//      $("#voice_img").show();
     
    // button.disabled = true;
    // button.previousElementSibling.disabled = false;
    // __log('Stopped recording.');
    mediaStreamTrack && mediaStreamTrack.stop();
    openUserMedia=false;
    // create WAV download link using audio data blob
    // createDownloadLink();
    
   
    var obj=recorder.stop();
	obj.time=time;
	return obj;
	// console.log(obj);
    recorder.clear();
    
    
  }

  export function createDownloadLink() {
    if(apiServer.isNull(recorder))
      return;
	  // console.log(Recorder)
     recorder.exportWAV(function(blob) {
          var data = new FormData();

                data.append("userId",myData.userId);
                data.append('file', blob);
                data=WEBIM.createOpenApiSecret(data);
                // var xhr = new XMLHttpRequest();
                $.ajax({
                    contentType:"multipart/form-data",
                    type:"POST",
                    url:AppConfig.uploadVoiceUrl,//192.168.0.128:8888/upload/UploadServlet" AppConfig.uploadVoiceUrl
                    data:data,
                    dataType:"json",
                    processData:false,
                    contentType:false,
                    success:function(result){
                        var msg=WEBIM.createVoiceMsg(3, result["url"],1,time);
                        UI.sendMsg(msg);
                        $("#voice").modal("hide");
                        // audioData.buffer=[];
                        // audioData.size=0;
                        // context.close();
                    }
                });

     
    });
  }

export function initUserMedia(init) {
  // init  是否 是初始化 加载  false 不是 true 是
    try {
      // webkit shim
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      navigator.getUserMedia = navigator.mediaDevices.getUserMedia||navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;
     window.URL = window.URL || window.webkitURL;
      
      audio_context = new AudioContext();
       __log('Audio context set up.');
      __log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    } catch (e) {
      // __log(e);
      alert('No web audio support in this browser!');
    }
    if(navigator.getUserMedia){
      console.log(navigator.getUserMedia)
		navigator.getUserMedia( 
		            { audio: true }, //只启用音频
                
		            function (stream) {
					    	console.log("asdfadsfsahk")
		              // $("#voice").modal('show');
		             mediaStreamTrack = typeof stream.stop === 'function' ? stream : stream.getTracks()[0];
		              var input = audio_context.createMediaStreamSource(stream);
		                   __log('Media stream created.');
		
		                  // Uncomment if you want the audio to feedback directly
		                  input.connect(audio_context.destination);
		                  __log('Input connected to audio context destination.');
		                  
		                  recorder = new Recorder(audio_context);
						          recorder.init(stream);
		                  openUserMedia=true;
		                   __log('Recorder initialised.');
		            }, 
		            function (error) {
						console.log("超过一款")
		              openUserMedia=false;
		              if(!init)
		                alert('无法打开麦克风。异常信息:' + (error.code || error.name));
		                       
		            }
		)
// 		.then(function(stream){
// 						console.log("进来了")
// 					}).catch(function(error){
// 						console.log(error)
// 						console.log("错误")
// 					});
	}
                
    
  /*  navigator.getUserMedia({audio: true}, function(stream){
       
     });*/
		 
// 		 try {
//       // webkit shim
//       window.AudioContext = window.AudioContext || window.webkitAudioContext;
//       navigator.getUserMedia = navigator.mediaDevices.getUserMedia||navigator.getUserMedia || navigator.webkitGetUserMedia||navigator.mozGetUserMedia;;
//       // window.URL = window.URL || window.webkitURL;
//       
//       audio_context = new AudioContext;
//       __log('Audio context set up.');
//       __log('navigator.getUserMedia ' (navigator.getUserMedia ? 'available.' : 'not present!'));
//     } catch (e) {
//       alert('No web audio support in this browser!');
//     }
//     
//     navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
//       __log('No live audio input: ' +e);
//     });
  };



	

