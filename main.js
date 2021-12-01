const fs = require("fs").promises;
const path = require("path");

//check input length
if(process.argv.length !== 4){
    console.log("Unexpected input");
    console.log("Usage: node tally_json.js json_directory result_file.json");
    process.exit(0);
}

const dirPath = process.argv[2];
const destPath = process.argv[3];


const tallyString = function(obj,tally){
    if(typeof obj === "string"){
        //if it's string count up the tally
        if(!(obj in tally))tally[obj] = 0;
        tally[obj]++;
    }else if(Array.isArray(obj)){
        //if it's array
        obj.map(val=>tallyString(val,tally));
    }else if(typeof obj === "object" && obj !== null){
        //if it's object
        for(let key in obj){
            tallyString(obj[key],tally);
        }
    }
};

fs.readdir(dirPath).then(async (fnames)=>{
    const tally = {};
    //tallying it all up
    console.log(`processing json files in ${dirPath}...`);
    await Promise.all(fnames.map(async (fname)=>{
        const buff = await fs.readFile(path.join(dirPath,fname));
        const txt = buff.toString();
        tallyString(JSON.parse(txt),tally);
    }));
    const resultJSON = JSON.stringify(tally,null,4);
    console.log("result:");
    console.log(resultJSON);
    console.log(`writing the result to ${destPath}`);
    fs.writeFile(destPath,resultJSON+"\n");
});
