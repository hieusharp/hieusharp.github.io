"use strict";

import * as THREE from './js/three.module.js';

import Stats from './js/stats.module.js';


import { GUI } from './js/dat.gui.module.js';
import { OrbitControls } from './js/OrbitControls.js';
import { Water } from './js/Water.js';
import { Sky } from './js/SkyNight.js';
import { GLTFLoader } from './js/GLTFLoader.js';
import { TWEEN } from './js/tween.module.min.js';
import { CSS2DRenderer, CSS2DObject } from './js/CSS2DRenderer.js';
import { Lensflare, LensflareElement } from './js/Lensflare.js';

var myChart
let isOnDiv = false;
let container, stats, circle
let camera, scene, renderer, labelRenderer;
let controls, water, sun, mesh, sky,stat1, stat2, stat3
var time
var mixers = []
var clock = new THREE.Clock();
var mixer;
var clip1
var texts = []
var coinData = []
var coinMeshes = []
var auraMeshes = []
var auraOnMeshes = []
var auraSelectedMesh = null
var auraSelectedMeshOld = null
var camTarget = new THREE.Vector3()
var sliderValue =1440
var sliderValueMax = 1440
var selectedMesh = new THREE.Mesh()
var deviceType 
var textureLoader = new THREE.TextureLoader()
// var imgLoader = new THREE.ImageLoader();
var glTFloader  = new GLTFLoader();
const raycaster = new THREE.Raycaster();
const raycaster2 = new THREE.Raycaster();
const pointer = new THREE.Vector2()
var labelObj
const model = 'model/coin103.glb'
const img = 'model/sample.jpg'
let INTERSECTED;
var fromLookAt = new THREE.Vector3(0,0,0)
var baseSize = 6
// var coinGeo = new THREE.CylinderGeometry( baseSize*6, baseSize*6, 1, 64 );;
var coinAuraGeo = new THREE.CylinderBufferGeometry( 18, 18, 3, 32 );;
var coinSphere = new THREE.SphereBufferGeometry( baseSize*1.8, 32, 32 )


//sky
const skyScalar = 15000
//indicators
var isClickable = true

//position rescale
var posRescaled = 5

//slot
var filledSlots = []
//label
const labelDiv = document.createElement( 'div' );
labelDiv.className = 'label';
// labelDiv.textContent = 'Earth';
labelDiv.style.marginTop = '-1em';
const fluc = {
range: 5,
speed: 2
};

const pointLight = new THREE.PointLight(0xF3C887, 40.2, 12000);
// pointLight.color.setHSL(.995, .5, .9);
// pointLight.position.set(0, 45, -5000);





//end slider
const camParams = {
posX: 40,
posY: 80,
posZ:250,
lookAtX:0,
lookAtY:0,
lookAtZ:0,
};
//



function createGeo(multiplier){

	return new THREE.CylinderBufferGeometry( baseSize*multiplier, baseSize*multiplier, multiplier, 64 )
}

var coinGeo1 = createGeo(1)
var coinGeo2 = createGeo(2)
var coinGeo3 = createGeo(3)
var coinGeo4 = createGeo(4)
var coinGeo5 = createGeo(5)
var coinGeo6 = createGeo(6)
const parameters = {
	elevation: 3.425,
	turbidity: 0.1,
	rayleigh: 1.55,
	mieCoefficient: 0.005,
	mieDirectionalG: 0.7,
	azimuth: -160.25,	
	exposure: 1
};


init();
animate();


// var coinGeo6 = createGeo(6)

// var coinGeo = coinGeo1

 var globalGlowMat =        new THREE.ShaderMaterial({
            uniforms: 
            { 
              "s":   { type: "f", value: 1},

              "b":   { type: "f", value: 0.3}, //outer border
              "p":   { type: "f", value: 6.5 },
              glowColor: { type: "c", value: new THREE.Color("gold") }
            },
            vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
            fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            transparent: true
            });


function createGlowMat(color,s,b,p){

	 let glowMat =        new THREE.ShaderMaterial({
	            uniforms: 
	            { 
	              "s":   { type: "f", value: s},

	              "b":   { type: "f", value: b}, //outer border
	              "p":   { type: "f", value: p },
	              glowColor: { type: "c", value: new THREE.Color(color) }
	            },
	            vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
	            fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
	            side: THREE.FrontSide,
	            blending: THREE.AdditiveBlending,
	            transparent: true
	            });
	 return glowMat
}




var glowRedMat = createGlowMat("red",1,0,6.5)
var glowGoldMat = createGlowMat("rgb(255,0,0)",1,0,6.5) //gold
var glowCoinMat = createGlowMat("gold",1,0.3,6.5)

var auraGoldMat = createGlowMat("gold",0.85,0,6.5) //gold

var glowMysticMat = createGlowMat("blue",0.5,0.5,6.5)  //here

var blueMat = new THREE.MeshStandardMaterial({color: 0x1A1444, emissive: 0x1A1444,emissiveIntensity: 0.1, roughness:0.5})
// var goldMat = new THREE.MeshStandardMaterial({color: "gold", emissive: "gold",emissiveIntensity: 0.1, roughness:0.5})

const dataURI = `data:image/webp;base64,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` 


function getGeo(radius){
	let coinGeo
	switch(radius) {
		case 1:  
			coinGeo = coinGeo1;
			break;
		case 2:  
			coinGeo = coinGeo2;
			break;
		case 3:  
			coinGeo = coinGeo3;
			break;
		case 4:  
			coinGeo = coinGeo4;
			break;
		case 5:  
			coinGeo = coinGeo5;
			break;
		case 6:  
			coinGeo = coinGeo6;
			break;
		default: 
			coinGeo = coinGeo3;
		}
		return coinGeo
}


