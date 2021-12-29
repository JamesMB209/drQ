const knexFile = require('../knexfile').development;
const knex = require('knex')(knexFile);

class History {
	addPatient(patient) {
		/** 
		 * Adds a new patient to the "patient" database if none already exists 
		*/

		return knex('patient')
		.select("id")
		.where('id_card', patient.hkid)
		.then((row) => {
			if(row.length === 1) {
				console.log("Returning patient.");
			} else {
				return knex('patient')
				.insert({
					f_name: patient.fName,
					l_name: patient.lName,
					id_card: patient.hkid,
					dob: patient.dob,
				})
				.returning("id")
				.catch((err) => {
					console.error(err);
				})
			}
		}).catch((err) => {
			console.error(err);
		})
	}

	saveBooking(patient, completed=true, checkedIn=true) {
		/** 
		 * Adds a new booking the the history, requires the patient object.
		 * second value is a flag if the booking was completed.  (default: true)
		 * third value for checked in. (default: true)
		 */

		if (patient === undefined) {
			console.error("There are no patients left");
		 	return;
		}

		knex('appointment_history')
		.insert({
			patient_id: patient.id,
			doctor_id: patient.assignedDoctor,
			arrival: patient.arrived,
			departure: new Date(),
			checked_in: checkedIn,
			completed: completed,
		}).then(() => {
			console.log("an appointment was saved to the database")
		}).catch((err) => {
			console.error(err);
		})
	}

	saveDiagnosis(doctorId, patientId, diagnosis) {
		/** 
		 * inserts a new row into the "diagnosis table"
		 */

		if (diagnosis === undefined) {
			console.error("nothing to input");
		 	return;
		}

		knex('diagnosis')
		.insert({
			patient_id: patientId,
			doctor_id: doctorId,
			diagnosis: diagnosis,
		}).then(() => {
			console.log("a diagnosis was saved to the database")
		}).catch((err) => {
			console.error(err);
		})
	}

	// Ill keep this here for now.
	// list() {
	// 	return knex('appointment_history')
	// 		.innerJoin('patient', 'appointment_history.patient_id', 'patient.id')
	// 		.select('appointment_history.id', 'appointment_history.doctor_id', 'patient.f_name', 'patient.l_name')
	// 		.where('appointment_history.doctor_id', this.id)
	// 		.orderBy('created_at', 'asc');
	// }
}

module.exports = History;