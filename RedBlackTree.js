class Node{
    constructor(value){
        this.value = value;
        
        this.parent = null;
        this.LST = null;
        this.RST = null;

        this.level = 1;
        this.index = -1;
        //RB-Specific
        this.isRed = false;
        this.isDoubleBlack = false;
        //Rendering
        this.parentEdge = null;

        this.x = -10;
        this.y = 10;

        this.radius = 1;

        this.geometry = new THREE.SphereGeometry(this.radius, 12, 4);
        this.material = nodeShader.clone();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.translateX(-10);
        this.mesh.translateY(10);
        scene.add(this.mesh);

        //Text labels
       
        
        this.sprite = null;
        this.makeSprite();
        // this.sprite.translateZ(1)
        
    }
    makeSprite(){
        if(this.sprite != null){
            scene.remove(scene.getObjectById(this.sprite.id));
        }

        var fontface = "Georgia";
        var fontsize = 24;
        var borderThickness = 4;
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var backgroundColor = {
            r: 0,
            g: 0,
            b: 0,
            a: 0.0
        };
        var fontColor = {
            r: 255,
            g: 255,
            b: 255,
            a: 1.0
        };
        context.font = "Bold " + fontsize + "px " + fontface;
        var metrics = context.measureText(this.value);
        var textWidth = metrics.width;
        context.fillStyle = "rgba(" + fontColor.r + "," + fontColor.g + "," + fontColor.b + "," + fontColor.a + ")";
        context.fillText(this.value, borderThickness, fontsize + borderThickness);

        var texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;

        var spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            color: 0xffffff
        });
        
        this.sprite = new THREE.Sprite(spriteMaterial);
        this.sprite.scale.set(10, 5, 1.0);
        this.sprite.translateX(4.5 - 10);
        this.sprite.translateY(10);
        scene.add(this.sprite);
    }
    clearEdge(){
        if(this.parentEdge != null){
            scene.remove(scene.getObjectById(this.parentEdge.id));
        }
    }
    drawEdge(){
        this.clearEdge();

        var material = new THREE.LineBasicMaterial( { color: Math.floor(Math.random()*16777215) } );

        if(this.parent != null){
            var geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3( this.x, this.y, 0) );
            geometry.vertices.push(new THREE.Vector3( this.parent.x, this.parent.y, 0) );
            
            this.parentEdge = new THREE.Line(geometry, material);
            scene.add(this.parentEdge);
        }
    }
    setPosition(targetX, targetY){
        var target = new THREE.Vector3(targetX,targetY,0);
        var textTarget= new THREE.Vector3(targetX+4.5, targetY, -2);
        //console.log("Targeting " + target.x + ", " + target.y);
        animateNode(this.mesh, target);
        animateNode(this.sprite, textTarget);
        this.x = targetX; 
        this.y = targetY;

        //this.mesh.position.set(x,y,0);
        //this.textLabelMesh.position.set(x,y,0);

        //this.mesh.translateX(x);
        //this.mesh.translateY(y);

       // this.textLabel.translateX(x);
       // this.textLabel.translateY(y);
    }
    isLST(){
        if(this.parent != undefined){
            return this.parent.LST == this;
        }
        else return false;
    }
    getUncle(){
        if(this.parent !== null && this.parent.parent != null){
            if(this.parent.isLST()){
                return this.parent.parent.RST;
            }
            else{
                return this.parent.parent.LST;
            }
        }
    }
    getSibling(){
        if(this.parent != null){
            if(this.isLST() === true){
                return this.parent.RST;
            }
            else{
                return this.parent.LST;
            }
        }
        return null;
    }
    getRedNeice(){
        if(this.getSibling() == null){
            return null;
        }

        if(this.getSibling().RST != null && this.getSibling().RST.isRed == true){
            return this.getSibling().RST;
        }
        else if(this.getSibling().LST != null && this.getSibling().LST.isRed == true){
            return this.getSibling().LST;
        }
        else{
            return null;
        }
    }
    hasRedNephew(){
        var sibling = this.getSibling();
        if(sibling.LST == null && sibling.RST == null){
            return false;
        }
        else if((sibling.LST != null && sibling.LST.isRed == true) || (sibling.RST != null && sibling.RST.isRed == true)){
            return true;
        }
        else{
            return false;
        }
    }
    refreshColor(){
        if(this.isDoubleBlack){
            this.mesh.material.uniforms.materialColor.value = new THREE.Vector3(.0,.0,.0);
        }
        else if(this.isRed){
            this.mesh.material.uniforms.materialColor.value = new THREE.Vector3(.8,0,0);
        }
        else{
            this.mesh.material.uniforms.materialColor.value = new THREE.Vector3(.2,.2,.2);
        }
    }
    destroyNode(){
        console.log("Destroy node: " + this.value);
        scene.remove(scene.getObjectById(this.mesh.id));
        scene.remove(scene.getObjectById(this.sprite.id));
        this.clearEdge();
    }

}

