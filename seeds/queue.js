
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('appointment_history').del()
    .then(function () {
      // Inserts seed entries
      return knex('appointment_history').insert([
        {patient_id: 1, doctor_id: 2, checked_in:true},
        {patient_id: 2, doctor_id: 3, checked_in:true},
        {patient_id: 3, doctor_id: 3, checked_in:true},
        {patient_id: 1, doctor_id: 1, checked_in:true},
        {patient_id: 2, doctor_id: 2, checked_in:true},
        {patient_id: 3, doctor_id: 1, checked_in:true},
        {patient_id: 1, doctor_id: 2, checked_in:true},
        {patient_id: 1, doctor_id: 3, checked_in:true},
        {patient_id: 1, doctor_id: 3, checked_in:true},
      ]);
    });
};
