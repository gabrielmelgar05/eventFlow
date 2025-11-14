// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../utils/api'
import { login as loginApi } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [signed, setSigned] = useState(false)
  const [loading, setLoading] = useState(true)

  // carrega token do storage ao abrir o app
  useEffect(() => {
    async function loadStorage() {
      try {
        const token = await AsyncStorage.getItem('@eventflow:token')
        const storedUser = await AsyncStorage.getItem('@eventflow:user')

        if (token && storedUser) {
          api.defaults.headers.Authorization = `Bearer ${token}`
          setUser(JSON.parse(storedUser))
          setSigned(true)
        }
      } catch (err) {
        console.log('Erro carregando auth do storage', err)
      } finally {
        setLoading(false)
      }
    }

    loadStorage()
  }, [])

  async function signIn({ email, password }) {
    console.log('AuthContext.signIn - start')

    // chama a API
    const data = await loginApi({ email, password })

    // garante que existe token
    if (!data?.token) {
      throw new Error('Resposta de login sem token')
    }

    const token = data.token
    console.log('AuthContext.signIn - token recebido')

    // seta token global no axios
    api.defaults.headers.Authorization = `Bearer ${token}`

    // salva em disco
    await AsyncStorage.setItem('@eventflow:token', token)
    await AsyncStorage.setItem(
      '@eventflow:user',
      JSON.stringify({ email }) // depois você pode trocar por /auth/me
    )

    // atualiza estado
    setUser({ email })
    setSigned(true)

    console.log('AuthContext.signIn - finalizado com sucesso')
  }

  async function signOut() {
    await AsyncStorage.multiRemove(['@eventflow:token', '@eventflow:user'])
    delete api.defaults.headers.Authorization
    setUser(null)
    setSigned(false)
  }

  return (
    <AuthContext.Provider value={{ user, signed, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return ctx
}
