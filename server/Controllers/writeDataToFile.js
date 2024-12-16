const fs = require('fs');

const baseUrl= "http://localhost:5000/Static";

const writeObject=(object, text, isArray=false)=>{
    let keys=Object.keys(object);
    for(let i=0;i<keys.length;i++){
        if(Array.isArray(object[keys[i]])){
            text+=keys[i]+':\n';
            for(let j=0;j<object[keys[i]].length;j++){
                text=writeObject(object[keys[i]][j], text, true);
            }
        }
        else if(typeof(object[keys[i]])=='object' && object[keys[i]]!=null){
            if(!isArray)text+=keys[i]+':\n';
            text=writeObject(object[keys[i]], text);
        }
        else text+=`${keys[i]}: ${object[keys[i]]}\n`;
    }
    return text;
};

const writeToFile = (fileName, record)=>{
    let text='';
    text=writeObject(record, text);
    let path='Static\\'+fileName+'.txt';
    fs.writeFileSync(path, text);
    return fileName+'.txt';
};

module.exports = writeToFile;