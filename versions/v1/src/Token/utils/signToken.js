import jwt from 'jsonwebtoken';
export function signToken(payload, expires) {
  if(!expires) return jwt.sign(payload, process.env.JWT);
  return jwt.sign(payload, process.env.JWT, { expiresIn: expires });
}