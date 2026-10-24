import "./avatar.css";

interface AvatarProps {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  name?: string;
  width?: number;
  height?: number;
  loading?: "eager" | "lazy";
  decoding?: "async" | "sync" | "auto";
  fetchPriority?: "high" | "low" | "auto";
  style?: React.CSSProperties;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  srcSet,
  sizes,
  alt,
  name,
  width,
  height,
  loading = "lazy",
  decoding = "async",
  fetchPriority,
  style,
  className = "",
}) => (
  <div className={`avatar mr-5 ${className}`} style={style}>
    <img
      className="avatar-image"
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      draggable={false}
    />
    <div className="avatar-name">{name}</div>
  </div>
);
