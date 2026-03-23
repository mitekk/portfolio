interface ButtonProps {
  style?: React.CSSProperties;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, style }) => (
  <div className="flex flex-col gap-2 items-center">
    <button
      style={style}
      className={`bg-stone-900 px-6 py-2 rounded-lg text-white shadow min-h-12 md:min-h-16 lg:min-h-20 text-base md:text-xl lg:text-2xl font-semibold flex items-center justify-center`}
      onClick={onClick}
    >
      {children}
    </button>
  </div>
);
