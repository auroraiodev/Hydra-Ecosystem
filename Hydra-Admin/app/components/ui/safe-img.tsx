import Image from 'next/image';
import { isSafeImageUrl } from '@/lib/sanitize';
import { resolveImageUrl } from '@/lib/utils/imageUrl';
import type { ImageProps } from 'next/image';

interface SafeImgProps extends Omit<ImageProps, 'src' | 'alt'> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
}

export function SafeImg({
  src,
  fallback = null,
  alt = '',
  width,
  height,
  fill,
  quality,
  priority,
  placeholder,
  blurDataURL,
  loading,
  unoptimized,
  className,
  style,
  id,
  onLoad,
  onError,
}: SafeImgProps) {
  const resolvedSrc = resolveImageUrl(src);
  if (!isSafeImageUrl(resolvedSrc)) return <>{fallback}</>;
  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      sizes="100vw"
      width={width}
      height={height}
      fill={fill}
      quality={quality}
      priority={priority}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      loading={loading}
      unoptimized={unoptimized}
      className={className}
      style={style}
      id={id}
      onLoad={onLoad}
      onError={onError}
    />
  );
}
