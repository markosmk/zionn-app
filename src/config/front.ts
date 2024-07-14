import { FrontConfig } from "@/types"

export const frontConfig: FrontConfig = {
  mainNav: [
    {
      title: "Gromix",
      href: "/gromix",
    },
    {
      title: "Musica",
      href: "/music",
    },
    {
      title: "Blog",
      href: "/blog",
    },
    {
      title: "Creadores",
      href: "/creators",
    },
    {
      title: "Changelog",
      href: "/changelog",
    },
  ],
}

import { MainConfig } from "@/types"

export const mainConfig: MainConfig = {
  mainNav: [
    {
      title: "Inicio",
      href: "/",
      disabled: true,
    },
    {
      title: "Gromix",
      href: "/gromix",
    },
  ],
  sidebarNav: [
    {
      title: "Descubrir",
      href: "/",
      icon: "music",
    },
    {
      title: "Gromix",
      href: "/gromix",
      icon: "music",
    },
    {
      title: "Singles",
      href: "/singles",
      icon: "music",
      disabled: true,
    },
    {
      title: "Albums",
      href: "/music",
      icon: "album",
    },
    {
      title: "Colecciones",
      href: "/collections",
      icon: "collection",
      disabled: true,
    },
    {
      title: "Radios",
      href: "/radios",
      icon: "radio",
      disabled: true,
    },
    {
      title: "Videos",
      href: "/videos",
      icon: "youtube",
      disabled: true,
    },
    {
      title: "Creadores",
      href: "/creators",
      icon: "users",
    },
  ],
}
