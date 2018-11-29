light = new THREE.SpotLight( 0xffffff);
light.position.set( 0, 0, 50 );

var nodeShader = new THREE.RawShaderMaterial({
    side: THREE.DoubleSide,
    fragmentShader: document.getElementById('fragmentShader').textContent,
    vertexShader: document.getElementById('vertexShader').textContent,
    uniforms: {
        ambientLightColor: { 
            type: "v3", 
            value: new THREE.Vector3(1, 1, 1) 
        },
        ambientStrength: {
            type: "f", 
            value: .1
        },
        materialColor:{
            type: "v3",
            value: new THREE.Vector3(.2, .2, .2)
        },
        lightPosition:{
            type: "v3",
            value: light.position
        },
        lightColor:{
            type: "v3",
            value: new THREE.Vector3(1,1,1)
        },
        specularStrength:{
            type: "f",
            value: .5
        }
    }
}); 

var renderer;
var scene;
var camera;
var light;

renderer = new THREE.WebGLRenderer( { antialias: true } );//let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setClearColor (0x303030, 1);


scene = new THREE.Scene();

scene.add(light);

var aspect = window.innerWidth / window.innerHeight;
camera = new THREE.PerspectiveCamera( 60, aspect, 1, 100000 );

var cameraControls = new THREE.OrbitControls( camera, renderer.domElement);
cameraControls.addEventListener("change",render,false)

camera.position.z = 20;
scene.add(camera);

function render() {
    //Render depth buffer to texture
    //var lightCamera = light.shadow.camera;
    //renderer.render( bufferScene, lightCamera, bufferTexture)
    
    //Render scene normally
    renderer.render( scene, camera );
}

function animateNode(nodeMesh, target){
    var tween = new TWEEN.Tween(nodeMesh.position)
    .to({ x: target.x, y: target.y }, 2000)
    .easing(TWEEN.Easing.Quadratic.In)
    .onUpdate(function(){})
    .onComplete(function(){
        console.log("done");
    });
    tween.start();

    return tween;
}