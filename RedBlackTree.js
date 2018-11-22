class Node{
    constructor(val){
        this.Value = val;
        this.LST = null;
        this.RST = null;
        this.IsRed = true;
    };
}

class RedBlackTree{
    constructor(){
        this.root = new Node(undefined);
        
        //Private Functions

    }

    //Public Functions
    ValidateTree(){
            
    }

    InsertNode(value, root = this.root){
        //console.log(root);
        if(root.Value == undefined){
            root.Value = value;
            root.IsRed = false;
            
            root.LST = new Node(undefined);
            root.RST = new Node(undefined);

            return; 
        }
        if(value < root.Value){
            this.InsertNode(value, root.LST);
        }
        else{
            this.InsertNode(value, root.RST);
        }
    }

    DeleteNode(value, root = this.root){
        if(root == null){
            return;
        }
        if (root == target){
            //Clean up display
            root == null;
            return;
        }

        if(target < root.Value){
            DeleteNode(target, root.LST);
        }
        else{
            DeleteNode(target, root.RST);
        }
    }

    FindNode(target, root = this.root){
        if(root == null || root.Value == undefined){
            return false;
        }
        if (root.Value == target){
            //Clean up display
            //Set node to null
            return true;
        }

        if(target < root.Value){
            return this.FindNode(target, root.LST);
        }
        else{
            return this.FindNode(target, root.RST);
        }
    }

    Print(root = this.root){
        if(root.Value == undefined){
            return;
        }

        this.Print(root.LST);
        console.log(root.Value + " ");
        this.Print(root.RST);

        return;
    }
}
