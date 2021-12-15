
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('patient').del()
    .then(function () {
      // Inserts seed entries
      return knex('patient').insert([
        {f_name: 'Bibek', l_name: 'Rajbhandari', id_card: 'A1234567', dob: '20000801'},
        {f_name: 'Sam', l_name: 'Shaughnessy', id_card: 'B6942069', dob: '19930228'},
        {f_name: 'Sid', l_name: 'Something', id_card: 'C4204209', dob: '19911013'},
      ]);
    });
};
