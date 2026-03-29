interface ButtonProps {
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  style,
  className,
}) => (
  <div className="w-full flex flex-col gap-2 items-center">
    <button
      style={style}
      className={`w-full bg-surround px-6 py-2 rounded-lg text-text-nav shadow min-h-15 font-semibold flex items-center justify-center ${className || "text-base md:text-xl lg:text-2xl"}`}
      onClick={onClick}
    >
      {children}
    </button>
  </div>
);