// function getMat(symbol){

  
function imageExists(image_url){

    var http = new XMLHttpRequest();

    http.open('HEAD', image_url, false);
    http.send();

    return http.status != 404;

}

function getMat(symbol){
	let image_url = "webps/"+symbol.toUpperCase()+".webp"
	if(imageExists(image_url)){
			// let texture = textureLoader.load(image_url)
			let texture = textureLoader.load(image_url)
			let coinMat = new THREE.MeshBasicMaterial( { side:THREE.FrontSide, map:texture,transparent: true} )
			texture.center= new THREE.Vector2(0.5,0.5)
			return coinMat
	}

	else{
		let texture = textureLoader.load("webps/"+"QHLOGO"+".webp")
		let coinMat = new THREE.MeshBasicMaterial( { side:THREE.FrontSide, map:texture,transparent: true} )
		// texture.magFilter = THREE.NearestFilter;

		// texture.repeat.set(1.2, 0.9)
		// texture.repeat = THREE.RepeatWrapping
		texture.center= new THREE.Vector2(0.5,0.5)
		return coinMat
	}
}
const globalTexture = textureLoader.load("webps/"+"QHLOGO"+".webp")
globalTexture.center= new THREE.Vector2(0.5,0.5)
const globalMat = new THREE.MeshBasicMaterial( { side:THREE.FrontSide,transparent: true} )

async function loadImages() {
	return await image_data
}

// function getMat(symbol){
// 	// let texture = textureLoader.load("webps/"+symbol.toUpperCase()+".webp")

// 		let text = "URI_"+symbol.toUpperCase()
// 		// let text = "URI_KIN"
// 		let texture = textureLoader.load(image_data[text], undefined,undefined, function(err){
// 			// console.log(err)
// 		})
// 		let coinMat = new THREE.MeshBasicMaterial( { side:THREE.FrontSide, map:texture,transparent: true} )
// 		// texture.magFilter = THREE.NearestFilter;

// 		// texture.repeat.set(1.2, 0.9)
// 		// texture.repeat = THREE.RepeatWrapping
// 		texture.center= new THREE.Vector2(0.5,0.5)
// 		// console.log(text)
// 		return coinMat


// }

// function updateGlobalMat(symbol){

// 	let text = "URI_"+symbol.toUpperCase()
// 	let texture = textureLoader.load(image_data["URI_BTC"])
// 	// texture.needsUpdate = true
// 	globalMat.map = texture
// 	// texture.magFilter = THREE.NearestFilter;

// 	// texture.repeat.set(1.2, 0.9)
// 	// texture.repeat = THREE.RepeatWrapping
// 	texture.center= new THREE.Vector2(0.5,0.5)
// 	// return coinMat	
// }

function setupTween (position, toPos, duration, vec)
{
    controls.enabled = false    
    TWEEN.removeAll();    // remove previous tweens if needed

	var startRotation = camera.quaternion.clone();
	camera.lookAt( vec );
	var endRotation = camera.quaternion.clone();
	camera.quaternion.copy( startRotation );
	new TWEEN.Tween( camera.quaternion ).to( endRotation, duration/2 ).easing(TWEEN.Easing.Quadratic.InOut)
	.onComplete(function(){
		    new TWEEN.Tween (position)
        .to (toPos, duration)
        .easing (TWEEN.Easing.Circular.InOut)
        .onStart( function(){
        			// pointLight.position.set(vec.x,vec.y,vec.z)
            	let coinVec = new THREE.Vector3()
          		for (let coinDatum of coinData){
          			coinDatum.coinMesh.getWorldPosition(coinVec)
								if (Math.abs(toPos.x -coinDatum.coinMesh.position.x ) <   1500 && Math.abs(toPos.z -coinVec.z ) < 1500 ){
											if(coinDatum.textureFilled == false){
												coinDatum.reservedMat.map = textureLoader.load(`webps/${coinDatum.symbol.toUpperCase()}.webp`)
												coinDatum.coinMesh.material = coinDatum.reservedMat
												coinDatum.textureFilled = true												
											} else {
												coinDatum.coinMesh.material = coinDatum.reservedMat
											}

								}
								// else {
								// 	if (coinDatum.coinMesh.material != glowCoinMat){
								// 		coinDatum.coinMesh.material = glowCoinMat
								// 		// coinDatum.coinMesh.material.needsUpdate = true
								// 	}
								// }
							}
        })
        .onUpdate (
            function() {
                camera.position.copy(position);
                camera.lookAt(vec)
            })
        .onComplete (
            function() {
            	controls.target.set(vec.x,vec.y,vec.z)
            	controls.enabled = true
	            controls.autoRotate = true;
							controls.autoRotateSpeed = 0.5

            	controls.update()

            })
        .start();
	})
	.start()


}




function init() {

	// detect device

var deviceOrientation
if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  deviceType = "mobile"
}
else {deviceType = "PC"}

