

var createObjectProperty = require("./createObjectProperty");


const createObjectTree = (requestObject) => {

    var objectTree = {};

    // e.g. key='a.*.y.t',  value='integer'
    Object.entries(requestObject).map(([key, value]) => {

        // turns 'a.*.y.t' into ['a','*','y','t']
        let objectProperties = key.split('.');

        // turns 'object|keys:w,o' into ['object', 'keys:w,o']
        let objectTypes = value.split('|');

        const objTemp = createObjectProperty(objectProperties, objectTypes);
        console.log('object ', objTemp);
        objectTree = { ...objectTree, objTemp }

    });

    return objectTree;

}

module.exports = createObjectTree;