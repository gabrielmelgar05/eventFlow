// src/api/auth.js
import api from '../utils/api'

// payload: { email, password }
export async function login(credentials) {
  console.log('AuthApi.login - baseURL =>', api.defaults.baseURL)

  const response = await api.post('/auth/login', {
    email: credentials.email,
    password: credentials.password,
  })

  console.log('AuthApi.login - status:', response.status)
  console.log('AuthApi.login - data:', response.data)

  // sua API retorna: { "token": "..." }
  return response.data
}