class BinaryTree{
    constructor(){
        this.root = null;
        this.insertValue = 0;
        this.deleteValue = 0;
        this.deletedNode = null;
    }
    DrawEdges(root){
        if(root == null) 
            return;
        
        this.DrawEdges(root.LST);
        this.DrawEdges(root.RST);
        root.drawEdge();
    }
    InsertNodeHelper(root, node){
       if(node.value < root.value){
           if(root.LST === null){
               node.level = root.level + 1;
               node.setPosition(root.x - 5, root.y - 5);
               node.parent = root;
               node.refreshColor();
               root.LST = node;
           }
           else{
               this.InsertNodeHelper(root.LST, node);
           }
       }
       else{
           if(root.RST === null){
               node.level = root.level + 1;
               node.setPosition(root.x + 5, root.y - 5 );
               node.parent = root;
               node.refreshColor();
               root.RST = node;
           }
           else{
               this.InsertNodeHelper(root.RST, node);
           }
       }
    }
    InsertNode(value = this.insertValue){
        var node = new Node(value);
        if(this.root === null){
            node.level = 1;
            this.root = node;
            this.root.setPosition(0, 0);
        }
        else {
            node.isRed = true;
            this.InsertNodeHelper(this.root, node);
        }
        return node;
    }

    FindMinNode(root){
        while(root.LST != null){
            root = root.LST;
        }
        return root;
    }
    FindDepthHelper(root){
        //console.log(root);
        if(root === null){
            return 0;
        }

        var leftDepth = this.FindDepthHelper(root.LST);
        var rightDepth = this.FindDepthHelper(root.RST);
        return (leftDepth > rightDepth) ? leftDepth + 1 : rightDepth + 1;

    }
    FindDepth(){
        return this.FindDepthHelper(this.root);
    }

    UpdateNodeIndicies(root){
        if(root === null){
            return;
        }
        if(root.parent === null){
            root.index = 1;
        }
        else{
            if(root.isLST()){
                root.index = (root.parent.index * 2) - 1;
            }
            else{
                root.index = root.parent.index * 2;
            }
        }

        this.UpdateNodeIndicies(root.LST);
        this.UpdateNodeIndicies(root.RST);
    }

    UpdateNodeLevels(root){
        if(root === null){
            return;
        }
        if(root.parent === null){
            root.level = 1;
        }
        else{
            root.level = root.parent.level + 1;
        }

        this.UpdateNodeLevels(root.LST);
        this.UpdateNodeLevels(root.RST);

    }

    UpdateTreePositionsHelper(root, treeDepth){
        if(root === null){
            return;
        }
        if(root.parent === null){
            root.setPosition(0,0);
        }
        else{
            if(root.isLST() == true){
                root.setPosition(root.parent.x - (7.5 * treeDepth * root.radius / root.level), root.parent.y - 5);
            }
            else{
                root.setPosition(root.parent.x + (7.5 * treeDepth * root.radius / root.level), root.parent.y - 5);
            }
        }

        // var treeWidth = Math.pow(2,treeDepth) * root.radius;
        // var treeHeight = treeDepth * 5;
        
        // console.log("Index: " + root.index);
        // console.log("Tree Depth: " + treeHeight);
        // console.log("Node radius: " + root.radius);
        // console.log("Tree Width: " + treeWidth);


        // var xPos = root.index * (treeWidth / (Math.pow(2, root.level) + 1));
        // var yPos = -(root.level * 5) 

        // root.setPosition(xPos, yPos);

        this.UpdateTreePositionsHelper(root.LST, treeDepth);
        this.UpdateTreePositionsHelper(root.RST, treeDepth);
    }

