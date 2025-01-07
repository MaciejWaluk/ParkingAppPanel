import supabase from '../lib/supabase'

export const authenticationContent = () => {
  const signIn = () => {
    sessionStorage.setItem('isAuthenticated', 'true')
  }

  const signOut = async () => {
    sessionStorage.removeItem('isAuthenticated')
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error(error.message)
    }
  }

  const isLogged = () => sessionStorage.getItem('isAuthenticated') === 'true'

  return { signIn, signOut, isLogged }
}

export type AuthContext = ReturnType<typeof authenticationContent>
