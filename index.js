const fs = require("fs");
const path = require("path");
const express = require("express");
const { engine } = require("express-handlebars");
const basicAuth = require("express-handlebars");
// const authChallenger = require("./AutherChallenger");
const knexFile = require('/home/james/Documents/Xccelerate/drQ/knexfile.js').development;
const knex = require('knex')(knexFile);
const Queue = require("./service/queueService");







// a place for us to test our code right now
function test() {
    let testingQue = new Queue(knex);

	testingQue.list(1).then((data) => (console.log(data)));
	testingQue.add(2, 1,true).then((data) => (console.log(data)));
	testingQue.remove(10).then((data) => (console.log(data)));
	console.log("finished");
}

test();