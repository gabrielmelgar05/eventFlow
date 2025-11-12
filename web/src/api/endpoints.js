export const endpoints = {
  signup: '/auth/signup',
  login: '/auth/login',
  me: '/auth/me',

  categories: '/categories',
  category: (id) => `/categories/${id}`,

  locations: '/locations',
  location: (id) => `/locations/${id}`,

  events: '/events',
  event: (id) => `/events/${id}`,
  eventImage: (id) => `/events/${id}/image`,           // se você criou esse endpoint PUT/POST
  eventCreateWithImage: '/event/create-with-image'     // ou esse direto
};
