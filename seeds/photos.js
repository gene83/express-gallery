exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('photos')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('photos').insert([
        {
          image:
            'http://i.nextmedia.com.au/insidesport/2011-02-mondayitis_rhys_jeremy_660.jpg',
          title: 'Catching Shade',
          link: 'slavetothesea.com',
          description: ''
        },
        {
          image:
            'http://i.nextmedia.com.au/insidesport/2011-02-mondayitis_rhys_jeremy_660.jpg',
          title: 'Tahitian cavern',
          link: 'slavetothesea.com',
          description: ''
        },
        {
          image:
            'http://i.nextmedia.com.au/insidesport/2011-02-mondayitis_rhys_jeremy_660.jpg',
          title: 'Sunset Creamsicle',
          link: 'slavetothesea.com',
          description: ''
        },
        {
          image:
            'https://prime-surfing.de/wp-content/uploads/2018/08/Steudtner-Nazare.jpg',
          title: 'Nazare Nightmares',
          link: 'slavetothesea.com',
          description: ''
        },
        {
          image:
            'http://i.nextmedia.com.au/insidesport/2011-02-mondayitis_rhys_jeremy_660.jpg',
          title: 'Blue Dream',
          link: 'slavetothesea.com',
          description: ''
        },
        {
          image:
            'http://i.nextmedia.com.au/insidesport/2011-02-mondayitis_rhys_jeremy_660.jpg',
          title: 'Green peace',
          link: 'slavetothesea.com',
          description: ''
        }
      ]);
    });
};
