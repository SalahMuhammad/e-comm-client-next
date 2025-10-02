import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function verifyAccessToken(token) {
  const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
  return payload;
}