if(window.innerHeight > window.innerWidth){
    deviceOrientation = "portrait"
   
} else {
    deviceOrientation = "landscape"
}
	//Countdown
	container = document.getElementById( 'container' );
	stat1 = document.getElementById( 'stat1' );
	stat2 = document.getElementById( 'stat2' );
	stat3 = document.getElementById( 'stat3' );


	renderer = new THREE.WebGLRenderer({
	    antialias: true,
			alpha: true,
			powerPreference: "high-performance"	
	});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( container.clientWidth, container.clientHeight );

	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = parameters.exposure

	renderer.physicallyCorrectLights = true;
	// renderer.gammaFactor = 2.2;  //removed in r142
	// renderer.outputEncoding = THREE.sRGBEncoding; //fps costly


	// labelRenderer

	labelRenderer = new CSS2DRenderer();
	labelRenderer.setSize( container.clientWidth, container.clientHeight );
	labelRenderer.domElement.style.position = 'absolute';
	labelRenderer.domElement.style.top = '0px';
	document.body.appendChild( labelRenderer.domElement );


	container.appendChild( renderer.domElement );



	//

	scene = new THREE.Scene()
	camera = new THREE.PerspectiveCamera( 55, container.clientWidth / container.clientHeight, 1, 5000 );
	// camera.position.set(camParams.posX,camParams.posY,camParams.posZ)
	sun = new THREE.Vector3();


	// // Create light
	scene.add(pointLight)

	const textureFlare0 = textureLoader.load( './scripts/lensflare0.png' );
	const textureFlare3 = textureLoader.load( './scripts/lensflare3.png' );
	const lensflare = new Lensflare();
	lensflare.addElement( new LensflareElement( textureFlare0, 700, 0, pointLight.color ) );
	lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.6 ) );
	lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.7 ) );
	lensflare.addElement( new LensflareElement( textureFlare3, 120, 0.9 ) );
	lensflare.addElement( new LensflareElement( textureFlare3, 70, 1 ) );
	pointLight.add( lensflare );
	// scene.add(pointLight);


	// Water
	const waterGeometry = new THREE.PlaneGeometry( 50000, 50000 );
	water = new Water(
		waterGeometry,
		{
			textureWidth: 512,
			textureHeight: 512,
			waterNormals: new THREE.TextureLoader().load( './waternormals.jpg', function ( texture ) {
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			} ),
			sunDirection: new THREE.Vector3(),
			sunPosition: new THREE.Vector3(0,0,-10000),
			sunColor: 0xFCE570,
			waterColor: chroma.mix("001e0f","002B4D").hex(),//0x001e0f,
			distortionScale: 3.7,
			fog: scene.fog !== undefined,
			side: THREE.DoubleSide,
			size:0.3
		}
	);

	water.rotation.x = - Math.PI / 2;
	water.position.y = 0

	scene.add( water );

	// Skybox

	sky = new Sky();
	sky.scale.setScalar( skyScalar );
	scene.add( sky );




	const skyUniforms = sky.material.uniforms;

	const pmremGenerator = new THREE.PMREMGenerator( renderer );

	// sun and camera
		function getSunPos(){
		
		let sunPos = new THREE.Vector3(
			sky.material.uniforms.sunPosition.value.x * skyScalar,
			sky.material.uniforms.sunPosition.value.y * skyScalar,
			sky.material.uniforms.sunPosition.value.z * skyScalar,
			)
		console.log(sunPos)
		return sunPos
	}

	function getCamPos(vec){ //make sure cam and vec align to btc or sun randomly. vec is the targeted lookAt
		let camPos = new THREE.Vector3()
		let sunPos = getSunPos()
		if(vec.x === 0 && vec.z === 0){
			
			camPos.y = 80
			camPos.z = 150
			camPos.x = - camPos.z* sunPos.x / sunPos.z
			// console.log(camPos)
		}
		else{
			let randomAlign = [sky.material.uniforms.sunPosition.value, new THREE.Vector3(0,0,0) ][Math.floor(Math.random()*2)];
			camPos.x = vec.x + Math.sign(vec.x - randomAlign.x * skyScalar)*40
			camPos.z = vec.z + Math.sign(vec.z - randomAlign.z * skyScalar)*150
			camPos.y = vec.y+80
		}

		return camPos
	}
	

	function updateSun() {
		const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
		const theta = THREE.MathUtils.degToRad( parameters.azimuth );
		sun.setFromSphericalCoords( 1, phi, theta );

		sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
		water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();


		skyUniforms[ 'turbidity' ].value = parameters.turbidity;
		skyUniforms[ 'rayleigh' ].value = parameters.rayleigh;
		skyUniforms[ 'mieCoefficient' ].value = parameters.mieCoefficient;
		skyUniforms[ 'mieDirectionalG' ].value = parameters.mieDirectionalG;

		renderer.toneMappingExposure = parameters.exposure

		scene.environment = pmremGenerator.fromScene( sky ).texture;


	}

	updateSun();

// const axesHelper = new THREE.AxesHelper( 100 );
// scene.add( axesHelper );

let goldMat = new THREE.MeshBasicMaterial({color:"gold"})
let dummyMat = new THREE.MeshBasicMaterial()

let testM = new THREE.Mesh(new THREE.SphereBufferGeometry(200),goldMat)



