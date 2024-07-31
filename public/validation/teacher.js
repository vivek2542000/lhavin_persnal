exports.Signup = (data) => {
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  const errors = {
    firstname: "Enter your first name",
    lastname: "Enter your last name",
    email: "Enter a valid email",
    password: "Enter your password",
    confirm_password: "Password and confirm password must be the same",
    schoolid: "Please select your school",
    workbooks: "Select your work books name",
    books: "Enter your books name",
  };
  const errorMessages = [];

  if (!data.firstname) {
    errorMessages.push(errors.firstname);
  }

  if (!data.lastname) {
    errorMessages.push(errors.lastname);
  }

  if (!data.email || !emailReg.test(data.email)) {
    errorMessages.push(errors.email);
  }

  if (!data.password) {
    errorMessages.push(errors.password);
  }

  if (data.password !== data.confirmpassword) {
    errorMessages.push(errors.confirm_password);
  }

  if (data.schoolid === "0") {
    errorMessages.push(errors.schoolid);
  }

  if (data.workbooks === "0") {
    errorMessages.push(errors.workbooks);
  }

  if (!data.books) {
    errorMessages.push(errors.books);
  }

  if (data.books === "0") {
    errorMessages.push(errors.books);
  }

  if (errorMessages.length > 0) {
    return errorMessages.join(",");
  }
  return false;
};
