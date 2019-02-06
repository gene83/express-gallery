exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('photos')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('photos').insert([
        {
          link:
            'http://i.nextmedia.com.au/insidesport/2011-02-mondayitis_rhys_jeremy_660.jpg',
          title: 'Title Place Holder',
          author: 'Jeremy Wilmotte',
          description: ''
        },
        {
          link:
            'https://cdn3.theinertia.com/wp-content/gallery/adam-duffy-photography/tahiti-inside-out.jpg',
          title: 'Title Place Holder',
          author: 'Adam Duffy',
          description: ''
        },
        {
          link:
            'https://iso.500px.com/wp-content/uploads/2015/01/remagic_cover.jpeg',
          title: 'Title Place Holder',
          author: 'Marco Petracci',
          description: ''
        },
        {
          link:
            'https://prime-surfing.de/wp-content/uploads/2018/08/Steudtner-Nazare.jpg',

          title: 'Title Place Holder',
          author: 'Sebastian Steudner',
          description: ''
        },
        {
          link: 'https://i.ytimg.com/vi/DWO9OhDzYtU/maxresdefault.jpg',
          title: 'Title Place Holder',
          author: 'unknown',
          description: ''
        },
        {
          link:
            'https://images.unsplash.com/photo-1496457460058-372d00396733?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
          title: 'Title Place Holder',
          author: 'unknown',
          description: ''
        }
      ]);
    });
};
