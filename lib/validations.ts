export const emailValidation = {
  required: "Email is required",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  },
};

export const passwordValidation = {
  required: "Password is required",
  minLength: {
    value: 8,
    message: "Password must be at least 8 characters",
  },
  validate: {
    hasUpperCase: (value: string) =>
      /[A-Z]/.test(value) || "Password must contain at least 1 uppercase letter",
    hasSpecialChar: (value: string) =>
      /[^A-Za-z0-9]/.test(value) ||
      "Password must contain at least 1 special character",
    noContinuousNumbers: (value: string) =>
      !/\d{3}/.test(value) || "No more than 2 continuous numbers are allowed",
  },
};

export const nameValidation = {
  required: "This field is required",
  minLength: {
    value: 2,
    message: "Must be at least 2 characters",
  },
};
