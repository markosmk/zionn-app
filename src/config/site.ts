import { SiteConfig } from "@/types"

export const siteConfig: SiteConfig = {
  name: "ZionnMix",
  description: "La comunidad mas grande de artistas cristianos.",
  url: "https://www.zionnmix.com/",
  ogImage: "https://www.zionnmix.com/panel.png",
  links: {
    twitter: "https://twitter.com/zionnmix",
    facebook: "https://facebook.com/zionnmix",
    youtube: "https://youtube.com/zionnmix",
    soundcloud: "https://soundcloud.com/zionnmix",
  },
  regex: {
    username: /^[a-zA-Z0-9]{4,18}$/,
    usernameWithAt: /^@[a-zA-Z0-9]{4,18}$/,
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  },
}
