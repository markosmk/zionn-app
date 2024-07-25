import { create } from "zustand"
import { TypeContent } from "./sections"

type ContentModalProps = {
  content: TypeContent
  setContent: (content: TypeContent | undefined) => void
}

export const useContentModal = create<ContentModalProps>((set) => ({
  content: "login",
  setContent: (content) => set({ content: content ?? "login" }),
}))