    UpdateTreePositions(root){
        var depth = this.FindDepth();
        //this.UpdateNodeIndicies(this.root);
        this.UpdateNodeLevels(this.root);
        this.UpdateTreePositionsHelper(this.root, depth);

    }

    findNodeHelper(root, value){
        if(root == null)
            return null;

        if(root.value == value){
            return root;
        }
        if(value < root.value){
            return this.findNodeHelper(root.LST, value);
        }
        else{
            return this.findNodeHelper(root.RST, value);
        }
    }
    findNode(value){
        return this.findNodeHelper(this.root, value);
    }
}

class RedBlackTree extends BinaryTree{
    LeftLeftRotation(node){
        console.log("Left Left Rotation on: " + node.value);
        var uncle = node.getUncle();
        var parent = node.parent;
        var grandparent = node.parent.parent;

        var t1 = node.LST;
        var t2 = node.RST;
        var t3 = node.parent.RST;
        var t4;
        var t5;
        if(uncle !== null){
            t4 = uncle.LST;
            t5 = uncle.RST;
        }
        else{
            t4 = null;
            t5 = null;
        }

        if(grandparent.parent != null){
            if(grandparent.isLST()){
                grandparent.parent.LST = parent;
            }
            else{
                grandparent.parent.RST = parent;
            }
        }
        else{
            this.root = parent;
        }

        parent.parent = grandparent.parent;
        parent.RST = grandparent;
        parent.isRed = false;
        parent.refreshColor();
        


        grandparent.parent = parent;
        grandparent.LST = t3;
        if(t3 != null){
            t3.parent = grandparent;
        }
        grandparent.RST = uncle;
        grandparent.isRed = true;
        grandparent.refreshColor();

        if(uncle != null){
            uncle.parent = grandparent;
            uncle.LST = t4;
            if(t4 != null){
                t4.parent = uncle;
            }
            uncle.RST = t5;
            if(t5 != null){
                t5.parent = uncle;
            }
            uncle.isRed = false;
        }
        
        this.UpdateTreePositions(this.root);
        
        //console.log(this);
    }
    LeftRightRotation(node){
        console.log("Left Right Rotation on: " + node.value);
        var parent = node.parent;
        var grandparent = node.parent.parent;

        var t1 = node.parent.LST;
        var t2 = node.LST;
        var t3 = node.RST;
        
        grandparent.LST = node;

        node.parent = grandparent;
        node.LST = parent;
        node.RST = t3;
        if(t3 !== null){
            t3.parent = node;
        }
        
        parent.parent = node;
        parent.LST = t1;
        if(t1 !== null){
            t1.parent = parent;
        }
        parent.RST = t2;
        if(t2 !== null){
            t2.parent = parent;
        }

        this.UpdateTreePositions(this.root);
        
        //console.log(this);

        //Left Left rotate from parent
        this.LeftLeftRotation(parent);

    }
    RightRightRotation(node){
        console.log("Right Right Rotation on: " + node.value);
        var uncle = node.getUncle();
        var parent = node.parent;
        var grandparent = node.parent.parent;

        var t1;
        var t2;
        if(uncle !== null){
            t1 = uncle.LST;
            t2 = uncle.RST;
        }
        else{
            t1 = null;
            t2 = null;
        }
        var t3 = parent.LST;
        var t4 = node.LST;
        var t5 = node.RST;
        
        

        if(grandparent.parent != null){
            if(grandparent.isLST()){
                grandparent.parent.LST = parent;
            }
            else{
                grandparent.parent.RST = parent;
            }
        }
        else{
            this.root = parent;
        }

        parent.parent = grandparent.parent;
        parent.LST = grandparent;
        parent.isRed = false;
        parent.refreshColor();


        grandparent.parent = parent;
        grandparent.LST = uncle;
        grandparent.RST = t3;
        if(t3 != null){
            t3.parent = grandparent;
        }
        grandparent.isRed = true;
        grandparent.refreshColor();

        if(uncle != null){
            //console.log("Uncle not null");
            uncle.parent = grandparent;
            uncle.LST = t1;
            uncle.RST = t2;
            uncle.isRed = false;
            if(t1 !== null){
                t1.parent = uncle;
            }
            if(t2 != null){
                t2.parent = uncle;
            }
        }
        
        this.UpdateTreePositions(this.root);
    }

