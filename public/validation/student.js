exports.Signup = (data) => {
  let iserror = false;
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

  let firstname_error = "",
    lastname_error = "",
    email_error = "",
    password_error = "",
    confirm_password_error = "",
    schoolid_error = "",
    mobile_error = "",
    teachername_error = "",
    classname_error = "",
    enrollmentnumber_error = "",
    error = "";

  if (!data.firstname) {
    firstname_error = "Enter your first name";
    error += ", Enter your first name";
    iserror = true;
  }
  if (!data.lastname) {
    lastname_error = "Enter your last name";
    error += ", Enter your last name";
    iserror = true;
  }
  if (!emailReg.test(data.email) || data.email == "") {
    email_error = "Enter a valid email";
    error += ", Enter a valid email";
    iserror = true;
  }

  if (!data.password) {
    password_error = "Enter your password";
    error += ", Enter your password";
    iserror = true;
  } else if (data.password != data.confirmpassword) {
    confirm_password_error = "password and confirm password must be same";
    error += ", password and confirm password must be same";
    iserror = true;
  }
  // if (!data.countrycode) {
  //   countrycode_error = "Please select your country code";
  //   error += ", Please select your country code";
  //   iserror = true;
  // }
  if (!data.mobile) {
    mobile_error = "Enter your mobile no.";
    error += ", Enter your mobile no.";

    if (parseInt(data.mobile) && parseInt(data.mobile).toString().length > 14) {
      mobile_error = "Mobile no. can not be greater than 13 number";
      error += ", Mobile no. can not be greater than 13 number";
    }
    if (parseInt(data.mobile) && parseInt(data.mobile).toString().length < 6) {
      mobile_error = "Mobile no. can not be less than 6 number";
      error += ", Mobile no. can not be less than 6 number";
    }
    iserror = true;
  }
  if (!data.schoolid || data.schoolid == 0) {
    schoolid_error = "Please select your school";
    error += ", Please select your school";
    iserror = true;
  }

  if (!data.teacherid || data.teacherid == 0) {
    teachername_error = "Please select your teacher";
    error += ", Please select your teacher";
    iserror = true;
  }
  if (!data.classid || data.teacherid == 0) {
    classname_error = "Please select your class";
    error += ", Please select your class";
    iserror = true;
  }
  if (!data.enrollmentnumber) {
    enrollmentnumber_error = "Enter your Enrollment number";
    error += ", Enter your Enrollment number";
    iserror = true;
  }

  if (iserror) {
    return error.substr(1);
  } else {
    return iserror;
  }
  s;
};
