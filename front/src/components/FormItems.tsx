import type { ChangeEvent } from "react";

interface PropsLabel {
  label: string;
  id: string;
  className?: string;
}

interface PropsInput {
  type: string;
  id: string;
  placeholder: string;
  className?: string;
  onChange: (name: string, value: string) => void;
}

interface PropsButton {
  type: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  title: string;
}

interface PropsHeading {
  title: string;
  className?: string;
}

export const Heading = ({ title, className }: PropsHeading) => {
  return (
    <h3 className={`text-gray-900 text-xl font-bold text-center ${className}`}>
      {title}
    </h3>
  );
};

export const Label = ({ id, label, className }: PropsLabel) => {
  return (
    <label
      htmlFor={id}
      className={`block mb-2 text-sm font-medium text-gray-900 ${className}`}
    >
      {label}
    </label>
  );
};

export const Input = ({
  type,
  id,
  className,
  placeholder,
  onChange,
}: PropsInput) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    onChange(name, value);
  };

  return (
    <input
      type={type}
      id={id}
      name={id}
      className={`shadow-sm border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none ${className}`}
      placeholder={placeholder}
      onChange={handleChange}
      required
    />
  );
};

export const Button = ({
  type,
  className,
  disabled = false,
  title,
}: PropsButton) => {
  return (
    <button
      type={type}
      className={`text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-200 ${className}`}
      disabled={disabled}
    >
      {title}
    </button>
  );
};
