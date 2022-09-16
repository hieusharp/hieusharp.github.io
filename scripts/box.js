import * as THREE from './js/three.module.js';
import { GLTFLoader } from './js/GLTFLoader.js';
// import { EffectComposer } from './js/EffectComposer.js';
// import { RenderPass } from './js/RenderPass.js';
// import { UnrealBloomPass } from './js/UnrealBloomPass.js';
// import { ShaderPass  } from './js/ShaderPass.js';
// import { FXAAShader  } from './js/FXAAShader.js';
import { sliderValue, sliderValueMax} from './main.js';

var oldSliderValue
var light

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
	            transparent: true,
	            });
	 return glowMat
}


var glowCoinMat = createGlowMat("gold",1,0.3,6.5)

var auraGoldMat = createGlowMat("gold",1,0.05,6.5) //gold
function createSunSlider(){
	let box = document.getElementById("planet")
	let composer
	var sunModel, fxaaPass, mesh, auraMesh

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera( 75, box.clientWidth / box.clientHeight, 0.1, 1000 );

	const renderer = new THREE.WebGLRenderer({
		alpha:true,
		antialias:true
	});
	renderer.setSize( box.clientWidth, box.clientHeight );
	renderer.autoClear = true;
	renderer.setPixelRatio( window.devicePixelRatio );
	// renderer.setClearColor("red",0);
	// renderer.setClearAlpha()
	box.appendChild( renderer.domElement );
	let loader = new THREE.TextureLoader()
	// let texture = loader.load("model/sun.jpeg")
	let texture = loader.load("model/sun.jpeg")
	let geo = new THREE.SphereGeometry(2.5,64,64)
	let geo2 = new THREE.SphereGeometry(4.8,64,64)
	let mat = new THREE.MeshLambertMaterial({map:texture})
	mesh = new THREE.Mesh(geo,mat)
	auraMesh = new THREE.Mesh(geo2,auraGoldMat)

	mesh.add(auraMesh)
	scene.add(mesh)

	//light
	light = new THREE.PointLight( "white", 1 );
	// light.position.set(-100, 20,50);
	scene.add(light);


	// const alight = new THREE.AmbientLight( "white",100 ); // soft white light
	// scene.add( alight );
	// alight.visible = false

	let helper = new THREE.AxesHelper(10)
	// scene.add(helper)
	// const renderScene = new RenderPass( scene, camera );
	// fxaaPass = new ShaderPass( FXAAShader );

	let pixelRatio = renderer.getPixelRatio();

	// fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( box.offsetWidth * pixelRatio );
	// fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( box.offsetHeight * pixelRatio );
	// var rangeStops = [["25%","75%"],["21%","71%"],["17%","67%"],["13%","63%"],["8%","58%"],["4%","54%"],["50%","100%"],["46%","96%"],["42%","92%"],["38%","88%"],["33%","83%"],["29%","79%"],["25%","75%"],["21%","71%"],["17%","67%"],["13%","63%"],["8%","58%"],["4%","54%"],["50%","100%"],["46%","96%"],["42%","92%"],["38%","88%"],["33%","83%"],["29%","79%"],]


	// const bloomPass = new UnrealBloomPass( new THREE.Vector2( box.innerWidth, box.innerHeight ), 1.5, 0.4, 0.85 );
	function updateSlider(){
		let now = new Date()
		let nowHour = now.getHours()
		let nowVal = nowHour + now.getMinutes()

		let thenDate = new Date(now.getTime() - (sliderValueMax-sliderValue )*60000);
		// document.querySelector('#time').textContent = thenDate.toLocaleString()
		let thenHour = thenDate.getHours()

		let stat = Math.abs(Math.cos(thenHour*Math.PI/12))*2.5   // 0 to 2.5

			// bloomPass.strength =  Math.max(1.2,stat)
			// bloomPass.exposure = Math.max(1.2,stat)
			// bloomPass.threshold = 0
			// bloomPass.radius = 0.4

		if(thenHour>=6 && thenHour <18){
			box.style.filter = ""
			light.position.set(0, 0,50);
			auraMesh.visible = true
			light.intensity = 1.5			

		} else {
			light.intensity = 3 + Math.sin(thenHour*Math.PI/12)
			box.style.filter = "grayscale(70%)"
			// alight.visible = false
			light.position.x = Math.sin(thenHour*Math.PI/12)*100 //*Math.sign(thenHour+0.5 - halfDayAgo)
			light.position.y = 10//Math.cos(thenHour*Math.PI/12)*20 *Math.sign(thenHour+0.5 - halfDayAgo)
			light.position.z = 50
			auraMesh.visible = false
			// console.log("mid", halfDayAgo)
			// console.log("posx", light.position.x) 
		}

	}

	// composer = new EffectComposer( renderer );
	// composer.addPass( renderScene );
	// composer.addPass( bloomPass );
	// composer.addPass( fxaaPass );

	camera.position.z = 7.5;
	updateSlider()
	// window.addEventListener( 'resize', onWindowResize );


	// function onWindowResize() {

	// 	const width = window.innerWidth;
	// 	const height = window.innerHeight;

	// 	camera.aspect = width / height;
	// 	camera.updateProjectionMatrix();

	// 	renderer.setSize( width, height );
	// 	composer.setSize( width, height );
	// 	var pixelRatio = renderer.getPixelRatio();

	// 	fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( box.offsetWidth * pixelRatio );
	// 	fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( box.offsetHeight * pixelRatio );
	// }

	function animate() {
		requestAnimationFrame( animate );
		if(mesh){
		mesh.rotation.x +=0.01
		mesh.rotation.y +=0.01
		mesh.rotation.z +=0.01			
		}
		if(oldSliderValue != sliderValue) {
			updateSlider()
			oldSliderValue = sliderValue
		}

		renderer.render(scene,camera)
		// composer.render();
	};

	animate();
}

createSunSlider()



// export { updateSlider  }