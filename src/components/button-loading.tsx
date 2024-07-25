import { Icons } from "./icons"
import { Button, ButtonProps } from "./ui/button"

type ButtonLoadingProps = ButtonProps & {
  isWorking?: boolean
  textWorking?: string
}

export function ButtonLoading({ disabled, children, isWorking = false, textWorking, ...props }: ButtonLoadingProps) {
  return (
    <Button disabled={disabled || isWorking} {...props}>
      {isWorking ? textWorking ? textWorking : <Icons.loading className="h-6 w-6" /> : children}
    </Button>
  )
}
