import Image from "next/image"
import ProductIllustration from "./ProductIllustration"

export default function ProductImage({
  id,
  imageUrl,
  alt,
  size,
  className,
}: {
  id: string
  imageUrl: string
  alt: string
  size: number
  className?: string
}) {
  const isLocal = imageUrl.startsWith("/")

  if (isLocal) {
    return (
      <Image
        src={imageUrl}
        alt={alt}
        width={size}
        height={size}
        className={className}
        style={{ objectFit: "contain" }}
      />
    )
  }

  return <ProductIllustration type={id} size={size} />
}
