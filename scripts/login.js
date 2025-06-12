class FormValidator {
  constructor(form) {
    this.form = form;
    this.id = form.querySelector("#id");
    this.password = form.querySelector("#password");
  }

  validate() {
    return this.validateId() && this.validatePassword();
  }

  validateId() {
    const id = this.id.value;
    if (id == "") {
      alert("Please enter your ID number.");
      return false;
    } else if (id.length < 5) {
      alert("ID number must be at least 5 digits.");
      return false;
    } else if (!/^\d+$/.test(id)) {
      alert("ID number must contain only digits.");
      return false;
    }
    return true;
  }

  validatePassword() {
    const password = this.password.value;
    if (password == "") {
      alert("Please enter your password.");
      return false;
    } else if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return false;
    } else if (password.length > 16) {
      alert("Password must not exceed 16 characters.");
      return false;
    } else if (!/[A-Z]/.test(password)) {
      alert("Password must contain at least one uppercase letter.");
      return false;
    } else if (!/[a-z]/.test(password)) {
      alert("Password must contain at least one lowercase letter.");
      return false;
    } else if (!/\d/.test(password)) {
      alert("Password must contain at least one digit.");
      return false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      alert("Password must contain at least one special character.");
      return false;
    }
    return true;
}}
