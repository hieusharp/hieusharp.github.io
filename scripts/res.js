// write to js file
const fs = require('fs')

// const content = 'this is what i want to write to file'

// fs.writeFile('./test.txt', content, err => {
//   if (err) {
//     console.error(err)
//     return
//   }
//   //file written successfully
// })

var d = new Date();
let time = d.getTime();
console.log(time)
var count = 1
var cron = require('node-cron');

cron.schedule('*/5 * * * * *', () => {
	  // write to js file
	

	const content = ['ADA',"BTC","XTZ","ETH"]

	fs.writeFile('./XXX.js',"var data = {symbol: '" +content[count%4]+"'}", err => {
	  if (err) {
	    console.error(err)
	    return
	  }
	  //file written successfully
	})
	

	console.log( "var data = {symbol: '" +content[count%4]+"'}")
	count+=1


});