import Image from "next/image"

import { cn } from "@/lib/utils"
import { Album } from "@/data/albums"
import Link from "next/link"

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  album: Album
  aspectRatio?: "portrait" | "square"
  width?: number
  height?: number
  forCarousel?: boolean
}

export function AlbumArtwork({
  album,
  aspectRatio = "portrait",
  width,
  height,
  className,
  forCarousel,
  ...props
}: AlbumArtworkProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <Link href={`/music/${album.slug}`}>
        <div className={cn("overflow-hidden rounded-lg bg-slate-400", aspectRatio === "portrait")}>
          <Image
            src={album.cover}
            alt={album.name}
            width={width}
            height={height}
            className={cn(
              "h-auto w-auto object-cover transition-all rounded-lg",
              "hover:opacity-80 hover:scale-105 hover:rotate-2",
              aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
            )}
            // FIXME: has either width or height modified
            style={{ minWidth: forCarousel ? width : undefined }}
          />
        </div>
      </Link>
      <div className="space-y-2 text-sm">
        <Link href={`/music/${album.slug}`}>
          <h3 className="font-semibold leading-none">{album.name}</h3>
        </Link>
        <Link href={`/@${album.artistUsername}`} className="text-xs text-muted-foreground hover:underline inline-flex">
          {album.artist}
        </Link>
      </div>
    </div>
  )
}
