


var setObjectProperty = require("./setObjectProperty");

// a*yu one set and one level depth object
const setObjectByTypeName = (obj, typeName, typeValue, typeValidations) => {
    console.log(obj);
    const key = Object.keys(obj);
    if (typeof obj[key[0]] !== 'object') {
        let objTemp = setObjectProperty(typeValue, typeValidations);
        return { [typeName]: objTemp }
    } else {
        // iterates over object 
        let objTemp = setObjectByTypeName(obj[key], typeName, typeValue, typeValidations);
        return { ...obj[key[0]], objTemp }
    }


}

module.exports = setObjectByTypeName;