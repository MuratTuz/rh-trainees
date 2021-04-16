




// DEPRECIATED........................................


var setObjectProperty = require("./setObjectProperty");

// a*yu one set and one level depth object
const setObjectByTypeName = (objectTree, typeName, typeValue, typeValidations, objectProperties, propertyIndex) => {

    for (let index = 0; index < propertyIndex; index++) {
        if (objectTree[typeName]) {
            setObjectByTypeName(objectTree[typeName], typeName, typeValue, typeValidations, objectProperties, propertyIndex)
        }
    }
    console.log(obj);
    const key = Object.keys(obj);
    if (typeof obj[key[0]] !== 'object') {
        let objTemp = setObjectProperty(typeValue, typeValidations);
        return { [typeName]: objTemp }
    } else {
        // iterates over object 
        let objTemp = setObjectByTypeName(obj[key], typeName, typeValue, typeValidations);
        return { ...obj[key[0]], ...objTemp }
    }


}

module.exports = setObjectByTypeName;