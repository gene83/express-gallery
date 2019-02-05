exports.up = function(knex, Promise) {
  return knex.schema.createTable('photos', table => {
    table.increments().primaryKey;
    table.string('image');
    table.string('title');
    table.string('link');
    table.string('description', 2048);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('photos');
};
