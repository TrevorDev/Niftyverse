import * as BABYLON from 'babylonjs';

console.log("Niftyverse loaded!")

class Niftyverse {
    constructor(){
        
    }
    async initialize(){
        // Wait for video element
        var videoElement:any = await this.waitForVideoElement();

        // Check if page is supported
        if(window.location.href.indexOf("testRun") == -1){
            throw("Niftyverse not supported on this page")
        }
        console.log("Niftyverse supports this webpage!")
    
        // Get rid of margin
        document.documentElement.style["overflow"]="hidden"
        document.documentElement.style.overflow ="hidden"
        document.documentElement.style.width ="100%"
        document.documentElement.style.height ="100%"
        document.documentElement.style.margin ="0"
        document.documentElement.style.padding ="0"
        document.body.style.overflow ="hidden"
        document.body.style.width ="100%"
        document.body.style.height ="100%"
        document.body.style.margin ="0"
        document.body.style.padding ="0"
        
        // Create canvas
        var canvas = document.createElement('canvas');
        canvas.style.width="100%"
        canvas.style.height="100%"
        canvas.style.touchAction="none"
        canvas.style.position = "absolute"
        canvas.style.zIndex = "2147483647";
        document.body.insertBefore(canvas, document.body.firstChild)
        
        // Initialize babylon
        var engine = new BABYLON.Engine(canvas, true);
        var scene = new BABYLON.Scene(engine);
        engine.runRenderLoop(()=>{
            scene.render();
        });
        window.addEventListener("resize", ()=>{
            engine.resize();
        });
    
        // Setup scene objects
        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, 0), scene);
        camera.attachControl(canvas,true)
        var light = new BABYLON.PointLight("", new BABYLON.Vector3(10,10,0), scene)

        // Create videoscreen
        var videoScreen = BABYLON.Mesh.CreateGround("",3,3,4,scene)
        videoScreen.scaling.z = 1080*0.001
        videoScreen.scaling.x = 1920*0.001
        videoScreen.position.z = 10
        videoScreen.position.y=-1
        videoScreen.rotation.x = -Math.PI/4
    
        // Display video when video loaded
        var videoTexture = new BABYLON.VideoTexture("video", videoElement, scene, false, false, 2);
        videoTexture.video.pause();
        videoTexture.video.play();
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseTexture = videoTexture;
        videoScreen.material = mat;
        document.onkeydown = ()=>{
            console.log("key")
            videoTexture.video.pause();
            //videoTexture.video.play();
        }
        // console.log("texture added")
        // // Get audio from video
        // var audioContext = new AudioContext();
        // var audioQuirk = false;
        // if(!videoElement.captureStream){
        //     audioQuirk = true
        //     videoElement.captureStream = videoElement.mozCaptureStream
        // }

        // var stream:MediaStream = videoElement.captureStream();
        // // var stream = await this.getAudioStreamFromSpeaker()
        // // audioQuirk = false

        // await this.waitForAudioStream(stream)

        // // Setup FFT for audio visualization
        // var inputNode = audioContext.createMediaStreamSource(stream);
        // var analyserNode = audioContext.createAnalyser();
        // analyserNode.fftSize = Math.pow(2, 13)
        // inputNode.connect(analyserNode)
        // if(audioQuirk){
        //     analyserNode.connect(audioContext.destination)
        // }
        // console.log(analyserNode.frequencyBinCount)

        // // Create cubes to visualize each bin of the FFT output
        // var binCount = 100;
        // var musicLevels:Array<BABYLON.Mesh> = []
        // for(var i = 0;i<binCount;i++){
        //     var box = BABYLON.Mesh.CreateBox("", 1, scene);
        //     box.position.x += (i-binCount/2)*1.5
        //     box.position.z = 500;
        //     musicLevels.push(box)
        // }
        // var avgBox = BABYLON.Mesh.CreateBox("", 1, scene);
        // avgBox.scaling.x = 200;
        // avgBox.scaling.y = 0.3;
        // avgBox.position.z = 510;

        // // Display FFT data on every renderframe
        // scene.onBeforeRenderObservable.add(()=>{
        //     var startHeight = 30;
        //     var noiseFloor = 0;
        //     var freqByteData = new Uint8Array(binCount)
        //     analyserNode.getByteFrequencyData(freqByteData); // This throws away extra values if smaller array passed in than analyserNode.frequencyBinCount
        //     var total = 0;
        //     var max = 0
        //     var maxIndex = 0;
        //     freqByteData.forEach((val, i)=>{
        //         total+=val;
        //         if(val>max){
        //             max = val;
        //             maxIndex = i;
        //         }
        //         if(val >noiseFloor){
        //             musicLevels[i].position.y = startHeight+val/10
        //         }else{
        //             musicLevels[i].position.y = startHeight
        //         }
        //     })
        //     if(max >noiseFloor){
        //         musicLevels[maxIndex].position.y = startHeight+30
        //     }
        //     var avg = total/binCount;
        //     avgBox.position.y =startHeight+avg/10
        // })
            
        
    }
    private waitForVideoElement(timeout = 100){
        return new Promise((res, rej)=>{
            var checkForVid = ()=>{
                console.log("vidCheck")
                var vid:HTMLVideoElement = document.getElementsByTagName("video")[0]
                if(vid){
                    res(vid)
                }else{
                    setTimeout(checkForVid, timeout);
                }
            }
            checkForVid();
        })
    }
    private waitForAudioStream(stream:MediaStream){
        return new Promise((res, rej)=>{
            console.log(stream.getAudioTracks())
            setTimeout(() => {
                console.log(stream.getAudioTracks()) // There seems to be a bug such that onaddtrack is not called unless this is called after track is added
            }, 5000);
            if(stream.getAudioTracks().length > 0){
                res()
            }else{
                stream.onaddtrack = (event)=>{
                    console.log(event)
                    if(event.track.kind == "audio"){
                        res()
                    }
                }
            }
        })
    }
    private getAudioStreamFromSpeaker(){
        return new Promise<MediaStream>((res,rej)=>{
            if (!navigator.getUserMedia){
                navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            }
            navigator.getUserMedia(
                {
                    "audio": {
                        "mandatory": {
                            "googEchoCancellation": "false",
                            "googAutoGainControl": "false",
                            "googNoiseSuppression": "false",
                            "googHighpassFilter": "false"
                        },
                        "optional": []
                    },
                }, function(stream) {
                    res(stream)
                }, function(e) {
                    alert('Error getting audio');
                    console.log(e);
                    rej(e)
                });
        });
    }
}

var main = async ()=>{
    var nv = new Niftyverse()
    await nv.initialize()
}
setTimeout(() => {
    main();
}, 4000);

