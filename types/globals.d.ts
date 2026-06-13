export {}

declare global {
  interface CustomJwtSessionClaims {
    role?: 'ADMIN' | 'USER'
  }
}
