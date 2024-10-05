import mailjet from "node-mailjet";
import { ApiError, Message } from "../error/index.js";

const mailer = mailjet.apiConnect(
  process.env.MAIL_APIKEY_PUBLIC,
  process.env.MAIL_APIKEY_PRIVATE
);
const CLIENT_URL = process.env.CLIENT_URL;

export const MailService = {
  sendVerificationCode(email, code, isEmailChange) {
    sendEmail({
      toEmail: email,
      subject: "Email verification",
      body: `
      ${isEmailChange ? "" : "<h3>Welcome to My Project Manager!</h3><br />"}
      <p>
      Please follow this <a href="${getVerificationLink(
        code
      )}">link</a> to verify your email.
      <br /><br />
      If you recieved this email by mistake, please ignore it.
      </p>`,
    });
  },

  sendPasswordRestoreCode(email, code) {
    sendEmail({
      toEmail: email,
      subject: "Password recovery",
      body: `<p>
      You recieved this email because someone tried to reset password at <a href="${CLIENT_URL}">${CLIENT_URL}</a>
      <br />
      If it was you, please follow this <a href="${getPasswordRestoreLink(
        code
      )}">link</a> to reset your password.
      <br />
      Otherwise ignore it.
      </p>`,
    });
  },
};

const sendEmail = ({ toEmail, toName, subject, body }) => {
  if (!toEmail || !subject || !body)
    throw ApiError.internal(
      Message.required([
        !toEmail && "toEmail",
        !subject && "subject",
        !body && "body",
      ])
    );

  const request = mailer.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "kaa88@alwaysdata.net",
          Name: "My Project Manager",
        },
        To: [{ Email: toEmail, Name: toName || toEmail }],
        Subject: subject,
        HTMLPart: body,
        CustomCampaign: "Service_codes",
      },
    ],
  });
  request
    // .then((result) => {
    //   console.log(result.body);
    // })
    .catch((err) => {
      console.log(`Error sending email: ${err.statusCode}`);
    });
};

const getVerificationLink = (code) =>
  `${CLIENT_URL}/email_verification/${code}`;
const getPasswordRestoreLink = (code) =>
  `${CLIENT_URL}/password_recovery/${code}`;
