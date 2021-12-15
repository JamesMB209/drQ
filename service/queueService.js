const knexFile = require('../knexfile.js').development;
const knex = require('knex')(knexFile);

class Queue {
	constructor(knex) {
	this.knex=knex;
	}

	async list(doctorId) {
	//try {
		let result = await this.knex('queue')
		.select('id', 'patient_id')
		.where('doctor_id',doctorId)
		.orderBy('id','asc');
	//} catch (err) {
	//	console.log('error error !!! you done fucked up')
	//	}
	
	return result;
	}



	//add(doctorId, patientId)

	//remove(patientId)

	//push to top of queue
	//update(patientId)


	//length(doctorId) 
}


let testingQue = new Queue(knex);

async function name() {
await console.log(testingQue.list(1));
await console.log("finished");
}

name();
