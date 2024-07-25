import { VariantProps } from "class-variance-authority"
import { useMemo, useState } from "react"

import { Alert, AlertDescription, AlertTitle, alertVariants } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { Icons } from "./icons"

type AlertMessageProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & {
    title?: string
    hasClose?: boolean
  }

export function AlertMessage({ children, className, variant, title, hasClose = false, ...props }: AlertMessageProps) {
  const [close, setClose] = useState(false)

  const { name, icon: Icon } = useMemo(
    () => ({
      name:
        variant == "destructive"
          ? "Error"
          : variant == "info"
            ? "Información"
            : variant == "warning"
              ? "Advertencia"
              : variant == "success"
                ? "Genial"
                : "Info",
      icon: variant == "info" ? Icons.info : variant == "success" ? Icons.success : Icons.alert,
    }),
    [variant]
  )

  return (
    <Alert
      className={cn(
        "relative overflow-hidden text-left",
        className,
        close && "hidden",
        !title && "[&>svg+div]:translate-y-[0px]"
      )}
      variant={variant}
      {...props}
    >
      {hasClose && (
        <button
          type="button"
          className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-black/10 transition-opacity hover:opacity-50"
          onClick={() => setClose(true)}
        >
          <Icons.closeX className="h-3.5 w-3.5" />
        </button>
      )}
      <Icon className="absolute h-20 w-20 -rotate-12 -top-1 bottom-0 -right-4 opacity-15" />
      {title && <AlertTitle>{title ? title : name}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}
