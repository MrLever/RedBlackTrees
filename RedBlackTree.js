class Node{
    constructor(value){
        this.value = value;
        
        this.parent = undefined;
        this.LST = undefined;
        this.RST = undefined;

        this.isRed = false;
    }
    getUncle(){
        let grandParent = this.getGrandParent();
        if(grandParent == undefined){
            return undefined;
        }

        if(this.parent.getIsLeftChild()){
            return grandParent.RST;
        }
        else{
            return grandParent.LST;
        }
    }
    getIsLeftChild(){
        return this.parent.LST === this;
    }
    getGrandParent(){
        return (this.parent != undefined) ? this.parent.parent : undefined;
    }
    
}
class RedBlackTree{
    constructor(){
        this.root = new Node(undefined);
    }

    InOrderTraversal(root = this.root){
        if(root.LST != undefined){
            this.InOrderTraversal(root.LST);
        }
        console.log(root.value);
        if(root.RST != undefined){
            this.InOrderTraversal(root.RST);
        }
    }

    Recolor(node) {
        console.log("Recolor");
        node.parent.isRed = false;
        node.getUncle.isRed = false;
        node.getGrandParent.isRed = true;
        console.log("Propagate corrections upward");
        this.ValidateInsertion(node.getGrandParent());
    }

    Rotate(){
        console.log("Rotate");

        //LEFT-LEFT Rotation
        //LEFT-RIGHT Rotation
        //RIGHT-LEFT Rotation
        //Right-RIGHT Roation
    }

    ValidateInsertion(node){
        console.log("Validating " + node.value + ":");
        var uncle  = node.getUncle();

        if(node.getGrandParent() == undefined){
            console.log("No grandparent, no op");
            return;
        }

        if(node === this.root){
            node.isRed = false;
            console.log("Root recolored");
            return;
        }
        
        if(uncle == undefined || uncle.isRed == false){
            this.Rotate(node);
            this.Recolor(node);
        }
        else{
            this.Recolor(node);
        }
        
        
    }



    InsertNode(value, root = this.root){
        if(root.value == undefined){ //Only at root
            console.log("Insert at root");
            root.value = value;
            root.isRed = false;

            return;
        }

        if(value < root.value){
            if(root.LST === undefined){ //Insert
                console.log("Insert LST");
                root.LST = new Node(value);
                root.LST.isRed = true;
                root.LST.parent = root;

                this.ValidateInsertion(root.LST);

                return;
            }
            else{ //Move down tree
                console.log("Move down LST");
                this.InsertNode(value, root.LST);
            }
        }
        else{
            if(root.RST === undefined){ //Insert
                console.log("Insert RST");
                root.RST = new Node(value);
                root.RST.isRed = true;
                root.RST.parent = root;

                this.ValidateInsertion(root.RST);

                return;
            }
            else{
                console.log("Move down RST");
                this.InsertNode(value, root.RST);
            }
        }
    }

}