/*
var createObjectProperty = require("./createObjectProperty");


const createObjectTree = (requestObject) => {

    var objectTree = {};

    // e.g. key='a.*.y.t',  value='integer'
    Object.entries(requestObject).map(([key, value]) => {

        // turns 'a.*.y.t' into ['a','*','y','t']
        let objectProperties = key.split('.');

        // turns 'object|keys:w,o' into ['object', 'keys:w,o']
        let objectTypes = value.split('|');
        //console.log(objectTree);
        objectTree = createObjectProperty(objectTree, objectProperties, objectTypes, 0);

    });
    //console.log(objectTree);
    return objectTree;

}

module.exports = createObjectTree;
*/
// file: createObjectTree.js 16.04.2021

const createObjectProperty = require("./createObjectProperty");

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
        if (this.isArray) {
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
        } else if (!this.isArray && !this.children.length) {
            obj = {
                "type": "leaf",
                "validators": this.validations ? this.validations : []
            };
        } else {
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

class Tree {
    constructor() {
        // root node
        this.tree = new Node('root', 0);
        // on every iteration of the object new datas are coming in there they will be kept
        this.newItems = [];
        // it holds the index of array marked characters, leter will be usefull when structuring json
        this.arraySignIndexes = [];
    }

    setTree(items, value) {
        if(value.includes('keys')){
            const valueDefinedNodes = value.split('keys:')[1].split(','); //  "object|keys:w,o" --> ['w','o']
            const validations = value.split('|')[0]; // node leaf validation array  "object|keys:w,o" --> ['object']
        }else{
            const valueDefinedNodes = null;
            const validations = value.split('|'); // node leaf validation array  "integer|min:5" --> ['integer', 'min:5']
        }

        console.log('validations', validations);
        if (valueDefinedNodes) {
            valueDefinedNodes.map(val => {
                const extraItems = `${items}.${val}`;
                this.setItems(extraItems);
                this.addToTree(validations);
            })
        } else {
            this.setItems(items);
            this.addToTree(validations);
        }
    }

    setItems(items) {
        this.arraySignIndexes = items.split('.')
            .map((a, i) => a == '*' ? i - 1 : null)
            .filter(a => a != null)
            .map((a, i) => a - i); // after removing stars, array featured chars positons are here calculated

        console.log(items, this.arraySignIndexes);
        this.newItems = items.split('.').filter(a => a != '*');
    }

    addToTree(validations) {
        for (let a = 0; a < this.newItems.length; a++) {
            const path = this.newItems.slice(0, a + 1).join('.');
            const parentPath = this.newItems.slice(0, a).join('.');

            // create a new node
/*             if (a == this.newItems.length - 1) {
                const newNode = new Node(this.newItems[a], this.arraySignIndexes.includes(a), path, validations);
            } else {
                const newNode = new Node(this.newItems[a], this.arraySignIndexes.includes(a), path, null);
            } */
            const newNode = new Node(this.newItems[a], this.arraySignIndexes.includes(a), path, null);
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
        console.log(obj, children.length);
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