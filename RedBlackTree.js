class Node{
    constructor(value){
        this.value = value;
        
        this.parent = null;
        this.LST = null;
        this.RST = null;

        this.level = 1;

        //RB-Specific
        this.isRed = false;

        //Rendering
        
        this.x = -10;
        this.y = 10;

        this.geometry = new THREE.SphereGeometry(this.radius, 12, 4);
        this.material = nodeShader.clone();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.translateX(-10);
        this.mesh.translateY(10);
        scene.add(this.mesh);
    }

    setPosition(targetX, targetY){
        var target = new THREE.Vector3(targetX,targetY,0);
        console.log("Targeting " + target.x + ", " + target.y);
        animateNode(this.mesh, target);


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

    refreshColor(){
        if(this.isRed){
            this.mesh.material.uniforms.materialColor.value = new THREE.Vector3(.8,0,0);
        }
        else{
            this.mesh.material.uniforms.materialColor.value = new THREE.Vector3(.2,.2,.2);
        }
    }

    destroyNode(){
        console.log("Destroy node: " + this.value);
        scene.remove(scene.getObjectById(this.mesh.id));
    }

}

class BinaryTree{
    constructor(){
        this.root = null;
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
    InsertNode(value){
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

    RemoveNodeHelper(node, value){ 
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
                node.destroyNode();
                node = null; 
                return node; 
            } 
      
            // Nodes have one child 
            if(node.LST === null){ 
                node.destroyNode();
                node.RST.parent = node.parent;
                node = node.RST; 
                return node; 
            } 
            else if(node.RST === null){ 
                node.destroyNode();
                node.LST.parent = node.parent;
                node = node.LST; 
                return node; 
            } 

            node.destroyNode();
            //Find and replace value
            var newNode = this.FindMinNode(node.RST); 
            node.value = newNode.value; 

            //Remove duplicate value
            node.RST = this.RemoveNodeHelper(node.RST, newNode.value); 
            
            return node; 
        } 
      
    }

    RemoveNode(value){
        var removedNode = this.root = this.RemoveNodeHelper(this.root, value);
        
        if(removedNode != null)
            this.UpdateTreePositions(this.root);
    }

    UpdateTreePositions(root){
        if(root === null){
            return;
        }
        if(root.parent === null){
            root.setPosition(0,0);
        }
        else{
            if(root.isLST() == true){
                root.setPosition(root.parent.x - 5, root.parent.y - 5);
            }
            else{
                root.setPosition(root.parent.x + 5, root.parent.y - 5);
            }
        }

        this.UpdateTreePositions(root.LST);
        this.UpdateTreePositions(root.RST);

    }
}

class RedBlackTree extends BinaryTree{
    LeftLeftRotation(node){
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
        grandparent.RST = uncle;
        grandparent.isRed = true;
        grandparent.refreshColor();

        if(uncle != null){
            uncle.parent = grandparent;
            uncle.LST = t3;
            uncle.RST = t4;
            uncle.isRed = false;
        }
        
        this.UpdateTreePositions(this.root);
        
        //console.log(this);
    }
    LeftRightRotation(node){
        var parent = node.parent;
        var grandparent = node.parent.parent;

        var t1 = node.parent.LST;
        var t2 = node.LST;
        var t3 = node.RST;
        
        grandparent.LST = node;
        node.parent = grandparent;
        node.LST = parent;
        node.RST = t3;
        parent.parent = node;
        parent.LST = t1;
        parent.RST = t2;

        this.UpdateTreePositions(this.root);
        
        //console.log(this);

        //Left Left rotatre from parent
        this.LeftLeftRotation(parent);

    }
    RightRightRotation(node){
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
        grandparent.isRed = true;
        grandparent.refreshColor();

        if(uncle != null){
            uncle.parent = grandparent;
            uncle.LST = t1;
            uncle.RST = t2;
            uncle.isRed = false;
        }
        
        this.UpdateTreePositions(this.root);
    }

    RightLeftRotation(node){
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
        if(node === this.root){ //Color root black
            node.isRed = false;
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
            uncle.isRed = false;
            parent.isRed = false;

            parent.refreshColor()
            uncle.refreshColor();

            this.ValidateInsertion(grandparent);
        }
        else{ //Black uncle
            
            //LEFT LEFT CASE
            if(node.isLST() === true && node.parent.isLST() === true){
                this.LeftLeftRotation(node);               
            }

            //LEFT RIGHT CASE
            if(node.isLST() === false && node.parent.isLST() === true){
                this.LeftRightRotation(node);
            }

            //RIGHT RIGHT CASE
            if(node.isLST() === false && node.parent.isLST() === false){
                this.RightRightRotation(node);
            }

            //RIGHT LEFT CASE
            if(node.isLST() === true && node.parent.isLST() === false){
                this.RightLeftRotation(node);
            }

        }

    }

    InsertNode(value){
        var node = super.InsertNode(value);
        //console.log(node);
        this.ValidateInsertion(node);
        
    }
    RemoveNode(value){
        super.RemoveNode(value);
        console.log("RBREMOVE");
    }
}