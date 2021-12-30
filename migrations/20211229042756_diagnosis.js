
exports.up = function(knex) {
    return knex.schema.createTable("diagnosis", (table) => {
        table.increments().unique();
        table.integer('patient_id');
        table.foreign('patient_id').references('patient.id');
        table.integer('doctor_id');
        table.foreign('doctor_id').references('doctor.id');
        table.string('diagnosis');
        table.timestamps(false, true);
    }) 
};

exports.down = function(knex) {
  return knex.schema.dropTable("diagnosis");
};
