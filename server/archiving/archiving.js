const fs = require("node:fs");
const Path = require("path");
//const key='qwerty';
// let word = "человек";
// let word1 = "прокрастинация";
// const alphabetMapping = {
//     'а': 1,  'б': 2,  'в': 3,  'г': 4,  'д': 5,  'е': 6,  'ё': 7,
//     'ж': 8,  'з': 9,  'и': 10, 'й': 11, 'к': 12, 'л': 13, 'м': 14,
//     'н': 15, 'о': 16, 'п': 17, 'р': 18, 'с': 19, 'т': 20, 'у': 21,
//     'ф': 22, 'х': 23, 'ц': 24, 'ч': 25, 'ш': 26, 'щ': 27, 'ъ': 28,
//     'ы': 29, 'ь': 30, 'э': 31, 'ю': 32, 'я': 33, ' ': 34
// };
const alphabetLength=65535;

class Node{
    constructor(node, code){
        this.node = node;
        this.left=null;
        this.right=null;
        this.code=code;
    }
}

const encoding = (object, fileName)=>{
    let keyPath=Path.join(__dirname, '..','archives', 'key.txt');
    let encodedKey= readTextFile(keyPath);
    let keyCodesPath=Path.join(__dirname, '..','archives', 'key_codes.json');
    let keyCodes=readJsonFile(keyCodesPath);
    let key = ShannonFanoDecode(encodedKey,keyCodes);
    let text = JSON.stringify(object);
    //text='человек';
    // console.log('input:');
    // console.log(text);
    let map=countFrequencies(text.split(''));
    let root=new Node(map, '');
    let codes={};
    treeTraversal(root, codes);

    let  codesInfo = JSON.stringify(codes);
    let encodedText=offsetEncode(codesInfo+'  '+ShannonFanoEncode(text,codes), key);
    // console.log('output:');
    // console.log(encodedText);
    let encodedTextPath=Path.join(__dirname, '..', 'archives', fileName+'.txt');
    fs.writeFileSync(encodedTextPath, encodedText);
};

const countFrequencies=(chars)=>{
    let frequencies={};
    for(let i=0;i<chars.length;i++){
        frequencies[chars[i]]=(frequencies[chars[i]]+1)||1;
    }
    let map=[];
    for (const [key, value] of Object.entries(frequencies)) {
        map.push([key, value]);
    }
    map.sort((a,b)=>{return b[1]-a[1]});
    return map;
}

const encodeKey=(key)=>{
    let map=countFrequencies(key.split(""));
    let root=new Node(map, '');
    treeTraversal(root);

    const codesInfo = JSON.stringify(codes, null, 2);
    let codesPath=Path.join(__dirname, '..', 'archives', 'key_codes.json');
    fs.writeFileSync(codesPath, codesInfo);
    let encodedText=ShannonFanoEncode(key);
    let encodedTextPath=Path.join(__dirname, '..', 'archives', 'key.txt');
    fs.writeFileSync(encodedTextPath, encodedText);
}

const readJsonFile = (filename) => {
    const data = fs.readFileSync(filename, 'utf8');
    return JSON.parse(data);
};

const readTextFile = (filename) => {
    return fs.readFileSync(filename, 'utf8');
};

const decoding=(fileName)=>{

    let keyPath=Path.join(__dirname, '..','archives', 'key.txt');
    let encodedKey= readTextFile(keyPath);
    let keyCodesPath=Path.join(__dirname, '..','archives', 'key_codes.json');
    let keyCodes=readJsonFile(keyCodesPath);
    let key = ShannonFanoDecode(encodedKey,keyCodes);

    let encodedTextPath=Path.join(__dirname, '..', 'archives', fileName+'.txt');
    let encodedText=readTextFile(encodedTextPath);
    //console.log('input:');
    //console.log(encodedText);
    let decodedText=offsetDecode(encodedText, key);
    //console.log(decodedText.split('  ').length);
    let codes=JSON.parse(decodedText.split('  ')[0]);
    decodedText=decodedText.split('  ').slice(1).join('  ');
    //console.log(decodedText);
    //console.log(codes);
    let numOfBits=+decodedText[0];
    decodedText=decodedText.slice(1);
    //console.log(decodedText);
    let binaryText='';
    for(let i=0;i<decodedText.length;i++){
        let charCode = decodedText.charCodeAt(i);
        binaryText += charCode.toString(2).padStart(8, '0');
    }
    binaryText=binaryText.substring(0,binaryText.length-numOfBits);
    //console.log(binaryText);
    //console.log(JSON.parse(ShannonFanoDecode(binaryText, codes)));
    //console.log('output:');
    //console.log(ShannonFanoDecode(binaryText, codes));
    return JSON.parse(ShannonFanoDecode(binaryText, codes));
}

