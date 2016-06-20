var unixTime = require('unix-time');
var Data = require('../models/data'); //Data Model not used in current version
var Sensor = require('../models/sensors');

var dataAvg ={}; //data avg object {objId1:{data:data,timeStamp:timeStamp,counter:counter},objId2:{data: data,timeStamp:timeStamp,counter}..}
var MIN_FLOATING_AVG_TIME = 1800*1000 //ms >> 30 min


var helpers = {
calcFloatingAvg: calcFloatingAvg,
currentUnixTime: currentUnixTime
};


function calcFloatingAvg(objId,sample){
  //check if it exist an already cached sample of this sensor/device
  //if not create new entry
  if (dataAvg.hasOwnProperty(objId) === false){
    dataAvg[objId] = sample; //cache sample and map to objId
    dataAvg[objId].counter = 1; // set counter to 0
    dataAvg[objId].timeStamp = currentUnixTime(); //time stamp first stored sample
    return;
  } //objId already exist in cache, check if its its time to save average to db
  else if (currentUnixTime() >= dataAvg[objId].timeStamp + MIN_FLOATING_AVG_TIME){
    console.log("save to db");
    dataAvg[objId] = average(dataAvg[objId], sample); //get new average
    saveToDb(dataAvg[objId],objId,sample); //save average to db
    console.log("start over");
    delete dataAvg[objId]; //start a new floating avg for objId by deleting prop objId
    return;
  } else {
        dataAvg[objId] = average(dataAvg[objId], sample); //get new average
        //console.log("only calculate new average",dataAvg[objId].timeStamp + MIN_FLOATING_AVG_TIME, currentUnixTime() );
       return;
  }
};

function currentUnixTime(){
  return 1000*unixTime(new Date()); //convert to unixTime
};

var average = function(avg,data){
//console.log("average",avg, "new sample",data);
  for (var key in data.data){
    //moving average FAVGn = (n*FAVGn + SN+1)/(n+1)
    avg.data[key] = (avg.data[key]*avg.counter + data.data[key])/(avg.counter + 1);
  }
  avg.counter++;//increment sample counter
  //console.log("avg",avg)
  return avg;
}

var saveToDb = function(data,id,sample){
  delete data.counter;
  delete data.timeStamp;
  console.log("save to db", data, id);
  Sensor.findByIdAndUpdate(id, {$push: {data:data}}, function(err,resp){
        if (err) console.log(err);
        console.log(resp);
   return;
   })

}

module.exports = helpers;
