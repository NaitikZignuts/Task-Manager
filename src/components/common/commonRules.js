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
  },
  validate: {
    notOnlyWhitespace: (value) => {
      if (!value || value.trim().length === 0) {
        return 'Title cannot be empty or contain only spaces';
      }
      if (value.trim().length < 3) {
        return 'Title must be at least 3 non-whitespace characters';
      }
      return true;
    }
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

export const DescriptionRules = {
  required: 'Description is required',
  minLength: {
    value: true,
    message: 'Description must be at least 5 characters'
  },
  validate: {
    notOnlyWhitespace: (value) => {
      if (!value || value.trim().length === 0) {
        return 'Description cannot be empty or contain only spaces';
      }
      return true;
    }
  }
}