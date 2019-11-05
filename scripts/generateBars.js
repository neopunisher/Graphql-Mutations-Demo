import {
  toGlobalId,
} from 'graphql-relay'
const uuid = require('uuid/v4');
const numLeds = process.argv[2] || 10
const asyncRedis = require("async-redis");
const fs = require("fs");

const client = asyncRedis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

const globalId = (id) => toGlobalId('LedBar', id)

console.log(`num leds: ${numLeds}`)

var bars = [];
let cmds = [];
for (let index = 0; index <= numLeds; index++) {
    const id = uuid();
    const password = Math.random().toString(36).substr(2);
    const gid = globalId(id);
    const obj = {index,
      gid,
      id,
      numLeds,
      password}
    bars.push(obj);
    cmds = cmds.concat(Object.entries(obj).map(([key, val])=>client.hset(`ledbar:${id}`, key, val)))
    cmds.push(client.sadd(`ledbars`, id))
}

console.log(bars)

Promise.all(cmds).then(()=>{
  fs.writeFile('./bars.txt', JSON.stringify(bars, null, 2), ()=>{
    console.log('file written and database filled')
    process.exit(0)
  })
})
