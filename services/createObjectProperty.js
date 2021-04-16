


var defineObjectProperties = require("./defineObjectProperties");
var setObjectProperty = require("./setObjectProperty");

const createObjectProperty = (objectTree, objectProperties, objectTypes, currentIndex) => {
     
    const { typeName, typeValue, typeValidations, keyProperties } =
    defineObjectProperties(objectProperties, objectTypes, currentIndex);

    //console.log(objectTree, objectProperties, objectTypes, currentIndex, typeValue);
    
    if (objectProperties[currentIndex + 1]) {
       // console.log(currentIndex);

        if (objectTree[typeName]) {
            let objTemp = createObjectProperty(objectTree[typeName], objectProperties, objectTypes, ++currentIndex);
            console.log('popopopopop', currentIndex);
            if(currentIndex === objectProperties.length -1){
                
                return {  ...objectTree[typeName], properties:{...objectTree[typeName].properties, objTemp} }
            }else{
                return {...objectTree, ...objTemp};
            }

        } else {
            let objElement = setObjectProperty(typeValue, typeValidations);
            objectTree[typeName] = {[typeName]: objElement};
            let objTemp = createObjectProperty(objectTree[typeName], objectProperties, objectTypes, ++currentIndex);
            
            
            //obj.properties = objProperties;console.log(obj);
            if (typeValue === 'object') {
                console.log(currentIndex, {  ...objectTree[typeName], properties:objTemp });
                return {  ...objectTree[typeName], properties:objTemp }
            } else {
                console.log('currentIndex', {  ...objectTree[typeName], ...objTemp });
                return {  ...objectTree[typeName], ...objTemp }
            }

        }
        
    } else {
        let objTemp = setObjectProperty(typeValue, typeValidations); 
        console.log(currentIndex, { [typeName]: objTemp });
        return { [typeName]: objTemp }
    }
    
}

module.exports = createObjectProperty;