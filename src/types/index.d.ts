import { Icons } from "@/components/icons"

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}
export type MainNavItem = NavItem

export type FrontConfig = {
  mainNav: MainNavItem[]
}

export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    facebook: string
    youtube: string
    soundcloud: string
  }
  regex: {
    email: RegExp
    username: RegExp
    usernameWithAt: RegExp
    password: RegExp
  }
}

export type MainConfig = {
  mainNav: NavItem[]
  sidebarNav: SidebarNavItem[]
}

export type SidebarNavItem = {
  title: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
} & (
  | {
      href: string
      items?: never
    }
  | {
      href?: string
      items: NavItem[]
    }
)

export interface IUser {
  id: string
  name: string
  username: string
  email: string
  emailVerified: boolean | null
  password: string // FIXME: Omit of result mongo db
  coverImage: string | null
  profileImage: string | null
  bio: string | null
  role: string | null
  activity: string | null
  social: string[] | null
  createdAt: Date
  updatedAt: Date
  followingIds: string[] // ObjectId[] Mongo
  hasNotification: boolean
}

export interface IComment {
  id: string
  albumId: string
  body: string
  createdAt: Date
  updatedAt: Date
  userId: string
  user: IUser
}

export interface IAlbum {
  id: string
  user: string
  title: string
  slug: string
  thumb: string
  body: string
  genres: string[]
  deejay: string[]
  url?: string
  year: number
  media?: string
  share: string[]
  active: boolean
  created_at?: Date
  update_at?: Date
  genero_mix?: boolean
  featured?: boolean
  type?: "album" | "single" | "set" | "original"
}
