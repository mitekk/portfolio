import "./avatar.css";

interface AvatarProps {
  src: string;
  alt: string;
  name?: string;
  width?: number;
  height?: number;
  loading?: "eager" | "lazy";
  decoding?: "async" | "sync" | "auto";
  style?: React.CSSProperties;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  width,
  height,
  loading = "lazy",
  decoding = "async",
  style,
  className = "",
}) => (
  <div className={`avatar mr-5 ${className}`} style={style}>
    <img
      className="avatar-image"
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding={decoding}
      draggable={false}
    />
    <div className="avatar-name">{name}</div>
  </div>
);
