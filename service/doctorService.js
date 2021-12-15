class Doctor {
	constructor(id, fName, lName, room, knex, socket) {
		this.initPromise = null;
		this.knex = knex;
		this.fName = fName;
		this.lName = lName;
		this.room = room;
		this.socket = socket;
		this.id = id;
	}



	next() {
		// emits from socket/io "ID removed from Que"
		// all just notes
		// this.remove
	}

	list() {
		return this.knex('queue')
			.innerJoin('patient', 'queue.patient_id', 'patient.id')
			.select('queue.id', 'queue.doctor_id', 'patient.f_name', 'patient.l_name')
			.where('queue.doctor_id', this.id)
			.orderBy('created_at', 'asc');
	}

}

module.exports = Doctor;