
const defineObjectProperties = (objectProperties, objectTypes, index) => {

    let typeName = '';
    let typeValue = objectTypes[0];
    let typeValidations = [];
    let keyProperties = [];

    objectTypes.map(element => {
        if (element.includes('keys')) {
            let str = element.split('keys:')[1].split(',');
            keyProperties = str;
        } else {
            typeValidations.push(element);
        }
    });

    if ( index === 0 || index < objectProperties.length-1) {
        typeValue = 'object';
        typeValidations = ['object'];
        if (objectProperties[index + 1] === '*') {
            typeValue = 'array';
            typeValidations = ['array'];
        }
    } else {
        typeValue = 'leaf';
    }

    if (objectProperties[index] === '*') {
        typeName = 'items';
    } else {
        typeName = objectProperties[index];
    }


    return { typeName, typeValue, typeValidations, keyProperties }
}


module.exports = defineObjectProperties;