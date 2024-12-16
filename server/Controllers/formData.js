const {promises: fs} = require("fs");
const {decoding} = require("../archiving/archiving");

async function readData(fileName) {
    try {
        const data = await fs.readFile('./Stores/'+fileName+'.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading or parsing file:', error);
        throw error;
    }
}

const formData = async (data) => {
    const regex=/\$\{([^}]+)\}/;
    let resume;
    do{
        resume=false;
        for(let i=0;i<data.length;i++){
            let originalObjectKeys=Object.keys(data[i]);
            for(let j=0;j<originalObjectKeys.length;j++){
                if(regex.test(data[i][originalObjectKeys[j]])){
                    //console.log(data[i][originalObjectKeys[j]]);
                    resume=true;
                    let match=data[i][originalObjectKeys[j]].match(regex)[1];
                    match=match.split('_');
                    let fileName=match[0];
                    let id=match[1];
                    let neededKey=match[2];
                    let receivedData=decoding(fileName);
                    let receivedKeys=Object.keys(receivedData);
                    for(let l=0;l<receivedKeys.length;l++){
                        if(typeof(receivedData[receivedKeys[l]])=='object'){
                            let foundValue=receivedData[receivedKeys[l]].find(value=>{
                                return value.id==id;
                            });
                            let keys=Object.keys(foundValue);
                            for(let m=0;m<keys.length;m++){
                                if(keys[m]==neededKey){
                                    data[i][originalObjectKeys[j]]=foundValue[keys[m]];
                                }
                            }
                        }
                    }
                }
            }
            //console.log(data);
        }
    }while(resume);
    return data;
};

module.exports = formData;


// const formData = async (data) => {
//     const regex=/\$\{([^}]+)\}/;
//     let resume=false;
//     do{
//         resume=false;
//         for(let i=0;i<data.length;i++){
//             let originalObjectKeys=Object.keys(data[i]);
//             for(let j=0;j<originalObjectKeys.length;j++){
//                 if(regex.test(data[i][originalObjectKeys[j]])){
//                     resume=true;
//                     console.log(data[i]);//{}
//                     console.log(originalObjectKeys[j]);//groupId
//                     console.log(data[i][originalObjectKeys[j]]);//${}
//                     let match=data[i][originalObjectKeys[j]].match(regex)[1];
//                     console.log(match);//groups_1
//                     match=match.split('_');
//                     let fileName=match[0];
//                     let id=match[1];
//                     let receivedData=await readData(fileName);
//                     console.log(receivedData);
//                     let receivedKeys=Object.keys(receivedData);
//                     for(let l=0;l<receivedKeys.length;l++){
//                         if(typeof(receivedData[receivedKeys[l]])=='object'){
//                             let foundValue=receivedData[receivedKeys[l]].find(value=>{
//                                 console.log(value.id);
//                                 console.log(id);
//                                 return value.id==id;
//                             });
//                             console.log(foundValue);
//
//                             let keys=Object.keys(foundValue);
//                             for(let m=0;m<keys.length;m++){
//                                 if(keys[m]=='id')continue;
//                                 console.log(keys[m]);
//                                 data[i][fileName+keys[m]]=foundValue[keys[m]];
//                                 data[i][originalObjectKeys[j]]=undefined;
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }
//     while(resume)
//
//     console.log(data);
//     return data;
// };