const foundMid = (arr)=>{
    let diffs=[];
    for(let i=0;i<arr.length;i++){
        diffs.push(Math.abs(arr.slice(0,i).reduce((a,b)=>{return a+b[1];},0)-arr.slice(i).reduce((a,b)=>{return a+b[1];},0)));
    }
    return diffs.indexOf(Math.min(...diffs));
};

const treeTraversal=(node, codes)=>{
    if(node.node.length!==1){
        let branches=divideArr(node.node);
        node.left=new Node(branches[0], node.code+'0');
        node.right=new Node(branches[1],node.code+'1');

        treeTraversal(node.left, codes);
        treeTraversal(node.right, codes);
    }
    else{
        codes[node.node.flat()[0]]=node.code;
    }
}

const divideArr=(arr)=>{
  let index=foundMid(arr);
  return [arr.slice(0,index),arr.slice(index)];
};

const ShannonFanoEncode = (text, codes)=>{
    text=text.split('');
    let encodedText='';
    for(let i=0;i<text.length;i++){
        encodedText+=codes[text[i]];
    }
    //console.log(encodedText);
    let numOfBits=8-encodedText.length%8
    encodedText+='0'.repeat(numOfBits);
    let bytes=[];
    for(let i=0;i<encodedText.length/8;i++){
        bytes.push(encodedText.slice(8*i,8*(i+1)));
    }
    encodedText=bytes.map(byte=>{
        return String.fromCharCode(parseInt(byte, 2));
    });
    encodedText.unshift(numOfBits.toString());
    encodedText=encodedText.join('');
    return encodedText;
};

const ShannonFanoDecode = (text, codes)=>{
    let root=new Node(null, '');
    let keys=Object.keys(codes);
    for(let i=0;i<keys.length;i++){
        let path=codes[keys[i]].split('');
        let currentNode=root;
        for(let j=0;j<path.length;j++){
            if(path[j]==='1'){
                if(!currentNode.right){
                    currentNode.right=new Node(null, currentNode.code+'1');
                }
                currentNode=currentNode.right;
            }
            else{
                if(!currentNode.left){
                    currentNode.left=new Node(null, currentNode.code+'0');
                }
                currentNode=currentNode.left;
            }
        }
        currentNode.node=keys[i];
    }
    let decodedText='';
    let currentNode=root;
    text=text.split('');
    for(let i=0;i<text.length;i++){
        if(text[i]==='1'){
            currentNode=currentNode.right;
        }
        else{
            currentNode=currentNode.left;
        }
        if(currentNode.node!=null){
            decodedText+=currentNode.node;
            currentNode=root;
        }
    }
    //console.log(decodedText);
    return decodedText;
};

const tree=(root)=>{
    if(root.node)console.log(`${root.node} - ${root.code}`);
    if(root.left)tree(root.left);
    if(root.right)tree(root.right);

}

const offsetEncode = (text, key)=>{
    let encodedText='';
    for(let i=0;i<text.length;i++){
        let charCode=text.charCodeAt(i)+key.charCodeAt(i%key.length);
        charCode=charCode>alphabetLength?charCode%alphabetLength:charCode;
        encodedText+=String.fromCharCode(charCode);
    }
    return encodedText;
};

const offsetDecode = (text, key)=>{
    let decodedText='';
    for(let i=0;i<text.length;i++){
        let charCode=text.charCodeAt(i)-key.charCodeAt(i%key.length);
        charCode=charCode<0?charCode+alphabetLength:charCode;
        decodedText+=String.fromCharCode(charCode);
    }
    return decodedText;
};

// russian alphabet 34 symbols
// const offsetEncode=(text)=>{
//   let encodedText='';
//   for(let i=0;i<text.length;i++){
//       let charCode=alphabetMapping[text[i]]+alphabetMapping[key[i%key.length]];
//       charCode=charCode>34? charCode%34:charCode;
//       encodedText+=Object.entries(alphabetMapping).find(([key, value]) => value === charCode)?.[0];
//   }
//   return encodedText;
// };
//
// const offsetDecode = (text)=>{
//     let decodedText='';
//     for(let i=0;i<text.length;i++){
//         let charCode=alphabetMapping[text[i]]-alphabetMapping[key[i%key.length]];
//         charCode=charCode<0?charCode+34:charCode;
//         decodedText+=Object.entries(alphabetMapping).find(([key, value]) => value === charCode)?.[0];
//     }
//     return decodedText;
// }


module.exports = {decoding, encoding};