// Using javascript has made this project 100x harder than it should have been
// I spent more time fighting the language than actually getting work done.

var redBlackTree = new RedBlackTree();

function mainFunction(){
    document.body.appendChild( renderer.domElement );

    // redBlackTree.InsertNode(1);
    // redBlackTree.InsertNode(0);
    // redBlackTree.InsertNode(2);
    // redBlackTree.InsertNode(1.5); 
    // redBlackTree.InsertNode(3);
    // redBlackTree.InsertNode(4);
    // redBlackTree.InsertNode(-1);
    // redBlackTree.InsertNode(-4);
    // redBlackTree.InsertNode(31);
    // redBlackTree.InsertNode(12);
    // redBlackTree.InsertNode(9);
    // redBlackTree.InsertNode(18);
    // redBlackTree.InsertNode(-30);
    // redBlackTree.InsertNode(19);
    // redBlackTree.InsertNode(20);
    // redBlackTree.InsertNode(21);
    // redBlackTree.InsertNode(22);

    redBlackTree.InsertNode(30);
    redBlackTree.InsertNode(20);
    redBlackTree.InsertNode(40);
    redBlackTree.InsertNode(35);
    redBlackTree.InsertNode(50);
    redBlackTree.InsertNode(19);
    redBlackTree.InsertNode(21);
    redBlackTree.RemoveNode(19);
    redBlackTree.RemoveNode(21);
    // redBlackTree.InsertNode(20);
    // redBlackTree.InsertNode(21);
    // redBlackTree.InsertNode(22);

    var gui = new dat.GUI();
    gui.add(redBlackTree, 'insertValue')
    gui.add(redBlackTree, 'InsertNode');
    gui.add(redBlackTree, 'deleteValue')
    gui.add(redBlackTree, 'RemoveNode');

    function animate(time) {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
        TWEEN.update(time);
    }

    animate();
}
