


var setObjectProperty = require("./setObjectProperty");

// a*yu one set and one level depth object
const setObjectByTypeName = (obj, typeName, typeValue, typeValidations) => {
    console.log(obj);
    if (Object.keys(obj).length === 0) {
        console.log('hii');
        let objTemp = setObjectProperty(typeValue, typeValidations);
        return { [typeName]: objTemp }
    } else {
        // iterates over object keys
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                let objTemp = setObjectByTypeName(obj[i], typeName, typeValue, typeValidations);
                return { ...obj[i], objTemp };
            }
        }

    }
}

module.exports = setObjectByTypeName;