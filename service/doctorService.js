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

	move(patient, position = 1) {
		/**
		 * Moves the patient object referenced by HKID to the specified position. (default 1)
		 */
		patient = this.queue.find(patient => patient.hkid == patient);
		let patientPos = this.queue.indexOf(patient => patient.hkid == patient);
		this.queue.splice(patientPos, 1);
		this.queue.splice(position, 0, patient);
	}
}

module.exports = Doctor;