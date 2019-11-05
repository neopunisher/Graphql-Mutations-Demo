const asyncRedis = require("async-redis");
import {
addAnimation,
addAnimationFrame
} from '../data/database'
const fs = require("fs");

const client = asyncRedis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

function mkRGB(r, g, b) {
    return [r, g, b]
}

function colorwheel(pos) {
    pos = 255 - pos;
    if (pos < 85) {
        return mkRGB(255 - pos * 3, 0, pos * 3);
    } else if (pos < 170) {
        pos -= 85;
        return mkRGB(0, pos * 3, 255 - pos * 3);
    } else {
        pos -= 170;
        return mkRGB(pos * 3, 255 - pos * 3, 0);
    }
}

function buildBar(offset) {
    const res = [];
    for (var i = 0; i < 10; i++) {
        res.push(colorwheel((offset + i) % 256));
    };
    return res
}

function buildRainbow() {
    const res = [];
    for (var j = 0; j < 256; j++) {
        res.push(buildBar(j));
    };
    return res
}

async function main(){
  let frames = buildRainbow()
  const ani = await addAnimation('rainbow',0)
  frames = await Promise.all(frames.map((f)=>addAnimationFrame(ani.id, f)))
  return [ani, ...frames]
}

main().then(([ani, ...frames])=>{
console.log('rainbow generated', ani)
process.exit()
})
