var Triggers = require('../models/triggers');



// trigger = [{'48r4fhf8rydehwud89r':{type:'temp', val:50,op:"less",status:false}}
// op less, larger or equal
//sample = {timeStamp:555999669, d:{temp:55,...}}

var triggerObj={};

var MIN_SAMPLE_AVG_TO_CHECK_TRIGGER = 6; //how often to checkTrigger with MIN_FLOATING_AVG_TIME

//methods available from module
var helpers = {
  checkTrigger: checkTrigger,
  loadTriggers: loadTriggers
};


//Load Triggers from Database to memory
function loadTriggers(){
  Triggers.find({}, function (err, triggers) {
      if (err) throw err;
      triggers.forEach(function(elem){
        triggerObj[elem.triggerId] = elem.triggers;
      });
      console.log("TRIGGER OBJ UPDATED", triggerObj);
    });
  };


function checkTrigger(id,sample){
  var triggerd = false;
    //Check if device/sensor id have a trigger obj set
    if (triggerObj.hasOwnProperty(id)){
     //iterate through all triggers for id
      triggerObj[id].forEach(function(trigger,i){
        //for each trigger in triggerObj iterate of props in sample data
          for (type in sample.data){
            //if type is same and alarm not already triggered
            if (trigger.type == type && !trigger.status){
              console.log("getStatus",trigger,sample.data[type]);
              //check if value will trigger alarm
              triggerd = getStatus(trigger,sample.data[type]);
              if (triggerd) {
                trigger.status = true; //set status to true so no new alarms are triggered
                logAlert(id,trigger); //log alert event in db
                console.log(triggerObj)
                //send notification via sms and email
                //log alert
              }

            }
          }
      });
      }
    }

//Check if alarms are triggered
function getStatus(trigger,sampleData) {
  switch(trigger.op){
        case "less":
          if (sampleData < trigger.val){
            console.log("alarm trigged at",new Date(),"sampleData",sampleData,"less then trigger",trigger.val);
            return true;
          }
          break;
        case "larger":
            if (sampleData > trigger.val){
              console.log("alarm trigged at",new Date(),"sampleData",sampleData,"larger then trigger",trigger.val);
              return true;
            }
            break;
        case "equal":
            if (sampleData == trigger.val){
              console.log("alarm trigged at",new Date(),"sampleData",sampleData,"equal to trigger",trigger.val);
              return true;
                }
            break;
         default:
            return false;
            break;
      }

}
//log alert event history
function logAlert(id,event){
  event.time = new Date();
  Triggers.find({triggerId:id}, function (err, trigger) {
          if (err) {
           console.log({error:err});
            //throw err;  //ADD REAL error handler
          } else {
            trigger[0].log.push(event); //add event to log array
            trigger[0].triggers.forEach(function(obj){
              if(obj.type == event.type && obj.op == event.op){ //find and update trigger obj
                obj.status = true;
              }
            })
            //save updated trigger object
            Triggers.update({triggerId:id},trigger[0],function(err,doc){
              console.log({"message": "alert event logged for id: " + id, "doc": doc});
            });
          }
      });

}


module.exports = helpers;
