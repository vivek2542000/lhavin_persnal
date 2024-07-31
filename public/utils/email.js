const nodemailer = require("nodemailer");
//const Email = require('../models/emailModel');
var smtpTransport = require("nodemailer-smtp-transport");
const sendEmail = async (options) => {
  try {
    // await db.query("SELECT FROM email WHERE id=?", [1], (error, rows) => {
    //   console.log(rows);
    // });
    await db.query("SELECT * from email WHERE id=1", async (error, rows) => {
      //console.log(rows);

      // let host = `${rows[0].host}` || "mail.lhavin.com";
      // let user = `${rows[0].email}` || "accounts@lhavin.com";
      // let pass = `${rows[0].password}` || "Adminpas$123";

      let host = "smtp.gmail.com";
      let user = "lhavin7@gmail.com";
      let pass = "clbwiyybnembnybj";

      // return
      var transporter = nodemailer.createTransport(
        smtpTransport({
          host: host,
          //tls: { rejectUnauthorized: true },
          //  secureConnection: true,
          port: 465,
          auth: {
            user: user,
            pass: pass,
          },
        })
      );

      //2 define email options
      const mailOptions = {
        from: `L'havin Connect <${user}>`,
        cc: ["bmindell@cojds.org"],
        to: [options.email, "ehochbaum@cojds.org"],
        subject: options.subject,
        html: options.message,
      };
      //3 Actually send the email
      await transporter.sendMail(mailOptions);
    });
  } catch (e) {
    console.log("Erroremail", e);
  }
};

module.exports = sendEmail;
