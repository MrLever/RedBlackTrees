var redBlackTree = new RedBlackTree();

function mainFunction(){
    init();    
    
    nodeShader.extensions.derivatives = true;
    //var shadowReciever = nodeShader.clone();
    //shadowReciever.uniforms.isShadowReciever.value = true;
    
    //Back plane (Recivever)
    var backPlaneMat = nodeShader.clone();
    backPlaneMat.uniforms.materialColor.value = new THREE.Vector3(.5, 0, .5);
    var planeGeo = new THREE.PlaneBufferGeometry(50, 50);
    var plane = new THREE.Mesh(planeGeo, backPlaneMat);
    plane.receiveShadow = true;
    scene.add(plane);

    plane.translateZ(-25);

    render();

}