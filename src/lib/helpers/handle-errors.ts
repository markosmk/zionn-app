import { getError, getErrorPrisma } from "@/config/errors"
import { Prisma } from "@prisma/client"
import axios from "axios"
import { z } from "zod"

function isObject(x: any) {
  return x != null && (typeof x == "object" || typeof x == "function")
}

/**
 *  Handles errors in the application, used by the API and the UI
 * @param error
 * @returns  { error: string; status: number }
 */
export function handleErrors(error: any): { error: string; status: number; errors?: any } {
  let message = "Error al intentar realizar esta operación"

  // if error is an axios error
  if (axios.isAxiosError(error) && error.response?.data.message) {
    return {
      error: error.response.data.message ?? message,
      status: error.response.status ?? 500,
    }
  }

  // if error is a zod error
  if (error instanceof z.ZodError) {
    return {
      error: "Error al validar la información",
      errors: error.issues,
      status: 422,
    }
  }

  // if error is a new Error
  if (error instanceof Error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const dataError = getErrorPrisma(error)
      return {
        error: dataError.message,
        status: dataError.status,
      }
    } else {
      const dataError = getError(error)
      return {
        error: dataError.message,
        status: dataError.status,
      }
    }
  }

  // if error is a Prisma error
  if (!isObject(error) && error instanceof Prisma.PrismaClientKnownRequestError) {
    const dataError = getErrorPrisma(error)
    return {
      error: dataError.message,
      status: dataError.status,
    }
  }

  // general
  return {
    error: error.message,
    status: 500,
  }
}
