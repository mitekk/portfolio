interface ButtonProps {
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, style, className }) => (
  <div className="flex flex-col gap-2 items-center">
    <button
      style={style}
      className={`bg-stone-900 px-6 py-2 rounded-lg text-white shadow min-h-12 md:min-h-16 lg:min-h-20 font-semibold flex items-center justify-center ${className ?? "text-base md:text-xl lg:text-2xl"}`}
      onClick={onClick}
    >
      {children}
    </button>
  </div>
);
