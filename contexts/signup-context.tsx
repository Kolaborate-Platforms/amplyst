import React, { createContext, useContext, useState, ReactNode } from 'react'

type Role = "influencer" | "brand" | undefined

interface SignupContextType {
  selectedRole: Role
  setSelectedRole: (role: Role) => void
  clearRole: () => void
}

const SignupContext = createContext<SignupContextType | undefined>(undefined)

export function SignupProvider({ children }: { children: ReactNode }) {
  const [selectedRole, setSelectedRole] = useState<Role>(undefined)

  const clearRole = () => setSelectedRole(undefined)

  return (
    <SignupContext.Provider value={{ selectedRole, setSelectedRole, clearRole }}>
      {children}
    </SignupContext.Provider>
  )
}

export function useSignup() {
  const context = useContext(SignupContext)
  if (context === undefined) {
    throw new Error('useSignup must be used within a SignupProvider')
  }
  return context
}