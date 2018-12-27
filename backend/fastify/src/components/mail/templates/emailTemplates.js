const Appointment = require("../../appointment/Appointment");
const moment = require("moment");
const config = require("../../../config/config");

const formatBrazilianPhoneNumber = phone => {
  if (phone.length === 11) {
    let _number = `(${phone[0]}${phone[1]}) ${phone[2]}${phone[3]}${phone[4]}${
      phone[5]
    }${phone[6]}-${phone[7]}${phone[8]}${phone[9]}${phone[10]}`;

    return _number;
  } else if (phone.length === 10) {
    let _number = `(${phone[0]}${phone[1]}) ${phone[2]}${phone[3]}${phone[4]}${
      phone[5]
    }-${phone[6]}${phone[7]}${phone[8]}${phone[9]}`;

    return _number;
  } else {
    return phone;
  }
};

exports.newAppointment = async confirmationId => {
  let appointment = await Appointment.aggregate([
    {
      $match: {
        confirmationId: confirmationId
      }
    },
    {
      $lookup: {
        from: "costumers",
        localField: "costumer",
        foreignField: "_id",
        as: "costumer"
      }
    },
    {
      $lookup: {
        from: "companies",
        localField: "company",
        foreignField: "_id",
        as: "company"
      }
    },
    {
      $lookup: {
        from: "employees",
        localField: "employee",
        foreignField: "_id",
        as: "employee"
      }
    },
    {
      $lookup: {
        from: "services",
        localField: "service",
        foreignField: "_id",
        as: "service"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "employee.user",
        foreignField: "_id",
        as: "employee.user"
      }
    },
    {
      $unwind: {
        path: "$employee"
      }
    },
    {
      $unwind: {
        path: "$costumer"
      }
    },
    {
      $unwind: {
        path: "$company"
      }
    },
    {
      $unwind: {
        path: "$employee.user"
      }
    },
    {
      $unwind: {
        path: "$service"
      }
    },
    {
      $project: {
        confirmationId: 1,
        start: 1,
        end: 1,
        "costumer.firstName": 1,
        "costumer.lastName": 1,
        "costumer.email": 1,
        "employee.user.firstName": 1,
        "employee.user.lastName": 1,
        "service.desc": 1,
        "company.companyNickname": 1,
        "company.email": 1,
        "company.website": 1,
        "company.phone": 1,
        "company.address": 1,
        "company.settings.appointment.rules": 1
      }
    }
  ]).exec();

  text = `${appointment[0].company.companyNickname}
=================================================


Olá, ${appointment[0].costumer.firstName}!
Seu agendamento foi concluído com sucesso.

Verifique as informações a seguir.
Qualquer dúvida entre em contato com ${appointment[0].company.companyNickname}
através de um dos meios informados.


Serviços agendados
------------------
`;

  appointment.forEach(appointment => {
    text += `
${appointment.service.desc}
Com ${appointment.employee.user.firstName +
      " " +
      appointment.employee.user.lastName}
${moment(appointment.start).format("DD [de] MMMM [de] YYYY")}
De ${moment(appointment.start).format("HH:mm")} às ${moment(
      appointment.end
    ).format("HH:mm")}
    `;
  });

  text += `

Sobre nossa empresa
-------------------

${appointment[0].company.address.street} - ${
    appointment[0].company.address.number
  }
${appointment[0].company.address.neighborhood}
${appointment[0].company.address.city} - ${appointment[0].company.address.state}

`;

  appointment[0].company.phone.forEach(phone => {
    text += `${formatBrazilianPhoneNumber(phone.number)}\n`;
  });

  text += `
${appointment[0].company.email}
${appointment[0].company.website}


Observações
-----------

`;
  appointment[0].company.settings.appointment.rules.forEach(rule => {
    text += `- ${rule}\n`;
  });

  text += `

Para cancelar o agendamento:
${config.baseURI}/appointment/cancel/${appointment[0].confirmationId}/${
    appointment[0].costumer.email
  }
  
Ou entre em contato com a empresa.


www.bukk.com.br
Todos os direitos reservados`;

  html = `<!DOCTYPE html>
  <html
    lang="en"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office"
  >
    <head>
      <meta charset="utf-8" />
      <!-- utf-8 works for most cases -->
      <meta name="viewport" content="width=device-width" />
      <!-- Forcing initial-scale shouldn't be necessary -->
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <!-- Use the latest (edge) version of IE rendering engine -->
      <meta name="x-apple-disable-message-reformatting" />
      <!-- Disable auto-scale in iOS 10 Mail entirely -->
      <title></title>
      <!-- The title tag shows in email notifications, like Android 4.4. -->
  
      <!-- Web Font / @font-face : BEGIN -->
      <!-- NOTE: If web fonts are not required, lines 10 - 27 can be safely removed. -->
  
      <!-- Desktop Outlook chokes on web font references and defaults to Times New Roman, so we force a safe fallback font. -->
      <!--[if mso]>
        <style>
          * {
            font-family: sans-serif !important;
          }
        </style>
      <![endif]-->
  
      <!-- All other clients get the webfont reference; some will render the font and others will silently fail to the fallbacks. More on that here: http://stylecampaign.com/blog/2015/02/webfont-support-in-email/ -->
      <!--[if !mso]><!-->
      <!-- insert web font reference, eg: <link href='https://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'> -->
      <!--<![endif]-->
  
      <!-- Web Font / @font-face : END -->
  
      <!-- CSS Reset : BEGIN -->
      <style>
        /* What it does: Remove spaces around the email design added by some email clients. */
        /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
        html,
        body {
          margin: 0 auto !important;
          padding: 0 !important;
          height: 100% !important;
          width: 100% !important;
        }
  
        /* What it does: Stops email clients resizing small text. */
        * {
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
        }
  
        /* What it does: Centers email on Android 4.4 */
        div[style*="margin: 16px 0"] {
          margin: 0 !important;
        }
  
        /* What it does: Stops Outlook from adding extra spacing to tables. */
        table,
        td {
          mso-table-lspace: 0pt !important;
          mso-table-rspace: 0pt !important;
        }
  
        /* What it does: Fixes webkit padding issue. Fix for Yahoo mail table alignment bug. Applies table-layout to the first 2 tables then removes for anything nested deeper. */
        table {
          border-spacing: 0 !important;
          border-collapse: collapse !important;
          table-layout: fixed !important;
          margin: 0 auto !important;
        }
        table table table {
          table-layout: auto;
        }
  
        /* What it does: Uses a better rendering method when resizing images in IE. */
        img {
          -ms-interpolation-mode: bicubic;
        }
  
        /* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
        a {
          text-decoration: none;
        }
  
        /* What it does: A work-around for email clients meddling in triggered links. */
        *[x-apple-data-detectors],  /* iOS */
          .unstyle-auto-detected-links *,
          .aBn {
          border-bottom: 0 !important;
          cursor: default !important;
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
        }
  
        /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
        .a6S {
          display: none !important;
          opacity: 0.01 !important;
        }
  
        /* What it does: Prevents Gmail from changing the text color in conversation threads. */
        .im {
          color: inherit !important;
        }
  
        /* If the above doesn't work, add a .g-img class to any image in question. */
        img.g-img + div {
          display: none !important;
        }
  
        /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
        /* Create one of these media queries for each additional viewport size you'd like to fix */
  
        /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
        @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
          u ~ div .email-container {
            min-width: 320px !important;
          }
        }
        /* iPhone 6, 6S, 7, 8, and X */
        @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
          u ~ div .email-container {
            min-width: 375px !important;
          }
        }
        /* iPhone 6+, 7+, and 8+ */
        @media only screen and (min-device-width: 414px) {
          u ~ div .email-container {
            min-width: 414px !important;
          }
        }
      </style>
      <!-- CSS Reset : END -->
      <!-- Reset list spacing because Outlook ignores much of our inline CSS. -->
      <!--[if mso]>
        <style type="text/css">
          ul,
          ol {
            margin: 0 !important;
          }
          li {
            margin-left: 30px !important;
          }
          li.list-item-first {
            margin-top: 0 !important;
          }
          li.list-item-last {
            margin-bottom: 10px !important;
          }
        </style>
      <![endif]-->
  
      <!-- Progressive Enhancements : BEGIN -->
      <style>
        /* What it does: Hover styles for buttons */
        .button-td,
        .button-a {
          transition: all 100ms ease-in;
        }
        .button-td-primary:hover,
        .button-a-primary:hover {
          background: #d81159 !important;
          border-color: #d81159 !important;
          color: #fff !important;
        }
  
        /* Media Queries */
        @media screen and (max-width: 600px) {
          /* What it does: Adjust typography on small screens to improve readability */
          .email-container p {
            font-size: 17px !important;
          }
        }
      </style>
      <!-- Progressive Enhancements : END -->
  
      <!-- What it does: Makes background images in 72ppi Outlook render at correct size. -->
      <!--[if gte mso 9]>
        <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG /> <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      <![endif]-->
    </head>
    <!--
    The email background color (#222222) is defined in three places:
    1. body tag: for most email clients
    2. center tag: for Gmail and Inbox mobile apps and web versions of Gmail, GSuite, Inbox, Yahoo, AOL, Libero, Comcast, freenet, Mail.ru, Orange.fr
    3. mso conditional: For Windows 10 Mail
  -->
    <body
      width="100%"
      style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #FFF; font-family: sans-serif"
      ;
    >
      <center style="width: 100%; background-color: #fcfcfc;">
        <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #222222;">
      <tr>
      <td>
      <![endif]-->
  
        <!-- Visually Hidden Preheader Text : BEGIN -->
        <div
          style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;"
        >
          Olá, ${
            appointment[0].costumer.firstName
          }. Seu agendamento foi concluído com sucesso.
        </div>
        <!-- Visually Hidden Preheader Text : END -->
  
        <!-- Create white space after the desired preview text so email clients don’t pull other distracting text into the inbox preview. Extend as necessary. -->
        <!-- Preview Text Spacing Hack : BEGIN -->
        <div
          style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;"
        >
          &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
        </div>
        <!-- Preview Text Spacing Hack : END -->
  
        <!--
              Set the email width. Defined in two places:
              1. max-width for all clients except Desktop Windows Outlook, allowing the email to squish on narrow but never go wider than 600px.
              2. MSO tags for Desktop Windows Outlook enforce a 600px width.
          -->
        <div style="max-width: 600px; margin: 0 auto;" class="email-container">
          <!--[if mso]>
              <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600">
              <tr>
              <td>
              <![endif]-->
  
          <!-- Email Body : BEGIN -->
          <table
            align="center"
            role="presentation"
            cellspacing="0"
            cellpadding="0"
            border="0"
            width="100%"
            style="margin: 0 auto;"
          >
            <!-- Email Header : BEGIN -->
            <tr style="background-color: #800080">
              <td style="padding: 20px 0; text-align: center">
                <img
                  src="https://res.cloudinary.com/bukkapp/image/upload/v1542735688/Bukk/Assets/logo.png"
                  alt="alt_text"
                  border="0"
                  style="height: auto; font-family: sans-serif; font-size: 15px; line-height: 15px; color: #555555; max-width: 300px;"
                />
              </td>
            </tr>
            <!-- Email Header : END -->
  
            <!-- Hero Image, Flush : BEGIN -->
            <tr>
              <td
                style="background-color: #ffffff; text-align: center; padding: 40px 0 10px 0"
              >
                <img
                  src="https://res.cloudinary.com/bukkapp/image/upload/v1545250915/Bukk/Assets/Email/001-calendar.png"
                  width="128"
                  alt="alt_text"
                  border="0"
                  style="width: 128px; max-width: 600px; height: auto; font-family: sans-serif; font-size: 15px; line-height: 15px; color: #555555; margin: auto; opacity: .8"
                  class="g-img"
                />
              </td>
            </tr>
            <!-- Hero Image, Flush : END -->
  
            <!-- 1 Column Text + Button : BEGIN -->
            <tr>
              <td style="background-color: #ffffff;">
                <table
                  role="presentation"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  width="100%"
                >
                  <tr>
                    <td
                      style="padding: 20px; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555;"
                    >
                      <h1
                        style="margin: 0 0 10px 0; font-family: sans-serif; font-size: 25px; line-height: 30px; color: #333333; font-weight: normal;"
                      >
                        Olá, ${
                          appointment[0].costumer.firstName
                        }!<br />Seu agendamento foi concluído
                        com&nbsp;sucesso
                      </h1>
                      <p style="margin: 0; color: #555;">
                        Verifique as informações a seguir.<br />Qualquer dúvida entre em contato com <strong>
                        ${
                          appointment[0].company.companyNickname
                        }</strong><br />através de um dos meios&nbsp;informados.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="padding: 10px 0 0 20px; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555;"
                    >
                      <h2
                        style="margin: 0 0 0px 0; font-family: sans-serif; font-size: 18px; line-height: 22px; color: #666; font-weight: 400;"
                      >
                        Serviços&nbsp;agendados
                      </h2>
                    </td>
                  </tr>`;

  appointment.forEach(appointment => {
    html += `<tr>
    <td
      style="padding: 10px 20px; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555;"
    >
        <p style="margin: 0; color: #555; font-weight: 700">${
          appointment.service.desc
        }</p>
        <p style="margin: 0; color: #555">Com ${appointment.employee.user
          .firstName +
          " " +
          appointment.employee.user.lastName}</p>
        <p style="margin: 0; color: #555">${moment(appointment.start).format(
          "DD [de] MMMM [de] YYYY"
        )}</p>
        <p style="margin: 0; color: #555">De ${moment(appointment.start).format(
          "HH:mm"
        )} às ${moment(appointment.end).format("HH:mm")}</p>
      </td>
    </tr>`;
  });

  html += `
                  <tr>
                    <td
                      style="padding: 20px 0 0 20px; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555;"
                    >
                      <h2
                        style="margin: 0 0 10px 0; font-family: sans-serif; font-size: 18px; line-height: 22px; color: #666; font-weight: 400;"
                      >
                        Sobre nossa&nbsp;empresa
                      </h2>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="padding: 0 20px; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555;"
                    >
                      <p style="margin: 0; color: #555">${
                        appointment[0].company.address.street
                      } - ${appointment[0].company.address.number}<br />
                      ${appointment[0].company.address.neighborhood}<br />${
    appointment[0].company.address.city
  } - ${appointment[0].company.address.state}<br /><br /></p>
  `;

  appointment[0].company.phone.forEach(phone => {
    html += `<p style="margin: 0; color: #555">${formatBrazilianPhoneNumber(
      phone.number
    )}</p>`;
  });

  html += `

                      <p style="margin: 0; color: #555">${
                        appointment[0].company.email
                      }</p>
                      <p style="margin: 0; color: #555">${
                        appointment[0].company.website
                      }</p>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="padding: 40px 0 0 20px; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555;"
                    >
                      <h2
                        style="margin: 0 0 10px 0; font-family: sans-serif; font-size: 18px; line-height: 22px; color: #666; font-weight: 400;"
                      >
                        Observações
                      </h2>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="padding: 0 20px; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555;"
                    >
                      <ul style="margin: 0">
                        `;

  appointment[0].company.settings.appointment.rules.forEach(rule => {
    html += `<li style="margin: 0; color: #555">
                          ${rule}
                        </li>`;
  });

  html += `
                      </ul>
                      <p>&nbsp;</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- 1 Column Text + Button : END -->
  
            <!-- Clear Spacer : BEGIN -->
            <tr>
              <td
                aria-hidden="true"
                height="40"
                style="font-size: 0px; line-height: 0px;"
              >
                &nbsp;
              </td>
            </tr>
            <!-- Clear Spacer : END -->
  
            <!-- 1 Column Text : BEGIN -->
            <tr>
              <td style="background-color: #ffffff;">
                <table
                  role="presentation"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  width="100%"
                >
                  <tr>
                    <td
                      style="padding: 20px 0 5px 0; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555; text-align: center"
                    >
                      <p style="margin: 0;">Caso queira cancelar o agendamento</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0 20px 0;">
                      <!-- Button : BEGIN -->
                      <table
                        align="center"
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        style="margin: auto;"
                      >
                        <tr>
                          <td
                            class="button-td button-td-primary"
                            style="border-radius: 4px; background: #D81159;"
                          >
                            <a
                              class="button-a button-a-primary"
                              href="${config.baseURI}/appointment/cancel/${
    appointment[0].confirmationId
  }/${appointment[0].costumer.email}"
                              style="border: 2px solid #D81159; background: #FFF; font-family: sans-serif; font-size: 15px; line-height: 15px; text-decoration: none; padding: 13px 17px; color: #D81159; display: block; border-radius: 4px; font-weight: 700"
                              >Cancelar agendamento</a
                            >
                          </td>
                        </tr>
                      </table>
  
                      <!-- Button : END -->
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- 1 Column Text : END -->
          </table>
  
          <!-- Email Body : END -->
  
          <!-- Email Footer : BEGIN -->
          <table
            align="center"
            role="presentation"
            cellspacing="0"
            cellpadding="0"
            border="0"
            width="100%"
            style="margin: 0 auto;"
          >
            <tr>
              <td
                style="padding: 20px; font-family: sans-serif; font-size: 12px; line-height: 15px; text-align: center; color: #888888;"
              >
                <br /><br />
                <a href="#" style="color: #800080">Bukk Agendador</a><br /><span
                  class="unstyle-auto-detected-links"
                  >Todos os direitos reservados<br />
                </span>
                <br /><br />
              </td>
            </tr>
          </table>
  
          <!-- Email Footer : END -->
  
          <!--[if mso]>
              </td>
              </tr>
              </table>
              <![endif]-->
        </div>
  
        <!-- Full Bleed Background Section : BEGIN -->
        <table
          role="presentation"
          cellspacing="0"
          cellpadding="0"
          border="0"
          width="100%"
          style="background-color: #023618;"
        >
          <tr>
            <td valign="top">
              <div
                align="center"
                style="max-width: 600px; margin: auto;"
                class="email-container"
              >
                <!--[if mso]>
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" align="center">
                          <tr>
                          <td>
                          <![endif]-->
                <table
                  role="presentation"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  width="100%"
                >
                  <tr>
                    <td
                      style="padding: 20px; text-align: left; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #ffffff;"
                    >
                      <p style="margin: 0;">
                        Guarde este email para futuras consultas. Evite imprimir.
                        A natureza agradece :)
                      </p>
                    </td>
                  </tr>
                </table>
  
                <!--[if mso]>
                          </td>
                          </tr>
                          </table>
                          <![endif]-->
              </div>
            </td>
          </tr>
        </table>
  
        <!-- Full Bleed Background Section : END -->
  
        <!--[if mso | IE]>
      </td>
      </tr>
      </table>
      <![endif]-->
      </center>
    </body>
  </html>
  `;

  return { text, html };
};
