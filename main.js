var redBlackTree = new RedBlackTree();

var renderer;
var scene;
var camera;
var light = new THREE.PointLight(0xffffff);
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
        }
    }
}); 
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
    scene.add( light );
}

function initCamera(){
    var aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera( 60, aspect, 1, 1000 );
    
    var cameraControls = new THREE.OrbitControls( camera, renderer.domElement);
    cameraControls.addEventListener("change",render,false)
    camera.position.z = 50;
    scene.add(camera);
}

function init(){
    initRenderer();
    initScene();
    initCamera();

    window.addEventListener("resize",resize, false);
    render();
}

function render() {
    //Render scene normally
    renderer.render( scene, camera );
}

function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    render();
}

function drawTree(x = 0, y = 0, root = redBlackTree.root){
    if(root.Value == undefined){
        console.log("Tree root null ");
        return;
    }
    
    console.log("Drawing tree");

    drawTree(x - 25, y - 25, root.LST);
    drawNode(root, x, y);
    drawTree(x + 25, y - 25, root.RST);
    

}

function drawNode(root, x, y) {
    if(root.Value == undefined){
        return;
    }

    console.log("Drawing: " + root.value);

    var nodeGeo = new THREE.SphereGeometry(5, 32, 32);
    var nodeMat = nodeShader.clone();
    
    if (root.IsRed) {
        console.log("Color red");
        nodeMat.uniforms.materialColor.value = new THREE.Vector3(.5, 0, 0);
    }
    else {
        console.log("Color black");
        nodeMat.uniforms.materialColor.value = new THREE.Vector3(.1, .1, .1);
    }

    var nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);


    nodeMesh.translateX(x);
    nodeMesh.translateY(y);
    scene.add(nodeMesh);
}

function mainFunction(){
    init();

    var cubeGeo = new THREE.CubeGeometry(5,5,5);
    var cubeMat = nodeShader.clone();
    var cube =  new THREE.Mesh(cubeGeo, cubeMat);
    cubeMat.uniforms.materialColor.value = new THREE.Vector3(.5, 0, .5);
    scene.add(cube);

}