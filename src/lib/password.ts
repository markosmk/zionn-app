"use server"

import { hash, verify } from "@node-rs/argon2"

export async function saltAndHashPassword(password: string): Promise<string> {
  const pass = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  })
  return pass
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  return verify(hash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  })
}