function createCoins(fr,to){

	 glTFloader.load(model, function(gltfModel) {
	 	

		// let ringMesh = gltfModel.scene
		// let ringGeo = ringMesh.children[0].geometry
		let dummyMesh = new THREE.Mesh(coinGeo3,glowCoinMat)
		

		var dataX = fetchedCoinData.slice(fr,to)
		console.log(fetchedCoinData.length)
		
		for (let datum of dataX){

				
				try{
					var dominantColor = colors["img_"+ (datum["symbol"].toUpperCase())]
					var colorStr = "rgb("+dominantColor[0] + ","+dominantColor[1]+ ","+dominantColor[2]+")"					
				}
				catch{
					var colorStr = "rgb(212,175,55)"
				}
				let color = new THREE.Color(colorStr)
				let r2Mat = globalGlowMat.clone()
				r2Mat.uniforms = 
									{ 
						              "s":   { type: "f", value: 1},
						              "b":   { type: "f", value: 0.3}, //outer border
						              "p":   { type: "f", value: 6.5 },
						              glowColor: { type: "c", value: color }
						            }
				let r2Mesh = gltfModel.scene.children[0].clone()
				let scaleX = datum.radius
				r2Mesh.scale.set(scaleX/2.4,scaleX/2.4,scaleX) 
				r2Mesh.material = r2Mat


				let coinGeo = getGeo(scaleX)
				let reservedMat = globalMat.clone()
				let coinMesh		
				if (datum.rank <=180){
						coinMesh = new THREE.Mesh( coinGeo, reservedMat )
						// reservedMat.map = textureLoader.load(`webps/${datum.symbol.toUpperCase()}.webp`)
						reservedMat.map = textureLoader.load(image_data[`URI_${datum.symbol.toUpperCase()}`])
						coinData.push({
								coinMesh:coinMesh,
								fluctRange: datum.fluct_range, 
								posY: datum.posY,
								rotationX:datum.market_cap_change_percentage_24h,
								name:datum.name,
								dominantColor: colorStr,
								symbol: datum.symbol,
								reservedMat: reservedMat,
								textureFilled: true,
						})
				} else {
						coinMesh = new THREE.Mesh( coinGeo, glowCoinMat )
						coinData.push({
								coinMesh:coinMesh,
								fluctRange: datum.fluct_range, 
								posY: datum.posY,
								rotationX:datum.market_cap_change_percentage_24h,
								name:datum.name,
								dominantColor: colorStr,
								symbol: datum.symbol,
								reservedMat: reservedMat,
								textureFilled: false,
						})				
				}

				coinMesh.name = datum.symbol
				coinMesh.add(r2Mesh)
				coinMesh.position.set(datum.posX*posRescaled, datum.posY,datum.posZ*posRescaled) 

				


				scene.add(coinMesh)
				// //AURA 

				let auraMat = globalGlowMat.clone()
				auraMat.uniforms = 
									{ 
						              "s":   { type: "f", value: 0.85},
						              "b":   { type: "f", value: 0.1}, //outer border
						              "p":   { type: "f", value: 6.5 },
						              glowColor: { type: "c", value: color }
						            }

				let auraMesh = new THREE.Mesh(coinSphere,  auraMat) //createGlowMat(colorStr ,0.85,0,6.5)
				auraMesh.scale.set(scaleX,scaleX,scaleX)
				auraMesh.visible = false
				auraMesh.name = datum.id
				auraMesh.userData = {
					id:datum.id,
					name:datum.name,
					symbol:datum.symbol,
					// slot:datum.slot,
					dominantColor: colorStr
				}
				// coinMeshNear.add(auraMesh)
				coinMesh.add(auraMesh)
				 if (datum.inUATU === true){auraMesh.visible = true}
				 auraMeshes.push(auraMesh)

			// console.log(lod)

		}
	 	
	 })
}
createCoins(0,2500)





//TIME SLIDER
var rangeStops = [["25%","75%"],["21%","71%"],["17%","67%"],["13%","63%"],["8%","58%"],["4%","54%"],["50%","100%"],["46%","96%"],["42%","92%"],["38%","88%"],["33%","83%"],["29%","79%"],["25%","75%"],["21%","71%"],["17%","67%"],["13%","63%"],["8%","58%"],["4%","54%"],["50%","100%"],["46%","96%"],["42%","92%"],["38%","88%"],["33%","83%"],["29%","79%"],]

// let sunHTML = '<div class="sunholder" id = "sunholder"> <div class="sun" id = "suncore"></div> <div class="raybase ray1"><div class="ray"></div></div> <div class="raybase ray2"><div class="ray"></div></div> <div class="raybase ray3"><div class="ray"></div></div> <div class="raybase ray4"><div class="ray"></div></div> <div class="raybase ray5"><div class="ray"></div></div> <div class="raybase ray6"><div class="ray"></div></div> <div class="raybase ray7"><div class="ray"></div></div> <div class="raybase ray8"><div class="ray"></div></div> </div>'
// let sunHTML = '<div class="sunholder" id = "sunholder"></div>'
let moonHTML = '<div class="planet" id="planet"> </div>'
let dayColor = "#00ccee"//"#82CAFF"
let nightColor = "#0c1445"

function timeTravel(toMinute){
	let now = new Date()
	let nowVal = now.getHours()*60 + now.getMinutes()
	if(toMinute >= 0 && toMinute <300){
		parameters.elevation = -2 + (-0.5+2)/(300-0)*toMinute
		parameters.azimuth = (360/sliderValueMax)*(toMinute+800-nowVal)  //+800 to make sure the sun is at the middle of the screen on first load
		parameters.turbidity = 0
		parameters.rayleigh = 1.55 + (0.1-1.55)/(300-0)*toMinute
	}
	else if (toMinute >= 300 && toMinute < 720 ){
		parameters.elevation = -0.5 + (28+0.5)/(720-300)*(toMinute-300)
		parameters.azimuth = (360/sliderValueMax)*(toMinute+800-nowVal)
		parameters.turbidity = 0 + (0.4-0)/(720-300)*(toMinute-300)
		parameters.rayleigh = 0.1
	}
	else if (toMinute >= 720 && toMinute < 1020 ){		
		parameters.elevation = 28 + (-0.5-28)/(1020-720)*(toMinute - 720)
		parameters.azimuth = (360/1020)*(toMinute+800-nowVal)
		parameters.turbidity = 0 + (0-0.4)/(1020-720)*(toMinute-720)
		parameters.rayleigh = 0.1+(10-0.1)/(1020-720)*(toMinute-720)
	}
	else{
		parameters.elevation = -0.5 + (-2-0.5)/(1380-1020)*(toMinute - 1020)
		parameters.azimuth = (360/1020)*(toMinute+800-nowVal)
		parameters.turbidity = 0
		parameters.rayleigh = 10 + (0.1-10)/(1380-1020)*(toMinute - 1020)
	}
	updateSun()
}
function stopSliderAmination(){
	if(document.querySelector('div.sunholder')){
		document.querySelector('div.sunholder').style.animation = ''
	}
	if(document.querySelector('.planet')){
		document.querySelector('.planet').style.animation = ''
	}
}

