class Node{
    constructor(val){
        this.Value = val;
        this.Parent = null;
        this.LST = null;
        this.RST = null;
        this.IsRed = false;
    };
}

class RedBlackTree{
    constructor(){
        this.root = new Node(undefined);
        
        //Private Functions

    }

    //Public Functions
    findUncle(node){
        var grandParent = node.Parent.Parent;
        if(grandParent.LST == node.Parent){
            return grandParent.RST;
        }
        else{
            return grandParent.LST;
        }
    }
    swapNodes(a, b){
        // var temp = new Node();
        // temp.Value = a.Value;
        // temp.LST = a.LST;
        // temp.RST = a.RST;
        // temp.Parent = a.Parent;
        // temp.IsRed = a.IsRed;

        // a.Value = b.Value;
        // a.LST = b.LST;
        // a.RST = b.RST;
        // a.Parent = b.Parent;
        // a.IsRed = b.IsRed;

        // b.Value = temp.Value;
        // b.LST = temp.LST;
        // b.RST = temp.RST;
        // b.Parent = temp.Parent;
        // b.IsRed = temp.IsRed;

        console.log("In swap: " + a.Value, b.Value);
    }
    ValidateTreeInsertion(node){
        if(node == this.root){
            node.IsRed = false;
            return;
        }
        if(node.Parent.IsRed == true){
            var uncle = this.findUncle(node);
            if(uncle.IsRed){ //Recolor tree
                console.log("Recolor Tree");
                uncle.IsRed == false;
                node.Parent.IsRed == false;
                node.Parent.Parent.IsRed = true;
                
                //Percolate adjustments upwards
                this.ValidateTreeInsertion(node.Parent.Parent);
                return;
            }
            else{ //Rotate tree
                console.log("Rotate Tree");
                var grandParent = node.Parent.Parent;
                var parent = node.Parent;
                var uncle = this.findUncle(node);
                var t1;
                var t2;
                var t3;
                var t4;
                var t5;

                if(grandParent.LST == parent){
                    if(parent.LST == node){
                        console.log("Left-Left rotation from: " + node.Value);
                        t1 = node.LST;
                        t2 = node.RST;
                        t3 = parent.RST;
                        t4 = uncle.LST;
                        t5 = uncle.RST;
                        
                        //Make a new copy because Javascript is garbage.
                        var temp = new Node();
                        temp.Value = grandParent.Value;
                        temp.LST = grandParent.LST;
                        temp.RST = grandParent.RST;
                        temp.Parent = grandParent.Parent;
                        temp.IsRed = grandParent.IsRed;


                        var newGrandparent = node.Parent.Parent;
                        console.log("Before Swap: " + newGrandparent.Value + " " +  parent.Value)
                        this.swapNodes(newGrandparent, parent)
                        console.log("After Swap: " + newGrandparent.Value + " " +  parent.Value)


                        //console.log("New GP: " + node.Parent.Parent.Value);
                        // var newGrandparent = parent;
                        // newGrandparent.LST = node;
                        // newGrandparent.RST = grandParent;
                        // newGrandparent.RST.LST = t3;
                        // newGrandparent.RST.RST = uncle;
                        // newGrandparent.RST.RST.LST = t4;
                        // newGrandparent.RST.RST.RST = t5;

                        // grandParent = newGrandparent;

                    }
                    else{
                        console.log("Left-right rotation");
                    }
                }
                else{
                    if(parent.LST == node){
                        console.log("Right-left rotation");
                    }
                    else{
                        console.log("Right-Right rotation");
                    }
                }
            }
        }
        else{
            //console.log("Insertion Invalid");
        }
    }
    InsertNode(value, parent = undefined, root = this.root){
        if(root == this.root && root.Value == undefined) {
            root.Value = value;
            root.IsRed == false;
            root.Parent = undefined;
            root.LST = new Node(undefined);
            root.RST = new Node(undefined);
            return;
        }


        if(root.Value == undefined){
            root.Value = value;
            root.IsRed = true;
            root.Parent = parent;
            root.LST = new Node(undefined);
            root.RST = new Node(undefined);


            this.ValidateTreeInsertion(root);
            return;
        }

        else if(value < root.Value){
            this.InsertNode(value, root, root.LST);
        }
        else{
            this.InsertNode(value, root, root.RST);
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