    RightLeftRotation(node){
        console.log("Right Left Rotation on: " + node.value);
        var parent = node.parent;
        var grandparent = node.parent.parent;

        var t3 = node.LST;
        var t4 = node.RST;
        var t5 = parent.RST;
        
        grandparent.RST = node;
        node.parent = grandparent;
        node.LST = t3;
        node.RST = parent;
        parent.parent = node;
        parent.LST = t4;
        parent.RST = t5;

        this.UpdateTreePositions(this.root);
        
        //console.log(this);

        //Right-Right rotate from parent
        this.RightRightRotation(parent);
    }


    ValidateInsertion(node){
        console.log("Validating: " + node.value);
        if(node === this.root){ //Color root black
            node.isRed = false;
            node.refreshColor();
            return;
        }
        if(node.parent.isRed == false){ //Everything is fine as is
            return;
        }

        //Shit
        var uncle = node.getUncle();
        var parent = node.parent;
        var grandparent = node.parent.parent;

        if(uncle !== null && uncle.isRed == true){ //Red uncle
            console.log("Recolor");
            uncle.isRed = false;
            parent.isRed = false;
            grandparent.isRed = true;

            parent.refreshColor()
            uncle.refreshColor();
            grandparent.refreshColor();

            this.ValidateInsertion(grandparent);
        }
        else{ //Black uncle
            
            //LEFT LEFT CASE
            if(node.isLST() === true && node.parent.isLST() === true){
                this.LeftLeftRotation(node);               
            }

            //LEFT RIGHT CASE
            else if(node.isLST() === false && node.parent.isLST() === true){
                this.LeftRightRotation(node);
            }

            //RIGHT RIGHT CASE
            else if(node.isLST() === false && node.parent.isLST() === false){
                this.RightRightRotation(node);
            }

            //RIGHT LEFT CASE
            else if(node.isLST() === true && node.parent.isLST() === false){
                this.RightLeftRotation(node);
            }

        }

    }

    InsertNode(value){
        var node = super.InsertNode(value);
        //console.log(node);
        this.ValidateInsertion(node);
        this.DrawEdges(this.root);
        
    }
    
    ValidateRemoval(node, original){
        console.log("Validate removal of: ");
        //console.log(original);
        if(this.root == null){
            return;
        }

        if(node == this.root && node.isDoubleBlack == true){
            if(node.LST != null){
                node.LST.isRed = true;
                node.LST.refreshColor();
            }
            if(node.RST != null){
                node.RST.isRed = true;
                node.RST.refreshColor();
            }
            node.isDoubleBlack = false;
            node.isRed = false;
            node.refreshColor();
            return;
        }
        
        if(node == null){ //New node was null, make a temporary one;
            node = new Node(undefined);
            node.isRed = false;
            node.isDoubleBlack = true;
            node.refreshColor();
            node.parent = original.parent;
            if(original.isLST()){
                node.parent.LST = node;
            }
            else{
                node.parent.RST = node;
            }
            
            //console.log(node);
            this.UpdateTreePositions();
            this.DrawEdges();
        }

        var sibling = node.getSibling();
        var parent = node.parent;

        if((node.isRed == true && original.isRed == false) || (node.isRed == false && original.isRed == true)){ //Easy case, either U or V was red
            node.isRed = false;
            node.refreshColor();
            return;
        }
        else if(sibling == null ||sibling.isRed == false){ //Sibling is black
            node.isDoubleBlack = true;
            node.isRed = false;
            var r = node.getRedNeice();

            
         
            if(r != null){ //Sibling has a red child
                //LEFT LEFT
                this.RemovalRotations(sibling, r, node);
            }
            else{ //Recolor and recur.
                console.log("Recolor")
                console.log(sibling);
                if(sibling != null){
                    sibling.isRed = true;
                    sibling.refreshColor();
                }
                
                if(node.parent.isRed == false){
                    node.parent.isDoubleBlack = true;
                    node.parent.isRed = false;
                    node.parent.refreshColor();
                    this.ValidateRemoval(node.parent, node.parent);
                }
                else{
                    node.parent.isDoubleBlack = false;
                    node.parent.isRed = false;
                    node.parent.refreshColor();
                }
            }
            
        }
        else{ //Sibling is red
            if(node.isLST()){
                console.log("oof");
            }
        }

        if(node.value == undefined){
            node.destroyNode();
            if(node.isLST()){
                node.parent.LST = null;
            }
            else{
                node.parent.RST = null;
            }
        }       
        
    }

