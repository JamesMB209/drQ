class Doctor {
	constructor(doctor, knex) {
		this.id = doctor.id;
		this.fName = doctor.f_name;
		this.lName = doctor.l_name;
		this.room = doctor.room;
		// this.knex = knex;

		this.fullName = `${doctor.f_name} ${doctor.l_name}`;
		this.queue = [];
	}
	patient(url) {
		return new Promise((res, rej) => {
			url = url.toLowerCase();

			if (this.queue.findIndex(patient => patient.url == url) === -1) { rej("patient not found") };

			this.queue.find(patient => patient.url == url).queuePosition = this.queue.findIndex(patient => patient.url == url);
			res(this.queue.find(patient => patient.url == url));
		})
	}

	addToQueue(patient) {
		// if (this.id[0] !== undefined && this.id[0] == doctorId) {
		// 	this.queue.push() // push new patient
		// } res.redirect("/")
		this.queue.push(patient);
	}

	next() {
		// if (this.queue.length !== 0) {
		// 	return this.queue[0]
		// } res.end("No more patients waiting.")
		this.queue.shift() // save to history 
		this.queue.map(patient => patient.queuePosition--)
	}

	length() {
		// if (this.id[0] !== undefined) {
		// 	let length = this.queue.length
		// 	return `Total number of patient: ${length}`
		// }
		return this.queue.length;
	}

	save(patientId, doctorId/*, updated_at*/) {
		return this.knex("queue")
			.insert({
				patient_id: patientId,
				doctor_id: doctorId,
				checked_in: true
			})
			.then((result) => {
				console.log(`Patients data saved successfully! New data: ${result}`)
			})
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