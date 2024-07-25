import { Prisma } from "@prisma/client"

/**
 * Error codes
 * https://www.prisma.io/docs/reference/api-reference/error-reference
 */
export const prismaErrorsCode: Record<string, [string, number]> = {
  P2025: ["Una operación falló porque depende de uno o más registros.", 422],
  P2015: ["No se pudo encontrar un registro relacionado.", 404],
}

const prismaErrorsWithKeys: Record<string, [string, number, string][]> = {
  P2002: [
    ["El nombre de usuario que has ingresado ya existe.", 422, "User_username_key"],
    ["El email que intentas registrar ya existe.", 422, "User_email_key"],
  ],
}

export const getErrorPrisma = (error: any): { message: string; status: number } => {
  let message = "Error desconocido BD"
  let status = 500
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const target = error.meta?.target

    console.log({ code: error.code, target })
    if (error.code in prismaErrorsCode) {
      message = prismaErrorsCode[error.code][0]
      status = prismaErrorsCode[error.code][1]
      console.log({ message, status })
    } else if (error.code in prismaErrorsWithKeys && typeof target === "string") {
      const objError = prismaErrorsWithKeys[error.code]
      const arrayWithKey = objError.find((array) => array[2] === target)
      if (arrayWithKey) {
        const [messageError, statusError, targetError] = arrayWithKey
        message = messageError
        status = statusError
      }
    }
  }
  return { message, status: 500 }
}

/**
 * Error codes
 * ex: new Error(errorsCodes.User_not_found)
 * in the catch, we can use this
 * ex: if(error instanceof Error) {
 *      if(error.message === errorsCodes.User_not_found) {
 *          return NextResponse.json({ message: errorsCodes.User_not_found[0] }, { status: errorsCodes.User_not_found[1] })
 *       }
 *   }
 * @type {Record<string, string>}
 */
export const errorsCodes: Record<string, [string, number]> = {
  User_not_found: ["El Usuario con ese email no existe.", 404],
  Email_Error: [
    "Hubo problemas al enviar el email, intenta de nuevo mas tarde. Si el problema persiste, contactanos.",
    404,
  ],
  Token_Exists: ["Hay un código de verificación pendiente, intenta de nuevo mas tarde.", 404],
  Password_Error: ["La contraseña no coincide.", 404],
  Username_Error: ["El nombre de usuario no es valido.", 404],
}

// function to search errors in errorsCode and return object or, only message
export const getError = (error: any): { message: string; status: number } => {
  if (error instanceof Error) {
    if (error.message in errorsCodes) {
      return { message: errorsCodes[error.message][0], status: errorsCodes[error.message][1] }
    }
  }
  return { message: error.message, status: 500 }
}

const messageDefault =
  "Hubo problemas al procesar la solicitud, si el problema persiste comunicate con un administrador por favor."

// for errors in login
// https://next-auth.js.org/configuration/pages#error-page
export const errorsAuth = {
  Verification:
    "Hubo un problema con nuestro proveedor de emails. El token há expirado o ya se ha utilizado. Error: 1032",
  AccessDenied:
    "Al parecer no autorizaste el acceso a través de Google, si crees que fue un error nuestro, comunicáte con un administrador. Error: 1033",
  Configuration:
    "Sucedió un problema en el servidor. Intenta mas tarde, si el problema persiste informa el error a un administrador por favor, muchas gracias. Error: 1040",
  Default: messageDefault + " Error: 1041",
}

// https://next-auth.js.org/configuration/pages#sign-in-page
export const errorsLogin = {
  OAuthSignin: messageDefault + " Error: 1051",
  OAuthCallback: messageDefault + " Error: 1052",
  // this happend and dont documented
  OAuthCallbackError:
    "Hubo problemas al crear tu usuario en la aplicación, intenta de nuevo mas tarde o informa el error a un administrador. Error: 1053",
  OAuthCreateAccount: messageDefault + " Error: 1054",
  EmailCreateAccount: messageDefault + " Error: 1055",
  Callback: messageDefault + " Error: 1056",
  OAuthAccountNotLinked: "El correo ya esta vinculado con otro usuario en nuestro sistema. Error: 1059",
  EmailSignin: "No se pudo enviar el correo con el token de verificación, comunicáte con un administrador. Error: 1060",
  CredentialsSignin: "Ups, El email/nombre de usuario y/o contraseña que ingresaste son incorrectos.",
  SessionRequired: "Has intentado acceder a una seccion que requiere iniciar sesion. Por favor inicia sesion.",
  AccessDenied: "La cuenta no ha sido verificada. Por favor revisa tu correo electronico.",
  Default: messageDefault,
}
