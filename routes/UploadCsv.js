const express = require("express");

const router = express.Router();

const fs  = require('fs');
const csv = require("@fast-csv/parse");
const multer = require('multer')
const path = require('path')



//! Use of Multer
const storage = multer.diskStorage({
    
    destination: (req, file, callBack) => {
        callBack(null, '../uploads')    
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
const uploadCsvFile = multer({ storage: storage,onError :function(err,next){
    console.log('Have Multer Error')
    console.log(err)
    next(err)
} });



function readCsv(path, options, rowProcessor) {
    return new Promise((resolve, reject) => {
      const data = [];
      csv
        .parseFile(path, options)
        .on("error", reject)
        .on("data", (row) => {
          const obj = rowProcessor(row);
          if (obj) data.push(obj);
        })
        .on("end", () => {
          resolve(data);
        });
    });
  }
  
  // 
  router.post('/save_school_list',uploadCsvFile.single('school_file'), async function(req,res,next){
    // csvToDb(__dirname + '/public/csv/' + req.file.filename)
    // res.send({status:true,msg:"Working",file:req.file})
    console.log(req.file)
    res.send({status:'Here wew are'});return;
    let filePath        = './public/csv/' + req.file.filename;
    const csvDataResult = await readCsv(filePath,{ skipRows: 1 },(row) => ({ schoolName: row[0]}));
  
       
    let csvData         = [];
    let ALreadyInDb     = [];
    let InsertArr       = [];
  
    for (let index = 0; index < csvDataResult.length; index++) {
        const element = csvDataResult[index].schoolName;
        csvData.push(element);
    }
  
    let Names       = '';
    for (let index = 0; index < csvData.length; index++) {
        const element = csvData[index];   
        Names += '"'+element+'"';
        if((index+1)<csvData.length){
            Names += ',';
        }
    }
    let selectSql   = `SELECT schoolName FROM school WHERE schoolName IN ( ${Names} )`;
  
    const [selectedResult,Selectedmetadata] = await con.query(selectSql)
  
    if(selectedResult.length > 0){
        // console.log(selectedResult);
        for (let index = 0; index < selectedResult.length; index++) {
            const ALreadyUsedschoolName = selectedResult[index].schoolName;
            ALreadyInDb.push(ALreadyUsedschoolName);
        }
    }   
  
  
    // create final Insert Array
    for (let index = 0; index < csvData.length; index++) {
        const element = csvData[index];
        if(!ALreadyInDb.includes(element)){
            InsertArr.push(element)
        }
    }
  
    
  
  
    if(InsertArr.length > 0){
  
        let sql = `INSERT INTO school (schoolName) values ? `;
        const [result,metadata] = await con.query(sql,{replacements:[InsertArr]})
  
    }
  
  
    fs.unlinkSync(filePath)
    res.send({status:true,msg:'FIle Saved SuccessFUlly',insertList:InsertArr,ALreadyInDb:ALreadyInDb})
  
  
  })
module.exports = router;
  