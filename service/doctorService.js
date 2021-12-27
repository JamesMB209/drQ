class Doctor {
	constructor(doctor, knex) {
		this.id = doctor.id;
		this.fName = doctor.f_name;
		this.lName = doctor.l_name;
		this.room = doctor.room;
		this.knex = knex;

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
		this.queue.push(patient);
	}

	next() {
		this.queue.shift() // save to history 
		this.queue.map(patient => patient.queuePosition--)
	}

	length() {
		return this.queue.length;
	}

	move(patient, position = 1) {
		patient = this.queue.find(patient => patient.hkid == patient);
		let patientPos = this.queue.indexOf(patient => patient.hkid == patient);
		this.queue.splice(patientPos, 1);
		this.queue.splice(position, 0, patient);
	}

	async save() {
		// code if the whole booking was completed, eg. when the person checks out 
		// the code needs to check if this patient has visited before 
		// if no, adds new patient details to the DB

		// if yes/after adding. add the appointment details to the database
		await this.knex('patient')
			.select("id")
			.where('id_card', "B69420691")
			.then((row) => {
				if(row.length === 1) {
					console.log("returning patient")

				} else {
					console.log("new patient")
					this.knex('patient')
					.insert({
						f_name: "test fname",
						l_name: "test lname",
						id_card: "test",
						dob: this.queue[0].dob,
					})
				}
			})

		await this.knex('queue')
			.insert({

			})

		// .exists(select)
		// select exists(select 1 from patient where id_card = 'B6942069')		

		// this.knex("queue")
		// 	.insert({
		// 		patient_id: patientId,
		// 		doctor_id: doctorId,
		// 		checked_in: true
		// 	})
		// 	.then((result) => {
		// 		console.log(`Patients data saved successfully! New data: ${result}`)
		// 	})
	}

	// list() {
	// 	return this.knex('queue')
	// 		.innerJoin('patient', 'queue.patient_id', 'patient.id')
	// 		.select('queue.id', 'queue.doctor_id', 'patient.f_name', 'patient.l_name')
	// 		.where('queue.doctor_id', this.id)
	// 		.orderBy('created_at', 'asc');
	// }

}

module.exports = Doctor;