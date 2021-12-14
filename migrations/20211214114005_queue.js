
exports.up = function(knex) {
	return knex.schema.createTable('queue', (table) => {
	table.increments().unique();
	table.integer('patient_id').unsigned();
	table.foreign('patient_id').references('patient.id');
	table.integer('doctor_id').unsigned();
	table.foreign('doctor_id').references('doctor.id');
	table.boolean('checked_in');	
	table.timestamps(false, true);
	})
};

exports.down = function(knex) {
  	return knex.schema.dropTable('queue');
};