function restoreSliderAnimation() {
	if(document.querySelector('div.sunholder')){
		document.querySelector('div.sunholder').style.animation = 'spin 8s linear 0s infinite'
	}
	if(document.querySelector('.planet')){
		document.querySelector('.planet').style.animation ='spin 8s linear 0s infinite'
	}
}

const rangeSliderElement = rangeSlider(document.querySelector('#range-slider'), {
    /* Set lower value to 0 */
    min:1,
    max:sliderValueMax,

    value: [0, sliderValueMax],
    thumbsDisabled: [true, false],
    rangeSlideDisabled: true,
    onThumbDragStart: stopSliderAmination,
    onThumbDragEnd: restoreSliderAnimation,
    onInput: function(){
    	let now = new Date();
    	let nowHour =now.getHours()
    	let nowVal = nowHour*60+ now.getMinutes()
    	let value = rangeSliderElement.value()[1]
    	sliderValue = value
		let thenDate = new Date(now.getTime() - (sliderValueMax-value)*60000);
		document.querySelector('#time').textContent = thenDate.toLocaleString()
		let thenHour = thenDate.getHours()
		if( thenHour >= 6 && thenHour < 18){
			
			document.querySelector('#time').innerHTML = '<i class="fa-regular fa-sun-haze"></i>' +" "+thenDate.toLocaleString()
		}
		else{
			document.querySelector('#time').innerHTML = '<i class="fa-regular fa-moon"></i>'  +" "+thenDate.toLocaleString()
		}
		if (nowVal - sliderValueMax + value >=0){
			timeTravel(nowVal -(sliderValueMax-value))
		}
		else{
			timeTravel(nowVal + value)
		}
		// updateSun()

		let firstStop = parseFloat(rangeStops[nowHour][0])
		let secondStop = parseFloat(rangeStops[nowHour][1])

    	let new1Stop = Math.round(firstStop*sliderValueMax* 100/value ) / 100

    	let new2Stop =  Math.round(secondStop*sliderValueMax* 100/value ) / 100

		
		if(nowHour>=6 && nowHour <18){
			let cssStr = "linear-gradient(to right, "+ dayColor +" "+ new1Stop+"%, " + nightColor +" "+ new2Stop+"%, " +dayColor + " 100%)"	
			document.querySelector('#range-slider .range-slider__range').style.background = cssStr
			
		} else{
			let cssStr = "linear-gradient(to right, "+ nightColor +" "+ new1Stop+"%, " + dayColor +" "+ new2Stop+"%, " +nightColor + " 100%)"	
			document.querySelector('#range-slider .range-slider__range').style.background = cssStr	
			
		}
		

    }
})
////// INITIAL SET UP
document.querySelector('#time').textContent = new Date().toLocaleString()
let now = new Date()
let nowHour = new Date().getHours()
// console.log(parameters.azimuth)
document.querySelector('#range-slider .range-slider__thumb[data-upper]').innerHTML = moonHTML



// document.querySelector('#range-slider .range-slider__range').style.background = "linear-gradient(to right, #0073e6, #ee2c2c)"
if(nowHour>=6 && nowHour <18){

	let cssStr = "linear-gradient(to right, "+ dayColor +" "+ rangeStops[nowHour][0]+", " + nightColor +" "+  rangeStops[nowHour][1]+", " +dayColor + " 100%)"
	document.querySelector('#time').innerHTML = '<i class="fa-regular fa-sun"></i>' +" "+now.toLocaleString()
	document.querySelector('#range-slider .range-slider__range').style.background = cssStr


} else{
	let firstColor = "#0b1026"
	let secondColor = "#82CAFF" 
	let cssStr = "linear-gradient(to right, "+ nightColor +" "+ rangeStops[nowHour][0]+", " + dayColor +" "+ rangeStops[nowHour][1]+", " +nightColor +" "+ " 100%)"
	document.querySelector('#time').innerHTML = '<i class="fa-regular fa-moon"></i>' +now.toLocaleString()
	document.querySelector('#range-slider .range-slider__range').style.background = cssStr
}
restoreSliderAnimation()
timeTravel(nowHour*60 + now.getMinutes())


	//SLider
	var Drawer = function(containerSelector){
  //constructor
  this.container = (containerSelector) ? $(containerSelector) : $('body');
  
  this.init();
}

//methods
Drawer.prototype = {
  init: function(){
  	//fetch template (not need if using requirejs...)
    var templateHTML = $('#detailDiv').html();

  //
    
    this.container.append(templateHTML);
    this.cacheReferences();

    let div = document.getElementById('detail_div')
		div.onmouseover = () => {
		  isOnDiv = true
		}
		div.onmouseout = () => {
		  isOnDiv = false
		}
  },
  open: function(){
    this.drawer.removeClass('close').addClass('open');
		// container.style.width = '60%'
		// labelRenderer.domElement.style.width = '60%'

	jQuery("#range-slider").fadeOut("slow")
       new TWEEN.Tween(labelRenderer.domElement.style)
            .to({width:"60%"}
            , 500)
            //.delay (1000)
            .easing(TWEEN.Easing.Cubic.Out)
            .onComplete( function(){
            	container.style.width = '60%'
            	onWindowResize()
	        }
        	)
            .start()
		


  },
  close: function(){
    this.drawer.removeClass('open').addClass('close');
    controls.autoRotate = false
		// container.style.width = '100%'
		// labelRenderer.domElement.style.width = '100%'
	jQuery("#range-slider").fadeIn("slow")
       new TWEEN.Tween(labelRenderer.domElement.style)
            .to({width:"100%"}
            , 500)
            //.delay (1000)
            .easing(TWEEN.Easing.Cubic.Out)
            .onStart( function(){
            	container.style.width = '100%'
            	onWindowResize()
	        }
        	)
            .start()


		
  },
  cacheReferences: function(){
    this.drawer = this.container.find('.container-drawer');
    this.header = this.drawer.find('.drawer-header');
    this.footer = this.drawer.find('.drawer-footer');
    this.content = this.drawer.find('.drawer-content');
  }
};

