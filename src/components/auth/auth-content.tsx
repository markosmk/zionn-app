import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DialogBody, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type ContentProps = {
  title?: string
  description?: string
  children?: React.ReactNode
  type?: "card" | "dialog"
}

export const AuthContent = ({ title = "Hola Crack!", description, type = "dialog", children }: ContentProps) => {
  if (type === "card") {
    return (
      <Card className="mx-auto max-w-sm w-96">
        <CardHeader>
          <CardTitle className="text-3xl font-heading font-extrabold">{title}</CardTitle>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    )
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-3xl font-heading font-extrabold">{title}</DialogTitle>
        <DialogDescription className={!description ? "hidden" : ""}>{description}</DialogDescription>
      </DialogHeader>
      <DialogBody>{children}</DialogBody>
    </>
  )
}
