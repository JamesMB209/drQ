const History = require("../service/historyService");

class Doctor extends History {
	constructor(doctor) {
		super();
		this.id = doctor.id;
		this.fName = doctor.f_name;
		this.lName = doctor.l_name;
		this.room = doctor.room;

		this.fullName = `${doctor.f_name} ${doctor.l_name}`;
		this.queue = [];
	}

	patient(hkid) {
		/**
		 * Returns the patient object, Takes the HKID of the patient for reference.
		 */
		return new Promise((res, rej) => {
			if (this.queue.findIndex(patient => patient.hkid == hkid) === -1) { rej() };
			let patient = this.queue.find(patient => patient.hkid == hkid);

			patient.queuePosition = this.queue.findIndex(patient => patient.hkid == hkid);
			res(patient);
		})
	}

	addToQueue(patient) {
		/**
		 * Adds a patient object to the respective doctors queue.
		 */
		this.queue.push(patient);
	}

	next() {
		/**
		 * Advances the doctors queue by one, by removing the patient in position 0.
		 */
		this.queue.shift()
	}

	length() {
		/**
		 * Returns the number of people in the Queue.
		 */
		return this.queue.length;
	}

	save() {
		if (this.queue.length > 0) {
			return this.knex("queue")
				.insert({
					patient_id: 1, // how to get the patients id
					doctor_id: this.id,
					checked_in: true, 
					departure: new Date() 
				})
				.then((result) => {
					console.log(`Patients data saved successfully! New data: ${result}`)
				})
		} else {
			return`No one in queue`
		}
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
		// let reason = prompt("Reason for deletion: ")
		return this.knex("queue")
		.insert({
			patient_id: 1, // how to get the patients id
			doctor_id: this.id,
			checked_in: true,
			left_wo_seeing: new Date(),
			// reason: reason
		})
		.then((data) => {
			console.log(`Patient deleted from queue and time deleted is stored in the database: ${data}`)
		})
	}
}

module.exports = Doctor;