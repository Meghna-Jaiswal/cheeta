module.exports = getEmailString = async (
  email,
  emailToken,
) => {

  let emailString =
    '<head><style type="text/css" title="x-apple-mail-formatting"></style>' +
    '<meta name="viewport" content="width = 375, initial-scale = -1">' +
    '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">' +
    '<meta charset="UTF-8">' +
    "<title></title><style>" +
    /* -------------------------------------

		RESPONSIVENESS

		!importants in here are necessary :/

		------------------------------------- */

    "@media only screen and (max-device-width: 700px) { .table-wrapper { margin-top: 0px !important; border-radius: 0px !important; } .header { border-radius: 0px !important; } } </style>" +
    "</head>" +
    '<body style="-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:none;margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;font-size:100%;line-height:1.6">' +
    '<table style="background: #F5F6F7;" width="100%" cellpadding="0" cellspacing="0">' +
    "<tbody><tr>" +
    "<td>" +
    '<table cellpadding="0" cellspacing="0" class="table-wrapper" style="margin:auto;margin-top:50px;border-radius:7px;-webkit-border-radius:7px;-moz-border-radius:7px;max-width:700px !important;box-shadow:0 8px 20px #e3e7ea !important;-webkit-box-shadow:0 8px 20px #e3e7ea !important;-moz-box-shadow:0 8px 20px #e3e7ea !important;box-shadow: 0 8px 20px #e3e7ea !important; -webkit-box-shadow: 0 8px 20px #e3e7ea !important; -moz-box-shadow: 0 8px 20px #e3e7ea !important;">' +
    "<tbody><tr>" +
    '<td><div style="background-color: #a4508b !important;background-image: linear-gradient(326deg, #a4508b 0%, #5f0a87 74%)  !important; max-height: 120px !important;">' +
    //`<img src=${appIcon} style="width: 120px !important;height: 120px !important;min-width: 120px !important;min-height: 120px !important;">` +
    "</div></td>" +
    "</tr>" +
    "<tr>" +
    '<td class="containers content" bgcolor="#FFFFFF" style="padding:35px 40px;border-bottom-left-radius:6px;border-bottom-right-radius:6px;display:block !important;margin:0 auto !important;clear:both !important">' +
    '<div class="content-box" style="max-width:600px;margin:0 auto;display:block">';

  let emailContent = "";
    emailContent =
      '<h1 style="font-family:&quot;Helvetica Neue&quot;, Helvetica, Arial, &quot;Lucida Grande&quot;, sans-serif;margin-bottom:15px;color:#47505E;margin:0px 0 10px;line-height:1.2;font-weight:200;font-size:28px;font-weight:bold;margin-bottom:30px">' +
      "Hi " +
      email +
      " ," +
      "</h1>" +
      '<p style="font-weight:normal;padding:0;font-family:&quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;line-height:1.7;margin-bottom:1.3em;font-size:15px;color:#47505E">' +
      "Here is your email verification code : " +
      emailToken +
      "</p>" +
      '<br/><p style="font-weight:normal;padding:0;font-family:&quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;line-height:1.7;margin-bottom:1.3em;font-size:15px;color:#47505E">' +
      "Use this code to verify your email." + `</p>`;
  
  emailString = emailString + emailContent;
  emailString =
    emailString +
    '<script type="application/ld+json">{"@context":"http://schema.org","@type":"EmailMessage","potentialAction":{"@type":"ConfirmAction","name":"Confirm Email","handler":{"@type":"HttpActionHandler","url":"http://sso.teachable.com/secure/teachable_accounts/confirmation?confirmation_token=4dNuyAZNQin-Sfq48uB4"}}}</script>' +
    "</div>" +
    "</td>" +
    "<td>" +
    "</td>" +
    "</tr>" +
    "</tbody></table>" +
    "</td>" +
    "</tr>" +
    "</tbody></table>" +
    "</body>";

  return emailString;
}