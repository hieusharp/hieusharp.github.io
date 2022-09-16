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

const legacySymbols = ['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'BUSD', 'XRP', 'ADA', 'SOL', 'DOT', 'DOGE', 'SHIB', 'STETH', 'DAI', 'MATIC', 'TRX', 'AVAX', 'WBTC', 'ETC', 'UNI', 'LEO', 'LTC', 'ATOM', 'OKB', 'NEAR', 'FTT', 'LINK', 'CRO', 'XLM', 'XMR', 'LUNC', 'BCH', 'ALGO', 'FLOW', 'VET', 'ICP', 'FIL', 'APE', 'HBAR', 'EOS', 'XCN', 'FRAX', 'XTZ', 'QNT', 'MANA', 'SAND', 'AXS', 'AAVE', 'LDO', 'EGLD', 'THETA', 'TUSD', 'CHZ', 'BSV', 'USDP', 'EVMOS', 'KCS', 'CUSDC', 'XEC', 'GRT', 'BTT', 'HBTC', 'ZEC', 'MIOTA', 'USDD', 'LUNA', 'RVN', 'HT', 'XRD', 'SNX', 'KLAY', 'FTM', 'NEO', 'MKR', 'CDAI', 'USDN', 'CEL', 'BIT', 'GT', 'HNT', 'OSMO', 'CAKE', 'PAXG', 'RPL', 'RUNE', 'DFI', 'ZIL', 'CETH', 'NEXO', 'ENJ', 'AR', 'BAT', 'DASH', 'STX', 'USTC', 'TKX', 'WAVES', 'AMP', 'TWT', 'CRV', 'XAUT', 'BTG', 'KSM', 'LRC', '10SET', 'GMT', 'FXS', 'DCR', 'GNO', 'KAVA', 'XEM', 'OMI', '1INCH', 'ENS', 'HOT', 'CELO', 'COMP', 'GALA', 'MINA', 'XDC', 'GMX', 'TFUEL', 'NXM', 'CVX', 'GLM', 'CUSDT', 'QTUM', 'JUNO', 'KDA', 'SRM', 'GUSD', 'MEX', 'ROSE', 'IOST', 'CVXCRV', 'FLUX', 'SYN', 'YFI', 'OHM', 'ANKR', 'OKT', 'SAFEMOON', 'IOTX', 'ONE', 'OP', 'LPT', 'OMG', 'ZRX', 'MSOL', 'RSR', 'ERG', 'VGX', 'JST', 'BAL', 'ELG', 'SUSHI', 'LN', 'SGB', 'AUDIO', 'POLY', 'MIM', 'ICX', 'NU', 'HIVE', 'EURT', 'ONT', 'GLMR', 'KNC', 'DAG', 'WAXP', 'SC', 'MC', 'SCRT', 'ZEN', 'IMX', 'DAO', 'BABYDOGE', 'EWT', 'SFM', 'MXC']
var trendingSymbols =[]
var trendingObjects = []

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
async function getCGCData(url) {
    
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

getCGCData("https://api.coingecko.com/api/v3/search/trending").then( (result) => { 
	try{
		for (let coin of result.coins){
			trendingSymbols.push(coin.item.symbol.toUpperCase())
			// console.log(result)
		}
	} catch (err){
		trendingSymbols.push("BTC")
		console.log(err)
	}
	// finally{
	// 	let topTrendingMesh = scene.getObjectByName("EVMOS")
	// 	console.log(topTrendingMesh)
	// 	console.log(trendingSymbols[0])
	// }
} )

// console.log(trendingSymbols)




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
		// console.log(sunPos)
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

let spritesTexture = textureLoader.load(`assets/Result.webp`)
// let spriteRepeat = new THREE.Vector2(1/10,1/18)

async function createCoins(fr,to){

	 glTFloader.load(model, function(gltfModel) {
	 	

		// let ringMesh = gltfModel.scene
		// let ringGeo = ringMesh.children[0].geometry
		let dummyMesh = new THREE.Mesh(coinGeo3,glowCoinMat)
		
		
		var dataX = fetchedCoinData.slice(fr,to)
		console.log(fetchedCoinData.length)
		
		for (let datum of dataX){

				// dominant color affects aura and chart tone
				try{
					var dominantColor = colors["img_"+ (datum.sb.toUpperCase())]
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
				let r2Mesh = gltfModel.scene.children[0].clone() //the outer ring that wrap the coin core
				let scaleX = datum.rd
				r2Mesh.scale.set(scaleX/2.4,scaleX/2.4,scaleX) 
				r2Mesh.material = r2Mat


				let coinGeo = getGeo(scaleX)
				let reservedMat = globalMat.clone()
				let coinMesh		
				
				
				// if (datum.rk <=180){
				if ( legacySymbols.includes(datum.sb.toUpperCase()) ) {

						console.log("true")

							
						coinMesh = new THREE.Mesh( coinGeo, reservedMat )

						let spriteTexture = spritesTexture.clone()
						spriteTexture.repeat.x = 1/10 // sprite of 10x18, scale = x10,x18
						spriteTexture.repeat.y = 1/18

						spriteTexture.offset.x = Math.floor(legacySymbols.indexOf(datum.sb.toUpperCase()) % 10) /10
						spriteTexture.offset.y = Math.floor(legacySymbols.indexOf(datum.sb.toUpperCase()) / 10) /18

						// spriteTexture.center.x = 0.5
						// spriteTexture.center.y = 0.5

						reservedMat.map = spriteTexture

						// legacyRank +=1
						coinData.push({
								coinMesh:coinMesh,
								fluctRange: datum.fR, 
								posY: datum.y,
								rotationX:datum.mR,
								name:datum.n,
								dominantColor: colorStr,
								symbol: datum.sb,
								reservedMat: reservedMat,
								textureFilled: true,
						})
				} else {
						coinMesh = new THREE.Mesh( coinGeo, glowCoinMat )
						coinData.push({
								coinMesh:coinMesh,
								fluctRange: datum.fR, 
								posY: datum.y,
								rotationX:datum.mR,
								name:datum.n,
								dominantColor: colorStr,
								symbol: datum.sb,
								reservedMat: reservedMat,
								textureFilled: false,
						})				
				}


				coinMesh.name = datum.sb.toUpperCase()
				coinMesh.add(r2Mesh)
				coinMesh.position.set(datum.x*posRescaled, datum.y,datum.z*posRescaled) 

				


				scene.add(coinMesh)
				// console.log(coinMesh)
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
					name:datum.n,
					symbol:datum.sb,
					// slot:datum.slot,
					dominantColor: colorStr
				}
				// coinMeshNear.add(auraMesh)
				coinMesh.add(auraMesh)
				 if (datum.inUATU === true){auraMesh.visible = true}
				 auraMeshes.push(auraMesh)


			// console.log(lod)

		} //end loop

	 })
}
createCoins(0,2500)








// const zms = await xsm()
// console.log(zms)

// createCoins(0,2500).then(() =>{
// 	getCGCData("https://api.coingecko.com/api/v3/search/trending").then( (result) => { 
// 	try{
// 		for (let coin of result.coins){
// 			trendingSymbols.push(coin.item.symbol)
// 			// console.log(result)
// 		}
// 	} catch (err){
// 		trendingSymbols.push("BTC")
// 		console.log(err)
// 	}
// 	finally{
// 		let topTrendingMesh = scene.getObjectByName(trendingSymbols[0].toUpperCase())
// 		console.log(topTrendingMesh)
// 		console.log(trendingSymbols[0])
// 		camera.position.copy(getCamPos(topTrendingMesh.position))

// 	}
// } )
// })

// async function getTrendingSymbols() {
// 	const
// }
// await function initCam(){

// }

// async function setupCam(){
// 	const allCoins = await createCoins(0,2500)
// 	const trendingCoins = await getTrending(allCoins)
// 	await 
// }

// console.log(getTrendingSymbols())



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
	controls.autoRotateSpeed = 0.5

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

			getCGCData(targetHistoryUrl).then(function(result){

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

	const result =  getCGCData(url)
	var sym = object.userData.symbol
	console.log(result)

	getCGCData(url).then(function(result){
		document.getElementById('ava').style.backgroundImage = `url(webps/${sym}.webp)`
		document.getElementById('Name').textContent = object.userData.name
		document.getElementById('coinRank').innerHTML = '<i class="fa-regular fa-ranking-star">'+" "+result.coingecko_rank
		document.getElementById('coinPrice').textContent = ' '+result.coingecko_rank
		document.getElementById('Symbol').textContent = result.symbol.toUpperCase()
		document.getElementById('desContent').textContent = result.description.en
		console.log(getCGCData(url))
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
			<img class="search-thumb" src=webps/${data.value.symbol.toUpperCase()}.webp ">
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