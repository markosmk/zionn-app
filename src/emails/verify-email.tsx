import { siteConfig } from "@/config/site"
import * as React from "react"

interface VerifyEmailProps {
  url: string
}

export const VerifyEmail: React.FC<Readonly<VerifyEmailProps>> = ({ url }) => (
  <div>
    <h1>Hola, amigo/a,</h1>
    <p>¡Bienvenido a nuestra comunidad! Estamos super emocionados de que te hayas unido a nosotros. 🚀</p>
    <p>
      Antes de que empieces a explorar todo, necesitamos que verifiques tu correo electrónico. Esto nos ayuda a
      asegurarnos de que somos amigos de verdad y mantendremos tu cuenta segura.
    </p>
    <p>Solo haz clic en el siguiente enlace para confirmar tu dirección de correo electrónico y ¡listo!</p>
    <a href={url}>Click para verificar tu cuenta</a>
    <p>Gracias por ser parte de nuestra comunidad.</p>
    -----
    <p>
      Este enlace será válido durante las próximas 24 horas. ¿El botón no funciona? Copia y pegua este enlace en tu
      navegador:
    </p>
    <p>{url}</p>
    -----
    <p>Un abrazo, el Equipo {siteConfig.name}</p>
    -----
    <p>
      Este correo electrónico fue enviado porque recientemente se registró para una cuenta de {siteConfig.name}. Si
      crees que esto es un error, ignora este mensaje.
    </p>
  </div>
)
