import React from 'react'
import RootNavigator from './src/navigation/RootNavigator'
import { AuthProvider } from './src/context/AuthContext' // Certifique-se de que o caminho está correto

export default function App() {
  return (
    // O AuthProvider deve envolver todo o aplicativo para que o useAuth funcione
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  )
}