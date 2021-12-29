
exports.up = function(knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments();
    table.string("username").unique();
    table.string("password");
    table.string("tag");
    table.timestamps(false, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("users")
};
