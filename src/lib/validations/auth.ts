import { z } from "zod"

const MESSAGE = {
  required: { message: "El campo es obligatorio." },
  email: { message: "Debe ser un email válido." },
  noMatch: { message: "La contraseña no coincide." },
  passwordMin: { message: "La contraseña debe tener al menos 6 caracteres." },
  passwordMax: { message: "La contraseña debe tener menos de 32 caracteres." },
  username: {
    message: "El nombre de usuario debe tener entre 5 y 32 caracteres.",
  },
  emailOrUsername: { message: "Email o nombre de usuario incorrecto." },
}

const usernameRegex = /^[a-zA-Z0-9]+$/

export const authLoginSchema = z.object({
  identifier: z
    .string()
    .min(1, MESSAGE.required)
    .refine((value) => {
      const isEmail = z.string().email().safeParse(value).success
      const isUsername = usernameRegex.test(value)
      return isEmail || isUsername
    }, MESSAGE.emailOrUsername),
  password: z
    .string()
    .min(1, MESSAGE.required)
    .min(6, MESSAGE.passwordMin)
    .max(32, MESSAGE.passwordMax),
})

export const registerSchema = z.object({
  email: z.string().min(1, MESSAGE.required).email(MESSAGE.email),
  password: z
    .string()
    .min(1, MESSAGE.required)
    .min(6, MESSAGE.passwordMin)
    .max(32, MESSAGE.passwordMax),
  confirmPassword: z.string().min(1, MESSAGE.required).optional(),
})

export const authRegisterSchema = registerSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    path: ["confirmPassword"],
    ...MESSAGE.noMatch,
  }
)
