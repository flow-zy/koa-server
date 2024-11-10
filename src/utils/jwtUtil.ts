import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key'
const EXPIRES_IN = '3h'

interface TokenPayload {
	userId: number
	username: string
}

export const generateToken = (payload: TokenPayload): string => {
	return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN })
}

export const verifyToken = (token: string): TokenPayload => {
	return jwt.verify(token, SECRET_KEY) as TokenPayload
}
