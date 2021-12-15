class Queue {
	constructor(knex) {
		this.knex = knex;
	}

	async list(doctorId) {
		try {
			let result = await this.knex('queue')
				.innerJoin('patient', 'queue.patient_id', 'patient.id')
				.select('queue.id', 'queue.doctor_id', 'patient.f_name', 'patient.l_name')
				.where('queue.doctor_id', doctorId)
				.orderBy('created_at', 'asc');
			return result;
		} catch (err) {
			console.log(`Listing error ${err}`)
		}
	}

	async add(doctorId, patientId, checkedIn=false) {
		try {
			await this.knex('queue')
				.insert({
					doctor_id: doctorId,
					patient_id: patientId,
					checked_in: checkedIn
				})
		} catch (err) {
			console.log(`Adding error ${err}`)
		}
	}

	async remove(queueId) {
		try {
		await this.knex('queue')
				.where('id', queueId)
				.del()

		} catch (err) {
			console.log(`Removing error ${err}`)
		}
	}

	// async length(doctorId) {
	// 	try {
	// 		await this.knex('queue')
	// 	}
	// }


	// async update()

	//push to top of queue
	//update(patientId)


	//length(doctorId) 
}

module.exports = Queue;
