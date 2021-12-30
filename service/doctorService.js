class Doctor {
	constructor(doctor) {
		this.id = doctor.id;
		this.fName = doctor.f_name;
		this.lName = doctor.l_name;
		this.room = doctor.room;
		
		this.fullName = `${doctor.f_name} ${doctor.l_name}`;
		this.queue = [];
	}
	
	patient(hkid) {
		/**
		 * Returns a promise of the patient object from the HKID if exists.
		 */
		return new Promise((res, rej) => {
			if (this.queue.findIndex(patient => patient.hkid == hkid) === -1) { rej() };
			let patient = this.queue.find(patient => patient.hkid == hkid);
			
			patient.queuePosition = this.queue.findIndex(patient => patient.hkid == hkid);
			res(patient);
		})
	}

	patientIndex(hkid) {
		/**
		 * Returns the index of the patient.
		 */
		return this.queue.findIndex(patient => patient.hkid == hkid);
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

	move(hkid, position=1) {
		/**
		 * Move the patient referenced by the HKID to the specified position. Default 1 (first inline).
		 */
		this.patient(hkid).then(patient => {
			if (this.patientIndex(hkid) > 1) {
				this.queue.splice(this.patientIndex(hkid), 1);
				this.queue.splice(position, 0, patient);
			}
		})
    }

	remove(hkid) {
		/**
		 * removes the patient with the specified HKID.
		 */
		this.queue.splice(this.patientIndex(hkid), 1);
	}
}

module.exports = Doctor;