var rightDrawer = new Drawer('.justAContainer');

$('.open').on('click', function(){
  rightDrawer.open();
});
$('.toClose').on('click', function(){
  rightDrawer.close();
});



//END SLIDER

	labelObj = new CSS2DObject( labelDiv );
	// labelObj.position.set( 0, EARTH_RADIUS, 0 );
	scene.add( labelObj );
	labelObj.layers.set( 0 );



	controls = new OrbitControls( camera, labelRenderer.domElement );
	controls.maxPolarAngle = Math.PI * 0.495;
	controls.target.set( 0, 10, 0 );
	controls.minDistance = 40.0;
	controls.maxDistance = 400.0;
	// controls.enabled = false

	controls.autoRotate = true;
	controls.autoRotateSpeed = 0.0

	controls.addEventListener("start",unClickable)
	controls.addEventListener("end",reClickable)

	
	function unClickable() {
	  setTimeout(disableClick, 500);
  		function disableClick() {
	  		isClickable = false;
		}
	}

	function reClickable() {
	  setTimeout(reactivateClick, 500);
  		function reactivateClick() {
	  		isClickable = true;
		}
	}


	document.addEventListener( 'mousemove', onPointerMove );

	function onPointerMove( event ) {

		pointer.x = ( event.clientX / container.clientWidth ) * 2 - 1;
		pointer.y = - ( event.clientY / container.clientHeight ) * 2 + 1;
		// console.log(isOnDiv)

	}

	// container.addEventListener( 'click', onPointerDown,false);
	labelRenderer.domElement.addEventListener( 'click', onPointerDown,false)



	
//Show data
var baseUrl = 'https://api.coingecko.com/api/v3/coins/'
async function getData(url) {
    
    // Storing response
    const response = await fetch(url);
    
    // Storing data in form of JSON
    var result = await response.json();
    // console.log(result);
    // if (response) {
    //     hideloader();
    // }
    // show(result);

    return result
}

async function getHistory(url) {
    
    // Storing response
    const response = await fetch(url);
    
    // Storing data in form of JSON
    var result = await response.json();
    // console.log(result);
    // if (response) {
    //     hideloader();
    // }
    // show(result);

    return result
}

var chartDuration = 3
var viewDuration = function(){
	let result
	if (chartDuration === "max"){
			 result = "for its life time"
	} else {
		 result = "over last "+ chartDuration+ " days"
	}
	return result
}
var chartParams = "/market_chart?vs_currency=usd&days="+chartDuration+"&interval=hourly"
var userData
function drawChart(userData,targetHistoryUrl){
			var xValues = [];
			var yTargetValues = [];	

			getHistory(targetHistoryUrl).then(function(result){

				for (let price of result.prices){
					
					xValues.push(new Date(price[0]))
					yTargetValues.push(price[1])
					
				}

				const ctx = document.getElementById('myChart').getContext('2d');
				try {myChart.destroy()}
				catch {console.log("First Draw")}
				 let config = {
						  type: "line",
						  data: {
						    labels: xValues,
						    datasets: [{
  							  label: userData.symbol.toUpperCase() + " prices "+ viewDuration() ,
						      borderColor: userData.dominantColor,
						      borderWidth:2,
						      backgroundColor: chroma(userData.dominantColor).darken(1.8).hex(),
						      data: yTargetValues,
						      tension:0.5,
						      spanGaps: true,
						      pointRadius:1,
						      pointBackgroundColor: chroma(userData.dominantColor).darken(1.8).hex()

						    }]
						  },
						  options:{
				        plugins: {
							      title: {
							        display: true,
							        text: 'From XXX to YYY',
							      },
				            legend: {
				                labels: {
				                    // This more specific font property overrides the global property
				                    font: {
				                        lineHeight: 2
				                    }
				                }
				            }
				        },
			        	scales: {
					            x: {
					               ticks: {
					                   display: false,
                             callback: function(val, index) {
										            // Hide every 2nd tick label
										            return index % 10 === 0 ? this.getLabelForValue(val) : '';
										          },

					              },
		                      grid: {
									                display:false
							            }
					           }
					        }
					    }
						};
						 myChart = new Chart(ctx, config);
						 // console.log(userData)

			})
}



var timers = document.getElementsByClassName('graph-timer')
for (let timer of timers){
	timer.onclick = function(){
		chartDuration = timer.value
		chartParams = "/market_chart?vs_currency=usd&days="+chartDuration+"&interval=hourly"
		let url   = "https://api.coingecko.com/api/v3/coins/"+ userData.id + chartParams
		drawChart(userData,url)
	}
}

var timerSubmit = document.getElementById("timer-submit")
timerSubmit.onclick = function(){
		chartDuration = document.getElementById("timer-input").value
		chartParams = "/market_chart?vs_currency=usd&days="+chartDuration+"&interval=hourly"
		let url   = "https://api.coingecko.com/api/v3/coins/"+ userData.id + chartParams
		drawChart(userData,url)
}

