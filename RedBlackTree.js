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
        this.root = null;
    }
    
    InsertNode(value){
        var node = new Node(value);
        if(root == null){
            root = node;
            node.IsRed = false;
        }
    }

    DeleteNode(root, target){
        if(root == null){
            return;
        }
        if (root == target){
            //Clean up display
            //Set node to null
            return;
        }

        if(target < root.Value){
            DeleteNode(root.LST, target);
        }
        else{
            DeleteNode(root.RST, target);
        }
    }
    FindNode(root, target){
        if(root == null){
            return false;
        }
        if (root == target){
            //Clean up display
            //Set node to null
            return true;
        }

        if(target < root.Value){
            return FindNode(root.LST, target);
        }
        else{
            return FindeNode(root.RST, target);
        }
    }
}
