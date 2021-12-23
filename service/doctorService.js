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
		// if (this.id[0] !== undefined && this.id[0] == doctorId) {
		// 	this.queue.push() // push new patient
		// } res.redirect("/")
		this.queue.push(patient);
	}

	next() {
		this.queue.shift() // save to history 
		this.queue.map(patient => patient.queuePosition--)
	}

	length() {
		return this.queue.length;
	}

	save() {
		return this.knex("queue")
			.insert({
				// patient_id: this.queue.patient.assignedDoctor + 1,// doesnt work
				patient_id: 1,
				doctor_id: this.id,// doesnt work
				checked_in: true, //purrfect
				departure: new Date() //purrfect
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
	// Admin superpowers ---- update Que and remove from Que
	move(hkid, position=1) {
        let patient = this.queue.find(patient => patient.hkid == hkid);
		console.log(`Patient:::::::::: ${patient}`)
        let patientPos = this.queue.findIndex(patient => patient.hkid == hkid);
		console.log(patientPos)
		console.log(this.queue[0], this.queue[1]);
		if (patientPos > 1) { // --> fixes bugs
			console.log(hkid);
			console.log("cluclucluclu" + patient);
			this.queue.splice(patientPos, 1);
			this.queue.splice(position, 0, patient);
		} else {
			return
		}
    }
	
	remove(hkid) {
		let patient = this.queue.find(patient => patient.hkid == hkid);
		console.log(`Wee WEE a ${patient}`)
		let patientPos = this.queue.findIndex(patient => patient.hkid == hkid);
		console.log(`Hi I'm Poppy.....${patientPos}`)
		this.queue.splice(patientPos, 1);
	}
}

module.exports = Doctor;