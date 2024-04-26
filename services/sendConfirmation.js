const sendConfirmation = async (
  first_name,
  last_name,
  confirmation_link,
  email_recipient
) => {
  const SibApiV3Sdk = require("sib-api-v3-sdk");
  let defaultClient = SibApiV3Sdk.ApiClient.instance;
  let apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey =
    "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";

  // ADD CONTACT IN LIST
  let createContact = new SibApiV3Sdk.CreateContact();
  createContact.email = email_recipient;
  createContact.listIds = [2];
  let templateId = 1;
  // Update email body
  let smtpTemplate = new SibApiV3Sdk.UpdateSmtpTemplate();
  smtpTemplate.sender = {
    name: "moovicar.com",
    email: "louisfatah23@gmail.com",
  };

  smtpTemplate.templateName = "Email de vérification";
  smtpTemplate.htmlContent = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="utf-8">
    <!-- utf-8 works for most cases -->
    <meta name="viewport" content="width=device-width">
    <!-- Forcing initial-scale shouldn't be necessary -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- Use the latest (edge) version of IE rendering engine -->
    <meta name="x-apple-disable-message-reformatting">
    <!-- Disable auto-scale in iOS 10 Mail entirely -->
    <title></title>
    <!-- The title tag shows in email notifications, like Android 4.4. -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">

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
            background: #ffffff;
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

        /* What it does: Fixes webkit padding issue. */

        table {
            border-spacing: 0 !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
            margin: 0 auto !important;
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

        *[x-apple-data-detectors],
        /* iOS */

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

        img.g-img+div {
            display: none !important;
        }

        /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
        /* Create one of these media queries for each additional viewport size you'd like to fix */
        /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */

        @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
            u~div .email-container {
                min-width: 320px !important;
            }
        }

        /* iPhone 6, 6S, 7, 8, and X */

        @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
            u~div .email-container {
                min-width: 375px !important;
            }
        }

        /* iPhone 6+, 7+, and 8+ */

        @media only screen and (min-device-width: 414px) {
            u~div .email-container {
                min-width: 414px !important;
            }
        }
    </style>

    <!-- CSS Reset : END -->

    <!-- Progressive Enhancements : BEGIN -->
    <style>
        .primary {
            background: #29577e;
        }

        .bg_white {
            background: #ffffff;
        }

        .bg_light {
            background: #fafafa;
        }

        .bg_black {
            background: #000000;
        }

        .bg_dark {
            background: rgba(0, 0, 0, .8);
        }

        .email-section {
            padding: 2.5em;
        }

        /*BUTTON*/

        .btn {
            padding: 5px 20px;
            display: inline-block;
        }

        .btn.btn-primary {
            border-radius: 20px;
            background: #29577e;
            color: #ffffff;
        }

        .btn.btn-white {
            border-radius: 5px;
            background: #ffffff;
            color: #000000;
        }

        .btn.btn-white-outline {
            border-radius: 5px;
            background: transparent;
            border: 1px solid #fff;
            color: #fff;
        }

        .btn.btn-black {
            border-radius: 0px;
            background: #000;
            color: #fff;
        }

        .btn.btn-black-outline {
            border-radius: 0px;
            background: transparent;
            border: 2px solid #000;
            color: #000;
            font-weight: 700;
        }

        .btn.btn-custom {
            text-transform: uppercase;
            font-weight: 600;
            font-size: 12px;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            font-family: 'Poppins', sans-serif;
            color: #000000;
            margin-top: 0;
            font-weight: 400;
        }

        body {
            font-family: 'Poppins', sans-serif;
            font-weight: 400;
            font-size: 17px;
            line-height: 1.7;
            color: #212529;
        }

        a {
            color: #002d6b;
        }

        p {
            margin-top: 0;
        }

        table {}

        /*LOGO*/

        .logo h1 {
            margin: 0;
        }

        .logo h1 a {
            color: #000000;
            font-size: 20px;
            font-weight: 700;
            /*text-transform: uppercase;*/
            font-family: 'Poppins', sans-serif;
        }

        .navigation {
            padding: 0;
            padding: 1em 0;
            /*background: rgba(0,0,0,1);*/
            border-top: 1px solid rgba(0, 0, 0, .05);
            border-bottom: 1px solid rgba(0, 0, 0, .05);
            margin-bottom: 0;
        }

        .navigation li {
            list-style: none;
            display: inline-block;
            ;
            margin-left: 5px;
            margin-right: 5px;
            font-size: 14px;
            font-weight: 500;
        }

        .navigation li a {
            color: rgba(0, 0, 0, 1);
        }

        /*HERO*/

        .hero {
            position: relative;
            z-index: 0;
        }

        .hero .overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            content: '';
            width: 100%;
            background: #000000;
            z-index: -1;
            opacity: .2;
        }

        .hero .text {
            color: rgba(255, 255, 255, .9);
            max-width: 50%;
            margin: 0 auto 0;
        }

        .hero .text h2 {
            color: #fff;
            font-size: 34px;
            margin-bottom: 0;
            font-weight: 400;
            line-height: 1.4;
        }

        .hero .text h2 span {
            font-weight: 600;
            color: #ff8b00;
        }

        /*INTRO*/

        .intro {
            position: relative;
            z-index: 0;
        }

        .intro .text {
            color: rgba(0, 0, 0, .3);
        }

        .intro .text h2 {
            color: #000;
            font-size: 34px;
            margin-bottom: 0;
            font-weight: 300;
        }

        .intro .text h2 span {
            font-weight: 600;
            color: #ff8b00;
        }

        /*SERVICES*/

        .services {}

        .text-services {
            padding: 10px 10px 0;
            text-align: center;
        }

        .text-services h3 {
            font-size: 18px;
            font-weight: 400;
        }

        .services-list {
            margin: 0 0 20px 0;
            width: 100%;
        }

        .services-list img {
            float: left;
        }

        .services-list h3 {
            margin-top: 0;
            margin-bottom: 0;
        }

        .services-list p {
            margin: 0;
        }

        /*COUNTER*/

        .counter {
            width: 100%;
            position: relative;
            z-index: 0;
        }

        .counter .overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            content: '';
            width: 100%;
            background: #000000;
            z-index: -1;
            opacity: .3;
        }

        .counter-text {
            text-align: center;
        }

        .counter-text .num {
            display: block;
            color: #ffffff;
            font-size: 34px;
            font-weight: 700;
        }

        .counter-text .name {
            display: block;
            color: rgba(255, 255, 255, .9);
            font-size: 13px;
        }

        /*TOPIC*/

        .topic {
            width: 100%;
            display: block;
            float: left;
            border-bottom: 1px solid rgba(0, 0, 0, .1);
            padding: 1.5em 0;
        }

        .topic .img {
            width: 120px;
            float: left;
        }

        .topic .text {
            width: calc(100% - 150px);
            padding-left: 20px;
            float: left;
        }

        .topic .text h3 {
            font-size: 20px;
            margin-bottom: 15px;
            line-height: 1.2;
        }

        .topic .text .meta {
            margin-bottom: 10px;
        }

        /*HEADING SECTION*/

        .heading-section {}

        .heading-section h2 {
            color: #000000;
            font-size: 28px;
            margin-top: 0;
            line-height: 1.4;
            font-weight: 400;
        }

        .heading-section .subheading {
            margin-bottom: 20px !important;
            display: inline-block;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: rgba(0, 0, 0, .4);
            position: relative;
        }

        .heading-section .subheading::after {
            position: absolute;
            left: 0;
            right: 0;
            bottom: -10px;
            content: '';
            width: 100%;
            height: 2px;
            background: #ff8b00;
            margin: 0 auto;
        }

        .heading-section-white {
            color: rgba(255, 255, 255, .8);
        }

        .heading-section-white h2 {
            font-family: line-height: 1;
            padding-bottom: 0;
        }

        .heading-section-white h2 {
            color: #ffffff;
        }

        .heading-section-white .subheading {
            margin-bottom: 0;
            display: inline-block;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: rgba(255, 255, 255, .4);
        }

        ul.social {
            padding: 0;
        }

        ul.social li {
            display: inline-block;
            margin-right: 10px;
            /*border: 1px solid #ff8b00;*/
            padding: 10px;
            border-radius: 50%;
            background: rgba(0, 0, 0, .05);
        }

        /*FOOTER*/

        .footer {
            border-top: 1px solid rgba(0, 0, 0, .05);
            color: rgba(0, 0, 0, .5);
        }

        .footer .heading {
            color: #000;
            font-size: 20px;
        }

        .footer ul {
            margin: 0;
            padding: 0;
        }

        .footer ul li {
            list-style: none;
            margin-bottom: 10px;
        }

        .footer ul li a {
            color: rgba(0, 0, 0, 1);
        }

        .form__star {
            padding: 0 20px;
        }

        .form__star input {
            display: none;
        }

        .form__star label {
            border: 1px solid #f0f0f0;
            background-color: #fdfdfd;
            height: 35px;
            padding: 5px;
            margin-bottom: 10px;
            -webkit-transition: all 200ms ease-in-out;
            transition: all 200ms ease-in-out;
            display: inline-block;
            text-align: start;
        }

        .form__star label span {
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            width: 35px;
            height: 35px;
            display: inline-block;
        }

        .form__star label span.off {
            background-image: url("http://dev.veritatrust.com/assets/img/star-0.png");
        }

        .form__star label span.on {
            background-image: url("http://dev.veritatrust.com/assets/img/star-1.png");
        }

        img.logo-boutique {
            width: 150px;
            height: auto;
            text-align: center;
        }

        @media screen and (max-width: 500px) {
            .logo img {
                width: 100%;
            }
        }
    </style>
