const knexFile = require('../knexfile').development;
const knex = require('knex')(knexFile);

class History {
	savePatient(patient) {
		/** 
		 * Adds a new patient to the "patient" database if none already exists 
		*/
		
		knex('patient')
		.select("id")
		.where('id_card', patient.hkid)
		.then((row) => {
			if(row.length === 1) {
				console.log("Returning patient.");
			} else {
				knex('patient')
				.insert({
					f_name: patient.fName,
					l_name: patient.lName,
					id_card: patient.hkid,
					dob: patient.dob,
				}).then(() => {
					console.log("New patient was added to the database.")
				}).catch((err) => {
					console.error(err);
				})
			}
		}).catch((err) => {
			console.error(err);
		})
	}

	addBooking(patient, checkedIn=true, completed=true) {
		/** 
		 * Adds a new booking the the history, requires the patient object.
		 * second value for checked in. (default: true)
		 * third value is a flag if the booking was completed.  (default: true)
		 */

		if (patient === undefined) {
			console.error("There are no patients left");
		 	return;
		}

		if (completed === true) {
			var departure = new Date();
		} else {
			var departure = null;
		}

		knex('appointment_history')
		.insert({
			patient_id: patient.id,
			doctor_id: patient.assignedDoctor,
			arrival: patient.arrived,
			departure: departure,
			checked_in: checkedIn,
		}).then(() => {
			console.log("an appointment was saved to the database")
		}).catch((err) => {
			console.error(err);
		})
	}


	// list() {
	// 	return knex('appointment_history')
	// 		.innerJoin('patient', 'appointment_history.patient_id', 'patient.id')
	// 		.select('appointment_history.id', 'appointment_history.doctor_id', 'patient.f_name', 'patient.l_name')
	// 		.where('appointment_history.doctor_id', this.id)
	// 		.orderBy('created_at', 'asc');
	// }
}

module.exports = History;