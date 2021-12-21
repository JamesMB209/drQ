
exports.up = function(knex) {
  return knex.schema.table("queue", (table) => {
      table.string("departure")
  })
};

exports.down = function(knex) {
  return knex.schema.table("queue", (table) => {
      table.dropColumn("departure")
  })
};
