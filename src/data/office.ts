// Erika's office: the one place to change the address. Used by the schema, footer, contact page and home.
export const office = {
  street: 'Švermova 1025/5',
  postalCode: '977 01',
  city: 'Brezno',
  region: 'Banskobystrický kraj',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Švermova 1025, 977 01 Brezno'),
};
export const officeLine = `${office.street}, ${office.postalCode} ${office.city}`;
