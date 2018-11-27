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
        this.x = 0;
        this.y = 0;
        this.geometry = new THREE.SphereGeometry(this.radius, 32, 32);
        this.material = nodeShader.clone();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        
        this.setPosition(0, 0);

        scene.add(this.mesh);
    }

    setPosition(x, y){
        this.x = x; 
        this.y = y;

        this.mesh.translateX(x);
        this.mesh.translateY(y);

    }
    
    isLST(){
        if(this.parent != undefined){
            return this.parent.LST == this;
        }
        else return false;
    }

    refreshColor(){
        if(this.isRed){
            this.mesh.material.uniforms.materialColor.value = new THREE.Vector3(.8,0,0);
        }
        else{
            this.mesh.material.uniforms.materialColor.value = new THREE.Vector3(.2,.2,.2);
        }
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
               node.setPosition(root.x + 5, root.y - 5);
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

        }
        else {
            node.isRed = true;
            this.InsertNodeHelper(this.root, node);
        }
    }
}

class RedBlackTree extends BinaryTree{

}