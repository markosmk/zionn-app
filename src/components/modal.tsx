import { VariantProps } from "class-variance-authority"
import { LucideIcon } from "lucide-react"

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import { buttonVariants } from "./ui/button"

interface Props extends VariantProps<typeof buttonVariants> {
  title: string
  description?: string
  classNameContent?: string
  triggerText: string
  triggerIcon?: LucideIcon
  classNameTrigger?: string
  children?: React.ReactNode
  /** if is not button for Button UI, then you can style button class with triggerClassName */
  isButtonUI?: boolean
}

export function Modal({
  triggerIcon: Icon,
  triggerText,
  classNameTrigger,
  variant,
  size,
  title,
  description,
  classNameContent,
  children,
  isButtonUI = true,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={isButtonUI ? cn(buttonVariants({ variant, size, className: classNameTrigger })) : classNameTrigger}
        >
          {Icon && <Icon className="mr-2 h-4 w-4 text-muted-foreground/60" />}
          {triggerText}
        </button>
      </DialogTrigger>

      <DialogContent className={cn("max-h-[98%] overflow-hidden px-0 lg:max-w-lg", classNameContent)}>
        <DialogHeader>
          <DialogTitle className="font-helvetica text-2xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogBody>{children}</DialogBody>
      </DialogContent>
    </Dialog>
  )
}
