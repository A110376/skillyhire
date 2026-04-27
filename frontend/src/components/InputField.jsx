import React from "react";

const InputField = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  Icon,
  required = false,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-gray-700 mb-1 font-medium">
        {label}
      </label>
      <div className="relative text-gray-600 focus-within:text-indigo-600">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="block w-full appearance-none rounded-xl border border-gray-300 px-5 py-3 pr-12 text-base placeholder-gray-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-600 transition"
        />
        {Icon && (
          <Icon className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400" />
        )}
      </div>
    </div>
  );
};

export default InputField;
