


var defineObjectProperties = require("./defineObjectProperties");
var setObjectByTypeName = require("./setObjectByTypeName");

const createObjectProperty = (objectProperties, objectTypes) => {

    let object = {};
    let propertyNumber = objectProperties.length;
    //console.log(propertyNumber);
    for (let i = 0; i < propertyNumber; i++) {
        const { typeName, typeValue, typeValidations, keyProperties } = defineObjectProperties(objectProperties, objectTypes, i);
        console.log(typeName, typeValue, typeValidations, keyProperties);

        object = setObjectByTypeName(object, typeName, typeValue, typeValidations)

        if ((i === propertyNumber - 1) && keyProperties) {
            for (const key of keyProperties) {
                object = setObjectByTypeName(object, key, 'leaf', []);
            }

        }

    }

    return object; //immutable

}

module.exports = createObjectProperty;