function tweenAndDrawDetails(object){
	auraSelectedMesh = object
	userData = object.userData
	let vec = new THREE.Vector3()
	object.getWorldPosition(vec)
	setupTween (camera.position.clone(), getCamPos(vec), 1500, vec)
	var url = baseUrl+ object.userData.id
	var targetHistoryUrl = "https://api.coingecko.com/api/v3/coins/"+object.userData.id + chartParams

	let result = getData(url)
	var sym = object.userData.symbol
	// console.log(result)

	getData(url).then(function(result){
		document.getElementById('ava').style.backgroundImage = `url(webps/${sym}.webp)`
		document.getElementById('Name').textContent = object.userData.name
		document.getElementById('coinRank').innerHTML = '<i class="fa-regular fa-ranking-star">'+" "+result.coingecko_rank
		document.getElementById('coinPrice').textContent = ' '+result.coingecko_rank
		document.getElementById('Symbol').textContent = result.symbol.toUpperCase()
		document.getElementById('desContent').textContent = result.description.en
		console.log(getData(url))
	})

	drawChart(object.userData,targetHistoryUrl)
	rightDrawer.open()

	onWindowResize()
}

	function onPointerDown( event ) {
		raycaster2.setFromCamera( pointer, camera );
		const selectedIntersects = raycaster2.intersectObjects( auraMeshes, false );
		
		if ( selectedIntersects.length > 0 && isClickable === true  && isOnDiv=== false) {
			auraSelectedMeshOld = auraSelectedMesh
			userData = selectedIntersects[0].object.userData
			tweenAndDrawDetails(selectedIntersects[0].object)

			let vec = new THREE.Vector3()
			selectedIntersects[0].object.getWorldPosition(vec)
			// console.log(vec)
			// console.log(camera.position)

		}
		else if (isOnDiv == false)  {

			rightDrawer.close()

		}

	}

//search


const autoCompleteJS = new autoComplete({
	data: {
		src: async () => {
			try {
				// Loading placeholder text
				document
					.getElementById("autoComplete")
					.setAttribute("placeholder", "Loading...");
				// Fetch External Data Source
				// const source = await fetch(
				// 	"https://tarekraafat.github.io/autoComplete.js/demo/db/generic.json"
				// );
				// const data = await source.json();
				const data = await fetchedCoinData
				// Post Loading placeholder text
				document
					.getElementById("autoComplete")
					.setAttribute("placeholder", autoCompleteJS.placeHolder);
				// Returns Fetched data
				return data;
			} catch (error) {
				return error;
			}
		},
		keys: ["name","symbol"],
		cache: true,
		filter: (list) => {
			// Filter duplicates
			// incase of multiple data keys usage
			const filteredResults = Array.from(
				new Set(list.map((value) => value.match))
			).map((food) => {
				return list.find((value) => value.match === food);
			});

			return filteredResults;
		}
	},
	placeHolder: "Search for id, symbol or name",
	resultsList: {
		element: (list, data) => {
			const resultInfo = document.createElement("p");
			resultInfo.setAttribute("id","resultInfo")
			if (data.results.length > 0) {
				resultInfo.innerHTML = `Displaying <strong>${data.results.length}</strong> out of <strong>${data.matches.length}</strong> results`;
			} else {
				resultInfo.innerHTML = `Found <strong>${data.matches.length}</strong> matching results for <strong>"${data.query}"</strong>`;
				
			}
			list.prepend(resultInfo);
		},
		noResults: true,
		maxResults: 15,
		tabSelect: true
	},
	resultItem: {
		element: (item, data) => {
			console.log(data)
			// Modify Results Item Style
			// console.log("URI_"+String(data.value.symbol))
			item.style = "display: flex;flex-direction:row;";
			item.innerHTML = `
			<img class="search-thumb" src=webps/${data.value.symbol.toUpperCase()}.png ">
			<div style ="display:flex; flex-direction:column;flex-grow:1;justify-content:center;">
				<div style ="display:flex;flex-direction:row;justify-content:space-between;">
				      <div style=" font-size: 13px;font-weight:600;">
				         ${data.match}
				      </div>
		      	      <div style="font-size: 13px; text-transform: uppercase; color: rgba(0,0,0,.5);font-weight:600">
				        ${data.value.symbol}
				      </div>
				</div>
				<div style ="display:flex;flex-direction:row;font-size: 10px;font-weight:600;">
			  	      <div style="margin:5px;width:15%">
				        <i class="fa-regular fa-hashtag"></i> ${data.value.rank}
				      </div>
  			  	      <div style="margin:5px;width:15%">
				       	<i class="fa-regular fa-dollar-sign"></i> ${Math.round(data.value.price * 100) / 100}
				      </div>

				</div>				
			</div>

      `;
		},
		highlight: true
	},
	events: {
		input: {
			focus: () => {
				if (autoCompleteJS.input.value.length) autoCompleteJS.start();
			},
      open() {
          const position =
              autoCompleteJS.input.getBoundingClientRect().bottom + autoCompleteJS.list.getBoundingClientRect().height >
              (window.innerHeight || document.documentElement.clientHeight);

          if (position) {
              autoCompleteJS.list.style.bottom = autoCompleteJS.input.offsetHeight + 8 + "px";
              console.log(1)
          } else {
              autoCompleteJS.list.style.bottom = -autoCompleteJS.list.offsetHeight - 8 + "px";
              console.log(2)
          }
      },
		}
	}
});