    RemovalRotations(sibling, r, node) {
        console.log("Perform removal rotations.");
        if (sibling.isLST() == true && r.isLST() == true) {
            console.log("Perform left left removal rotation");
            this.LeftLeftRotation(r);
            r.isRed = false;
            r.refreshColor();
            node.parent.isRed = false;
            node.parent.refreshColor();
        }
        //LEFT RIGHT
        else if (sibling.isLST() == true && r.isLST() == false) {
            console.log("Perform left right removal rotation");
            this.LeftRightRotation(r);
            r.isRed = false;
            r.refreshColor();
            node.parent.isRed = false;
            node.parent.refreshColor();
        }
        //RIGHT RIGHT
        else if (sibling.isLST() == false && r.isLST() == false) {
            console.log("Perform right right removal rotation");
            this.RightRightRotation(r);
            r.isRed = false;
            r.refreshColor();
            node.parent.isRed = false;
            node.parent.refreshColor();
        }
        //RIGHT LEFT
        else if (sibling.isLST() == false && r.isLST() == true) {
            console.log("Perform right left removal rotation");
            this.RightLeftRotation(r);
            r.isRed = false;
            r.refreshColor();
            node.parent.isRed = false;
            node.parent.refreshColor();
        }
    }

    RemoveNodeHelper(node, value){ 
        var original = node;

        if(node === null) 
            return null; 
      
        if(value < node.value){ 
            node.LST = this.RemoveNodeHelper(node.LST, value); 
            return node;
        } 
        else if(value > node.value){ 
            node.RST = this.RemoveNodeHelper(node.RST, value); 
            return node;
        } 
        else{ 
            // Node has no children
            if(node.LST === null && node.RST === null){ 
                console.log("Delete leaf node");
                node.destroyNode();
                node = null; 
                if(original.isRed == false) //If it was red, no validation necessary
                    this.ValidateRemoval(node, original);
                
                return node; 
            } 
      
            // Nodes have one child 
            if(node.LST === null){ 
                node.destroyNode();
                node.RST.parent = node.parent;
                node = node.RST; 
                this.ValidateRemoval(node, original);

                return node; 
            } 
            else if(node.RST === null){ 
                node.destroyNode();
                node.LST.parent = node.parent;
                node = node.LST; 
                this.ValidateRemoval(node, original);

                return node; 
            } 

            //node.destroyNode();
            //Find and replace value
            var newNode = this.FindMinNode(node.RST); 
            node.value = newNode.value; 
            node.makeSprite();

            //Remove duplicate value
            node.RST = this.RemoveNodeHelper(node.RST, newNode.value); 
            return node; 
        } 
        
    }

    RemoveNode(value = this.deleteValue){
        var replacementNode  = this.RemoveNodeHelper(this.root, value);
        //console.log(replacementNode);

        this.UpdateTreePositions(this.root);
        this.DrawEdges(this.root);
        
        //return replacementNode;
    }
}