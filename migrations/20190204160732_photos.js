exports.up = function(knex, Promise) {
  return knex.schema.createTable('photos', table => {
    table.increments().primaryKey;
    table.string('link');
    table.string('title');
    table.string('author');
    table.string('description', 2048);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('photos');
};
