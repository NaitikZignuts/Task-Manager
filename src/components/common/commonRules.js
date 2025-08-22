export const RequiredRules = {
  required: {
    value: true,
    message: "Field is required"
  }
}

export const TitleRules = {
  required: 'Title is required',
  minLength: {
    value: 3,
    message: 'Title must be at least 3 characters'
  }
}

export const EmailRules = {
  required: 'Email is required',
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Enter a valid email address'
  }
}

export const PasswordRules = {
  required: 'Password is required',
  minLength: {
    value: 8,
    message: 'Password must be at least 8 characters'
  }
}