const asyncRedis = require("async-redis");
const fs = require("fs");
const client = asyncRedis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});


const deleteBars = async () => {
const ids = await client.keys(`ledbar*`)
await client.del(...ids)
return ids
}

deleteBars().then((ids)=>{
  console.log('DELETED: ', ids)
  fs.unlink('./bars.txt', ()=>{
    console.log('bars deleted from the db and fs')
    process.exit(0)
  })
})
