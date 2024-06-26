import bcrypt from "bcrypt"

export async function saltAndHashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12)
  const hash = await bcrypt.hash(password, salt)
  return hash
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
