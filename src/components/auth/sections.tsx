import { ForgetPassForm } from "./forms/forget-pass-form"
import { LoginForm } from "./forms/login-form"
import { RegisterForm } from "./forms/register-form"
import { ResetPassForm } from "./forms/reset-pass-form"
import { VerifyForm } from "./forms/verify-form"

export type TypeContent = "login" | "register" | "forget" | "reset" | "verify"

export type TypeContentView = {
  [opt in TypeContent]: {
    title: string
    description?: string
    footerText: string
    linkToggle: string
    form: JSX.Element
    linkContent: TypeContent
  } | null
}

export const section: TypeContentView = {
  login: {
    title: "Hola Crack! 👋",
    footerText: "¿No tienes cuenta todavía?",
    linkToggle: "Crea una ahora!",
    linkContent: "register",
    form: <LoginForm />,
  },
  register: {
    title: "Crear Cuenta",
    footerText: "Ya tienes una cuenta?",
    linkToggle: "Ingresar",
    linkContent: "login",
    form: <RegisterForm />,
  },
  forget: {
    title: "Olvide mi pass 🤥",
    description: "Ingresa el correo de tu cuenta y te enviaremos un enlace para reestablecer tu contraseña.",
    footerText: "Volver a",
    linkToggle: "Ingresar",
    linkContent: "login",
    form: <ForgetPassForm />,
  },
  reset: {
    title: "Reestablecer pass",
    footerText: "Ya tienes una cuenta?",
    linkToggle: "Ingresar",
    linkContent: "login",
    form: <ResetPassForm />,
  },
  verify: {
    title: "Verificar Cuenta",
    footerText: "Ya tienes una cuenta?",
    linkToggle: "Ingresar",
    linkContent: "login",
    form: <VerifyForm />,
  },
}