autoCompleteJS.input.addEventListener("selection", function (event) {
	const feedback = event.detail;
	autoCompleteJS.input.blur();
	// Prepare User's Selected Value
	const selection = feedback.selection.value[feedback.selection.key];
	// Render selected choice to selection div
	// document.querySelector(".selection").innerHTML = selection;
	// Replace Input value with the selected value
	autoCompleteJS.input.value = selection;
	// Console log autoComplete data feedback
	console.log(feedback);
	var selValue = feedback.selection.value
	let obj = scene.getObjectByName(selValue.id)
	console.log(obj)
	tweenAndDrawDetails(obj)
	
		// let vec = new THREE.Vector3()
		// let obj = new THREE.Object3D()
		// obj.position.set(selValue.posX*posRescaled, selValue.posY, selValue.posZ*posRescaled)
		// obj.getWorldPosition(vec)
	// setupTween (camera.position.clone(), getCamPos(vec), 1500, vec)
});




	//end

	stats = new Stats();
	container.appendChild( stats.dom );

	// GUI

	//
	// sky.material.uniforms.sunPosition.value.set(0,0,-100)

	const gui = new GUI();
	gui.close()
	
	const folderSky = gui.addFolder( 'Sky' );
	folderSky.add( parameters, 'elevation', -3, 90, 0.1 ).onChange( updateSun );
	folderSky.add( parameters, 'azimuth', - 180, 1800, 0.1 ).onChange( updateSun );
	folderSky.add( parameters, 'turbidity', -0.6, 10, 0.1 ).onChange( updateSun );
	folderSky.add( parameters, 'rayleigh', 0, 12, 0.01 ).onChange( updateSun );
	folderSky.add( parameters, 'mieCoefficient', 0, 0.1, 0.005 ).onChange( updateSun );
	folderSky.add( parameters, 'mieDirectionalG', -1, 1, 0.05 ).onChange( updateSun );
	folderSky.add( parameters, 'exposure', -1, 1, 0.05 ).onChange( updateSun );


	folderSky.open();

	const waterUniforms = water.material.uniforms;

	const folderWater = gui.addFolder( 'Water' );
	folderWater.add( waterUniforms.distortionScale, 'value', 0, 8, 0.1 ).name( 'distortionScale' );
	folderWater.add( waterUniforms.size, 'value', 0.1, 10, 0.1 ).name( 'size' );
	folderWater.open();

	const folderFluc = gui.addFolder( 'Fluctuation' );
	folderFluc.add( fluc, 'speed', 0, 20, .1 )
	folderFluc.add( fluc, 'range', 0, 20, .1 )
	folderWater.open();

	const folderCam = gui.addFolder( 'Camera' );
	folderCam.add( camParams, 'posX', 0, 1000, 1 ).onChange(updateCam)
	folderCam.add( camParams, 'posY', 0, 1000, 1 ).onChange(updateCam)
	folderCam.add( camParams, 'posZ', 0, 1000, 1 ).onChange(updateCam)
	folderCam.add( camParams, 'lookAtX', 0, 1000, 1 ).onChange(updateCam)
	folderCam.add( camParams, 'lookAtY', 0, 1000, 1 ).onChange(updateCam)
	folderCam.add( camParams, 'lookAtZ', 0, 1000, 1 ).onChange(updateCam)
	folderWater.open();
	//

	window.addEventListener( 'resize', onWindowResize );//

	camera.position.copy(getCamPos(new THREE.Vector3(0,0,0)))
	stat2.innerHTML = `Sun Pos: x:${getSunPos().x.toFixed(2)}  
														y:${getSunPos().y.toFixed(2)}   
														z:${getSunPos().z.toFixed(2)}
									`
}

//

function updateCam(){
	let vec = new THREE.Vector3(camParams.lookAtX,camParams.lookAtY,camParams.lookAtZ)
	camera.position.set(camParams.posX,camParams.posY,camParams.posZ)
	camera.lookAt(vec)

}

function onWindowResize() {

	camera.aspect = container.clientWidth / container.clientHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( container.clientWidth, container.clientHeight );
	labelRenderer.setSize( container.clientWidth, container.clientHeight );
}

function animate() {
	
	
	//if ( mixer) mixer.update( clock.getDelta() );
	requestAnimationFrame( animate );

	stats.update();
	let delta = clock.getDelta();
	TWEEN.update()
	render();
	labelRenderer.render( scene, camera );
	controls.update()

}

// camera.position.copy(getCamPos(new THREE.Vector3(0,0,0)))
function render() {
		// controls.update()
		time = performance.now() * 0.0008;
		for (let coinDatum of coinData){
			// for (let child of coinDatum.lod.children){
				coinDatum.coinMesh.position.y = Math.sin( time*fluc.speed ) * coinDatum.fluctRange+coinDatum.posY//coinDatum.fluctRange +coinDatum.posY //speed = 1, range = 5
				coinDatum.coinMesh.rotation.x = time * coinDatum.rotationX*10;
				coinDatum.coinMesh.rotation.z = time * coinDatum.rotationX*11;

		}
		
		//sun flares
		let sunLocalPos = sky.material.uniforms.sunPosition.value
		pointLight.position.set(sunLocalPos.x * skyScalar, sunLocalPos.y * skyScalar, sunLocalPos.z * skyScalar)


		water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

		renderer.render( scene, camera );
		raycaster.setFromCamera( pointer, camera );
		const intersects = raycaster.intersectObjects( auraMeshes, false );
		
		if ( intersects.length > 0 ) {
			// console.log("intersects lenght: ", intersects.length)
			
			intersects[0].object.visible = true
			auraOnMeshes.push(intersects[0].object)

			// console.log("camTarget is ", camTarget)
			document.body.style.cursor = 'pointer';
			labelObj.parent = intersects[0].object
			labelDiv.textContent = intersects[0].object.userData.name+ ' - ' + intersects[0].object.userData.symbol.toUpperCase();

		} else {
			for (let auraOnMesh of auraOnMeshes){
				auraOnMesh.visible = false
				auraOnMeshes = []
			}

			document.body.style.cursor = 'context-menu';
		}
		if(auraSelectedMesh != null){
			auraSelectedMesh.visible = true
		}
		if(auraSelectedMeshOld != null){
			auraSelectedMeshOld.visible = false

		}

		stat1.innerHTML = `Cam Pos: x:${camera.position.x.toFixed(2)}  
																y:${camera.position.y.toFixed(2)}   
																z:${camera.position.z.toFixed(2)}
											`
		try {
		stat2.innerHTML = `Sun Pos: x:${getSunPos().x.toFixed(2)}  
																y:${getSunPos().y.toFixed(2)}   
																z:${getSunPos().z.toFixed(2)}
											`
		}
		catch {	
		}
}
export { sliderValue, sliderValueMax  }