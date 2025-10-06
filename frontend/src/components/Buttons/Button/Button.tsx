import React from "react";
import { ArrowRight } from "lucide-react";

type ButtonProps = {
  title?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  showArrow?: boolean;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
};

const Button: React.FC<ButtonProps> = ({
  title = "Explore Now",
  onClick,
  variant = "primary",
  size = "md",
  icon,
  showArrow = true,
  disabled = false,
  className = "",
  type = "button",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary:
      "bg-amber-700 hover:bg-amber-800 text-white hover:-translate-y-0.5 hover:shadow-lg disabled:hover:translate-y-0 disabled:hover:shadow-none",
    secondary:
      "bg-gray-700 hover:bg-gray-800 text-white hover:-translate-y-0.5 hover:shadow-lg disabled:hover:translate-y-0 disabled:hover:shadow-none",
    outline:
      "border-2 border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white disabled:hover:bg-transparent disabled:hover:text-amber-700",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm rounded-md",
    md: "px-8 py-4 text-base rounded-lg",
    lg: "px-10 py-5 text-lg rounded-xl",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span>{icon}</span>}
      {title}
      {showArrow && (
        <ArrowRight
          className={`${iconSizes[size]} transition-transform duration-300 group-hover:translate-x-1`}
        />
      )}
    </button>
  );
};

export default Button;