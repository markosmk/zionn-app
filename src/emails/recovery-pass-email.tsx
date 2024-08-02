import { siteConfig } from "@/config/site"
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components"
import * as React from "react"

interface RecoveryPassEmailProps {
  url: string
  name?: string | null
}

export const RecoveryPassEmail: React.FC<Readonly<RecoveryPassEmailProps>> = ({ name, url }) => (
  <Html>
    <Head />
    <Preview>¡No te preocupes, vamos a recuperar tu cuenta! 🔧</Preview>
    <Tailwind>
      <Body className="bg-slate-600 py-3">
        <Container className="bg-slate-">
          <Img src={`${siteConfig.url}/static/images/noposter.svg`} width="40" height="33" alt="ZionnMix" />
          <Section>
            <Text className="text-2xl font-normal text-center p-0 my-8 mx-0">Hola {name ?? "Genio/a"}!!,</Text>
            <Text className="text-sm">
              Parece que te has olvidado de tu contraseña. ¡A todos nos pasa en algún momento! 🤷‍♂️
            </Text>
            <Text className="text-sm">
              Para ayudarte a volver a entrar en tu cuenta, solo sigue este enlace para restablecer tu contraseña:
            </Text>

            <Button className="p-2 bg-[#00A3FF] rounded text-white text-xs font-semibold no-underline" href={url}>
              Recuperar mi acceso
            </Button>
            <Text className="text-sm">
              Este enlace es solo para ti, así que asegúrate de usarlo antes de que caduque. Si tienes alguna pregunta o
              necesitas más ayuda, no dudes en contactarnos a {siteConfig.defaultEmail}.
            </Text>
            <Text className="text-sm">¡No te rindas, estamos aquí para ayudarte!</Text>
            <Text className="text-sm">Un abrazo, Equipo {siteConfig.name}</Text>
            <Text className="text-sm">
              Para mantener tu cuenta segura, por favor no envíes este correo electrónico a nadie. El enlace es valido
              solo durante 5 horas. Si no quieres actualizar tu cuenta o no lo solicitaste nunca, ignora y borra este
              mensaje.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
)
