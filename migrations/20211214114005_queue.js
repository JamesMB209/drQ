
exports.up = function(knex) {
	return knex.schema.createTable('queue', (table) => {
	table.increments().unique();
	table.integer('patient_id');
	table.foreign('patient_id').references('patient.id');
	table.integer('doctor_id');
	table.foreign('doctor_id').references('doctor.id');
	table.boolean('checked_in');	
	table.timestamps(false, true);
	table.string('arrival');
	table.string('departure');
	table.string('left_wo_seeing');
	table.string('reason')
	})
};

exports.down = function(knex) {
  	return knex.schema.dropTable('queue');
};
