
exports.up = function(knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments();
    table.string("username").unique();
    table.string("password");
    table.string("tag");
    table.timestamps(false, true);
    table.integer("doctor_id").unique(); // doesnt work
    table.foreign("doctor_id").references("doctor.id"); // doesnt work
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("users")
};
