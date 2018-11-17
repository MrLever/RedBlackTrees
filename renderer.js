//Globals
var renderer;
var scene;
var bufferScene;
var bufferTexture;

var camera;
var light;

var cube;

var shadowMapWidth = 1024;
var shadowMapHeight = 1024;

//Functions
function initRenderer(){
    renderer = new THREE.WebGLRenderer( { antialias: true } );//let renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor (0x226666, 1);
    renderer.shadowMap.enabled = true;
    document.body.appendChild( renderer.domElement );
}

function initScene(){
    scene = new THREE.Scene();
    light = new THREE.PointLight( 0xffffff);
    light.position.set( 0, 0, 50 );
    scene.add( light );
}

function initCamera(){
    var aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera( 60, aspect, 1, 100 );
    
    var cameraControls = new THREE.OrbitControls( camera, renderer.domElement);
    cameraControls.addEventListener("change",render,false)

    camera.position.z = 20;
    scene.add(camera);
}
function init(){
    initRenderer();
    initScene();
    initCamera();

    window.addEventListener("resize",resize, false);
    render();
}

//Callbacks
function render() {
    //Render depth buffer to texture
    //var lightCamera = light.shadow.camera;
    //renderer.render( bufferScene, lightCamera, bufferTexture)
    
    //Render scene normally
    renderer.render( scene, camera );
}

function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    render();
}

//main
function mainFunction(){
    init();

    var brickTexture = new THREE.TextureLoader().load( 'textures/brickwall.jpg' );
    var normalMap = new THREE.TextureLoader().load( 'textures/brickWallMap.png' );

    var myShader = new THREE.RawShaderMaterial({
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
                value: new THREE.Vector3(1, 1, 1)
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
            },
            texture: {
                type: "t",
                value: brickTexture
            },
            normalMap:{
                type: "t",
                value: normalMap
            },
            isShadowReciever:{
                value: false
            }
        }
    });
    
    myShader.extensions.derivatives = true;

    var shadowReciever = myShader.clone();
    shadowReciever.uniforms.isShadowReciever.value = true;

    var redBlackTree = new RedBlackTree();
    
    //Back plane (Recivever)
    var backPlaneMat = myShader.clone();
    backPlaneMat.uniforms.materialColor.value = new THREE.Vector3(.5, 0, .5);
    var planeGeo = new THREE.PlaneBufferGeometry(50, 50);
    var plane = new THREE.Mesh(planeGeo, backPlaneMat);
    plane.receiveShadow = true;
    scene.add(plane);

    plane.translateZ(-25);

    render();

}