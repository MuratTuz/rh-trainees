
/*
 Node: it keeps every data that will be used
 and convert objects for a tree structure
*/
class Node {
    constructor(name, isArray, path, validations) {
        // every node has a path from the root to itself
        this.path = path;
        // the actual data that this node keeps ex a.*.y.z any of this chars
        this.name = name;
        // this is to help structure rest of the tree,
        // if it set to true then following structure will be an array
        // otherwise an object
        this.isArray = isArray;
        // keeps its own child references in the tree structure
        this.children = [];
        // node leaf validations
        this.validations = validations;
    }

    toString() {
        let obj = {};
        if (this.isArray) {// if they are first array nodes
            obj = {
                "type": "array",
                "validators": [
                    "array"
                ],
                "items": {
                    "type": "object",
                    "validators": [
                        "object"
                    ],
                    "properties": {}
                }
            };
        } else if (!this.children.length) { // if they are last nodes
            obj = {
                "type": "leaf",
                "validators": this.validations
            };
        } else { // if they are NOT last nodes
            obj = {
                "type": "object",
                "validators": [
                    "object"
                ],
                "properties": {}
            };
        }
        return obj;
    }
}

/**
 * Stores entire tree structure using Node objects
 */

class Tree {
    constructor() {
        // root node
        this.tree = new Node('root', 0);
        // on every iteration of the object, new datas are coming in there they will be kept
        this.newItems = [];
        // it holds the index of array marked characters, leter will be usefull when structuring json
        this.arraySignIndexes = [];
    }

    setTree(items, value) {
        let valueDefinedNodes;
        let validations;

         if(value.includes('keys')){
            valueDefinedNodes = value.split('keys:')[1].split(','); //  "object|keys:w,o" --> ['w','o']
            validations = value.split('|')[0]; // validation array of the parent of keyleaf nodes  ex "object|keys:w,o" --> ['object']
            valueDefinedNodes.map(val => {
                const extraItem = `${items}.${val}`;
                this.setItems(extraItem);
                this.addToTree([]);
            })
        }else{
            validations = value.split('|'); //  leaf node validation array  "integer|min:5" --> ['integer', 'min:5']
            this.setItems(items);
            this.addToTree(validations);        
        }

    }

    setItems(items) {
        this.arraySignIndexes = items.split('.')
            .map((a, i) => a == '*' ? i - 1 : null)
            .filter(a => a != null)
            .map((a, i) => a - i); // after removing stars, array featured chars positons are here calculated

        this.newItems = items.split('.').filter(a => a != '*');
    }

    addToTree(validations) {
        for (let a = 0; a < this.newItems.length; a++) {
            const path = this.newItems.slice(0, a + 1).join('.');
            const parentPath = this.newItems.slice(0, a).join('.');
        
            // create a new node
            const newNode = new Node(this.newItems[a], this.arraySignIndexes.includes(a), path, validations);
            // check if path exists
            const exits = this.findNode(path, this.tree);
            // dont proceed if path already exist. And also dont add * to the tree
            if (exits || newNode.name == '*') continue;

            // get parent node
            const node = this.findNode(parentPath, this.tree);

            //check if parent node is already in the tree then add to parent node, if not then add to tree
            if (node) {
                var item = node.children.find(a => a.path == path);
                if (!item)
                    node.children.push(newNode);
            } else {
                this.tree.children.push(newNode);
            }
        }
    }

    generateJson(obj, children) {
        
        for (let i = 0; i < children.length; i++) {

            obj[children[i].name] = children[i].toString();

            if (children[i].children.length) {
                const head = obj[children[i].name].items ?
                    obj[children[i].name].items.properties :
                    obj[children[i].name].properties
                this.generateJson(head, children[i].children);
            }

        }
    }

    form() {
        const obj = {};
        this.generateJson(obj, this.tree.children);
        return obj;
    }

    findNode(path, node) {
        let result = null;
        if (node.path == path) {
            return node;
        } else {
            if (node.children) {
                node.children.some(node => result = this.findNode(path, node));
            }
            return result;
        }
    }
}

const createObjectTree = (requestObject) => {
    const tree = new Tree();

    Object.entries(requestObject).forEach(([key, value]) => {
        tree.setTree(key, value);
    })

    return tree.form();
}

module.exports = createObjectTree;