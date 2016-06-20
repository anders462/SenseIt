var triggers = [
  {
    "_id": "5768242d45eeb663f90947c7",
    "triggerId": "5759defdf58e4339f30a2a0f",
    "createdAt": "2016-06-20T17:13:17.364Z",
    "owner": "574492a36332fbf527c2be1f",
    "updatedAt": "2016-06-20T17:14:36.654Z",
    "log": [],
    "triggers": [
      {
        "status": false,
        "op": "less",
        "val": 86,
        "type": "temp"
      },
      {
        "status": false,
        "op": "less",
        "val": 45,
        "type": "humidity"
      }
    ]
  },
  {
    "_id": "5768252a45eeb663f90947c8",
    "triggerId": "5759defdf58e4339f30a2a00",
    "createdAt": "2016-06-20T17:17:30.844Z",
    "owner": "574492a36332fbf527c2be1f",
    "updatedAt": "2016-06-20T17:17:30.844Z",
    "log": [],
    "triggers": [
      {
        "status": false,
        "op": "less",
        "val": 86,
        "type": "temp"
      },
      {
        "status": false,
        "op": "less",
        "val": 45,
        "type": "humidity"
      }
    ]
  },
  {
    "_id": "5768253445eeb663f90947c9",
    "triggerId": "5759defdf58e4339f30a2a09",
    "createdAt": "2016-06-20T17:17:40.498Z",
    "owner": "574492a36332fbf527c2be1f",
    "updatedAt": "2016-06-20T17:17:40.498Z",
    "log": [],
    "triggers": [
      {
        "status": false,
        "op": "less",
        "val": 86,
        "type": "temp"
      },
      {
        "status": false,
        "op": "less",
        "val": 45,
        "type": "humidity"
      }
    ]
  }
]
//load in memory at start and update everytime trigger added or changed
//save in log when alerted, {alertTime: time, trigger: temp, sample:50, op: 'larger', val:49}

var triggerObj={};

triggers.forEach(function(elem){
  triggerObj[elem.triggerId] = elem.triggers;
});

console.log(triggerObj);