</head>

<body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #fafafa;">
    <center style="width: 100%; background-color: #f1f1f1;">

        <div style="max-width: 700px; margin: 0 auto;" class="email-container">
            <!-- BEGIN BODY -->
            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="margin: auto;">
                <tr>
                    <td valign="top" class="bg_white" style="padding: .5em 2.5em 1em 2.5em;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" collspan="2">
                            <tr>
                                <!-- corretion 27/08/2022 -->
                                <td class="logo" style="text-align: left;">
                                    <img class="logo-boutique" src="https://moovicar.com/logo.png" alt="Moovicar">
                                </td>

                                <!-- fin corretion 27/08/2022 -->
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
                <tr>
                    <td class="bg_white" style="text-align: left; padding: 20px 20px 0 20px;">
                        <h2><strong>Documents requis pour réactiver votre compte</strong></h2>
                    </td>
                </tr>
                <tr>
                    <td class="bg_white" style="text-align: left; padding: 20px 20px 0 20px;">
                        <p>Cher Fatahou Ahamadi,<br> Nous avons besoin des documents suivants pour activer votre annonce afin qu'il soit publier:</p>
                        <ul>
                            <li>
                                Certificat d'immatriculation
                            </li>
                            <li>
                                Certificat d'assurance
                            </li>
                        </ul>
                        <p><strong>Veuillez envoyer ces documents en cliquant sur le bouton ci-dessous.</strong> Cela vous amènera sur un site web nommé Tresorit,
                        un endroit sécurisé qui garantit la protection de vos données personnelles.</p>
                        <p>Veuillez ne pas envoyer vos documents par email.
                        
                        Pour en savoir plus sur les raisons pour lesquelles nous avons restreint l'accès à votre compte, consultez notre <a href="#">Article
                        du centre d'aide</a>.</p>
                    </td>
                    
                </tr>
            </table>
            <div class="form__star bg_white">
                <a class="btn btn-primary" style="margin-bottom: 0;"
                    href="#">Envoyer mes documents</a>
            </div>
            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="margin: auto; font-size: 15px;">
                <tr>
                    <td class="bg_white" style="text-align: left; padding:20px;">
                        <p>A bientot,<br> moovicar.com team</p>
                    </td>
                </tr>
            </table>
            <hr style="margin-block-start: 0em;	margin-block-end: 0em; color: #ddd;">
            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="margin: auto; font-size: 15px;">
                <tr>
                    <td class="bg_white" style="text-align: center;  padding: 10px;">
                        <p>Vous ne souhaitez plus recevoir ces e-mails ?<br>Vous pouvez <a href="#"
                                style="color : rgba(0, 45, 107) ;">vous desabonner</a></p>
                    </td>
                </tr>
            </table>

        </div>
    </center>
</body>

</html>`;

  smtpTemplate.subject = "Envoyer vos documents pour complèter votre annonce";
  smtpTemplate.replyTo = "support@moovicar.com";
  smtpTemplate.toField = email_recipient;
  smtpTemplate.isActive = true;
  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  apiInstance.updateSmtpTemplate(templateId, smtpTemplate).then(
    function () {
      console.log("API called successfully.");

      var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

      sendSmtpEmail = {
        to: [
          {
            email: email_recipient,
            name: first_name,
          },
        ],
        templateId: 1,
        params: {
          name: first_name,
          surname: last_name,
        },

        headers: {
          "X-Mailin-custom":
            "api-key:" +
            "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" +
            "|content-type:application/json|accept:application/json",
        },
      };

      apiInstance.sendTransacEmail(sendSmtpEmail).then(
        function (data) {
          console.log("API called successfully. Returned data: " + data);
        },
        function (error) {
          console.error(error);
        }
      );
    },

    function (error) {
      console.error(error);
    }
  );
};

module.exports = {
  sendConfirmation: sendConfirmation,
};
