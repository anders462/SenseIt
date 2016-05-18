

//Load Triggers from Database to memory


var sens1 = '48r4fhf8rydehwud89r'
var sens2 = '895hufret8fh98hr438'

var trigger = {'48r4fhf8rydehwud89r':{val:50,op1:"less",status:false}}


function checkTrigger(sensorId,val,trigger){
  if (!trigger[sensorId].status){
    switch(trigger[sensorId].op1){
      case "less":
        if (val < trigger[sensorId].val){
          //console.log("alarm, value: " + val + " is less then trigger: " + trigger[sensorId].val);
        }
        break;
      case "larger":
          if (val > trigger[sensorId].val){
            //console.log("alarm value: " + val + " is larger then trigger: " + trigger[sensorId].val);
          }
          break;
       default:
        break;

    }
  } else {
    console.log("alarm")
  }

}

setInterval(function(){
  var val = 99//Math.random()*100;
  console.log("val", val)
  //checkTrigger(sens1,val,trigger);
},3000)
