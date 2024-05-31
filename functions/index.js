const {onRequest} = require("firebase-functions/v2/https");
const functions = require("firebase-functions");
const bodyparser = require("body-parser");
const express = require("express");
const cors = require("cors");
const moment = require("moment");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const tmp = require("tmp");
const app = express();
const {deserializeUser} = require("./src/middleware/deserializeUser");


// import controller routers
const assessments = require("./src/controller/assessment.js");
const companies = require("./src/controller/company.js");
const exports_ = require("./src/controller/export.js");
const incidents = require("./src/controller/incident.js");
const overview = require("./src/controller/overview.js");
const mines = require("./src/controller/mine.js");
const users = require("./src/controller/user.js");
const reporting = require("./src/controller/reporting.js");
const integrations = require("./src/controller/integrations.js");
const {getDailyReport, getBalanceReport} = require("./src/services/reporting.js");
const {startOfMonth, isBefore, isWeekend} = require("date-fns");
const {success, error} = require("./src/utils/logger.js");

// setup express
app.use(cors({
  origin: "*",
  methods: "GET,PUT,DELETE,POST",
  optionsSuccessStatus: 200,
}));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(express.json({limit: "50mb"}));
app.use(express.raw({limit: "50mb"}));
app.use(deserializeUser);


// create endpoints
assessments(app);
companies(app);
exports_(app);
incidents(app);
overview(app);
mines(app);
users(app);
reporting(app);
integrations(app);

const emailReports = async () => {
  let days = 0;
  for (let date = startOfMonth(new Date()); isBefore(date, new Date()); date = moment(date).add(1, "day").toDate()) {
    if (!isWeekend(date)) {
      days++;
    }
  }
  const report = await getDailyReport(null);
  const balance = await getBalanceReport(null);

  // Create a document
  const doc = new PDFDocument();
  const doc1 = new PDFDocument();
  // const doc2 = new PDFDocument();

  // See below for browser usage
  doc.pipe(fs.createWriteStream(`${tmp.tmpdir}/Total Stock Delivery (${new Date().toISOString().substring(0, 10)}).pdf`));

  // Embed a font, set the font size, and render some text
  doc.font("./poppins.ttf");
  doc.fontSize(20).text(`Total Stock Delivery - ${new Date().toISOString().substring(0, 10)}`);
  doc.fontSize(14).text(`\n\nCASSITERITE`);
  doc.fontSize(11);
  doc.text(`Daily Target (TONS):    ${(report.cassiterite.dailyTarget/1000).toFixed(2)}
Daily Actuals (TONS)    ${(report.cassiterite.dailyActual/1000).toFixed(2)}
Monthly Target (TONS):    ${(report.cassiterite.mtdTarget/1000).toFixed(2)}
MTD Target (TONS):    ${((report.cassiterite.dailyTarget*days)/1000).toFixed(2)}
MTD Actuals (TONS):    ${(report.cassiterite.mtdActual/1000).toFixed(2)}
MTD Actuals vs Target (%):    ${(((report.cassiterite.mtdActual/1000)/((report.cassiterite.dailyTarget*days)/1000))*100).toFixed(2)}%`, {
    align: "left",
  });
  doc.fontSize(14).text(`\n\nCOLTAN`);
  doc.fontSize(11);
  doc.text(`Daily Target (TONS):    ${(report.coltan.dailyTarget/1000).toFixed(2)}
Daily Actuals (TONS)    ${(report.coltan.dailyActual/1000).toFixed(2)}
Monthly Target (TONS):    ${(report.coltan.mtdTarget/1000).toFixed(2)}
MTD Target (TONS):    ${((report.coltan.dailyTarget*days)/1000).toFixed(2)}
MTD Actuals (TONS):    ${(report.coltan.mtdActual/1000).toFixed(2)}
MTD Actuals vs Target (%):    ${(((report.coltan.mtdActual/1000)/((report.coltan.dailyTarget*days)/1000))*100).toFixed(2)}%`, {
    align: "left",
  });
  doc.fontSize(14).text(`\n\nWOLFRAMITE`);
  doc.fontSize(11);
  doc.text(`Daily Target (TONS):    ${(report.wolframite.dailyTarget/1000).toFixed(2)}
Daily Actuals (TONS)    ${(report.wolframite.dailyActual/1000).toFixed(2)}
Monthly Target (TONS):    ${(report.wolframite.mtdTarget/1000).toFixed(2)}
MTD Target (TONS):    ${((report.wolframite.dailyTarget*days)/1000).toFixed(2)}
MTD Actuals (TONS):    ${(report.wolframite.mtdActual/1000).toFixed(2)}
MTD Actuals vs Target (%):    ${(((report.wolframite.mtdActual/1000)/((report.wolframite.dailyTarget*days)/1000))*100).toFixed(2)}%`, {
    align: "left",
  });

  // Finalize PDF file
  doc.end();

  doc1.pipe(fs.createWriteStream(`${tmp.tmpdir}/In-Stock Country Balance (${new Date().toISOString().substring(0, 10)}).pdf`));
  doc1.font("./poppins.ttf");
  doc1.fontSize(20).text(`In-Stock Country Balance - ${new Date().toISOString().substring(0, 10)}`);
  doc1.fontSize(14).text(`\n\nCASSITERITE`);
  doc1.fontSize(11);
  doc1.text(`With Minexx (TONS):    ${(balance.cassiterite.minexx/1000).toFixed(2)}
With RMR (TONS)    ${(balance.cassiterite.rmr/1000).toFixed(2)}
With Buyer (SOLD)    ${(balance.cassiterite.buyer/1000).toFixed(2)}
Pending Shipment (TONS)    ${(balance.cassiterite.pending/1000).toFixed(2)}
Shipped (TONS)    ${(balance.cassiterite.shipped/1000).toFixed(2)}`, {
    align: "left",
  });
  doc1.fontSize(14).text(`\n\nCOLTAN`);
  doc1.fontSize(11);
  doc1.text(`With Minexx (TONS):    ${(balance.coltan.minexx/1000).toFixed(2)}
With RMR (TONS)    ${(balance.coltan.rmr/1000).toFixed(2)}
With Buyer (SOLD)    ${(balance.coltan.buyer/1000).toFixed(2)}
Pending Shipment (TONS)    ${(balance.coltan.pending/1000).toFixed(2)}
Shipped (TONS)    ${(balance.coltan.shipped/1000).toFixed(2)}`, {
    align: "left",
  });
  doc1.fontSize(14).text(`\n\nWOLFRAMITE`);
  doc1.fontSize(11);
  doc1.text(`With Minexx (TONS):    ${(balance.wolframite.minexx/1000).toFixed(2)}
With RMR (TONS)    ${(balance.wolframite.rmr/1000).toFixed(2)}
With Buyer (SOLD)    ${(balance.wolframite.buyer/1000).toFixed(2)}
Pending Shipment (TONS)    ${(balance.wolframite.pending/1000).toFixed(2)}
Shipped (TONS)    ${(balance.wolframite.shipped/1000).toFixed(2)}`, {
    align: "left",
  });
  doc1.end();

  const email = `minexx.dev@gmail.com`;
  const password = `osxk qxgj cnuc jczf`;

  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: email,
        pass: password,
      },
    });

    // send mail with defined transport object
    await transporter.sendMail({
      from: "\"Minexx\" <minexx.dev@gmail.com>", // sender address
      subject: "Reports Attached | Minexx", // Subject line
      to: "b.akaffou@minexx.co", // sender address
      bcc: "o.devreese@minexx.co,mansoor@minexx.co,n.muhizi@minexx.co,laurent@minexx.co,marcus@minexx.co,e.beau@minexx.co,t.qureshi@minexx.co,habimanar@minexx.co",
      text: "Please find attached the subject mentioned.\n\nRegards,\n\nMinexx",
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
      <!--[if (gte mso 9)|(IE)]>
        <xml>
          <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- So that mobile will display zoomed in -->
      <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- enable media queries for windows phone 8 -->
      <meta name="format-detection" content="telephone=no"> <!-- disable auto telephone linking in iOS -->
      <meta name="format-detection" content="date=no"> <!-- disable auto date linking in iOS -->
      <meta name="format-detection" content="address=no"> <!-- disable auto address linking in iOS -->
      <meta name="format-detection" content="email=no"> <!-- disable auto email linking in iOS -->
      <meta name="color-scheme" content="only">
      <title></title>
      
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Poppins+Slab:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
      
      <style type="text/css"> 
      /*Basics*/
      body {margin:0px !important; padding:0px !important; display:block !important; min-width:100% !important; width:100% !important; -webkit-text-size-adjust:none;}
      table {border-spacing:0; mso-table-lspace:0pt; mso-table-rspace:0pt;}
      table td {border-collapse: collapse;mso-line-height-rule:exactly;}
      td img {-ms-interpolation-mode:bicubic; width:auto; max-width:auto; height:auto; margin:auto; display:block!important; border:0px;}
      td p {margin:0; padding:0;}
      td div {margin:0; padding:0;}
      td a {text-decoration:none; color: inherit;}
      /*Outlook*/
      .ExternalClass {width: 100%;}
      .ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div {line-height:inherit;}
      .ReadMsgBody {width:100%; background-color: #ffffff;}
      /* iOS black LINKS */
      a[x-apple-data-detectors] {color:inherit !important; text-decoration:none !important; font-size:inherit !important; font-family:inherit !important; font-weight:inherit !important; line-height:inherit !important;} 
      /*Gmail black links*/
      u + #body a {color:inherit;text-decoration:none;font-size:inherit;font-family:inherit;font-weight:inherit;line-height:inherit;}
      /*Buttons fix*/
      .undoreset a, .undoreset a:hover {text-decoration:none !important;}
      .yshortcuts a {border-bottom:none !important;}
      .ios-footer a {color:#aaaaaa !important;text-decoration:none;}
      /*Responsive-Tablet*/
      @media only screen and (max-width: 799px) and (min-width: 601px) {
        .outer-table.row {width:640px!important;max-width:640px!important;}
        .inner-table.row {width:580px!important;max-width:580px!important;}
      }
      /*Responsive-Mobile*/
      @media only screen and (max-width: 600px) and (min-width: 320px) {
        table.row {width: 100%!important;max-width: 100%!important;}
        td.row {width: 100%!important;max-width: 100%!important;}
        .img-responsive img {width:100%!important;max-width: 100%!important;height: auto!important;margin: auto;}
        .center-float {float: none!important;margin:auto!important;}
        .center-text{text-align: center!important;}
        .container-padding {width: 100%!important;padding-left: 15px!important;padding-right: 15px!important;}
        .container-padding10 {width: 100%!important;padding-left: 10px!important;padding-right: 10px!important;}
        .hide-mobile {display: none!important;}
        .menu-container {text-align: center !important;}
        .autoheight {height: auto!important;}
        .m-padding-10 {margin: 10px 0!important;}
        .m-padding-15 {margin: 15px 0!important;}
        .m-padding-20 {margin: 20px 0!important;}
        .m-padding-30 {margin: 30px 0!important;}
        .m-padding-40 {margin: 40px 0!important;}
        .m-padding-50 {margin: 50px 0!important;}
        .m-padding-60 {margin: 60px 0!important;}
        .m-padding-top10 {margin: 30px 0 0 0!important;}
        .m-padding-top15 {margin: 15px 0 0 0!important;}
        .m-padding-top20 {margin: 20px 0 0 0!important;}
        .m-padding-top30 {margin: 30px 0 0 0!important;}
        .m-padding-top40 {margin: 40px 0 0 0!important;}
        .m-padding-top50 {margin: 50px 0 0 0!important;}
        .m-padding-top60 {margin: 60px 0 0 0!important;}
        .m-height10 {font-size:10px!important;line-height:10px!important;height:10px!important;}
        .m-height15 {font-size:15px!important;line-height:15px!important;height:15px!important;}
        .m-height20 {font-size:20px!important;line-height:20px!important;height:20px!important;}
        .m-height25 {font-size:25px!important;line-height:25px!important;height:25px!important;}
        .m-height30 {font-size:30px!important;line-height:30px!important;height:30px!important;}
        .radius6 {border-radius: 6px!important;}
        .fade-white {background-color: rgba(255, 255, 255, 0.8)!important;}
        .rwd-on-mobile {display: inline-block!important;padding: 5px!important;}
        .center-on-mobile {text-align: center!important;}
        .rwd-col {width:100%!important;max-width:100%!important;display:inline-block!important;}
        .type48 {font-size:48px!important;line-height:58px!important;}
      }
      </style>
      <style type="text/css" class="export-delete"> 
        .composer--mobile table.row {width: 100%!important;max-width: 100%!important;}
        .composer--mobile td.row {width: 100%!important;max-width: 100%!important;}
        .composer--mobile .img-responsive img {width:100%!important;max-width: 100%!important;height: auto!important;margin: auto;}
        .composer--mobile .center-float {float: none!important;margin:auto!important;}
        .composer--mobile .center-text{text-align: center!important;}
        .composer--mobile .container-padding {width: 100%!important;padding-left: 15px!important;padding-right: 15px!important;}
        .composer--mobile .container-padding10 {width: 100%!important;padding-left: 10px!important;padding-right: 10px!important;}
        .composer--mobile .hide-mobile {display: none!important;}
        .composer--mobile .menu-container {text-align: center !important;}
        .composer--mobile .autoheight {height: auto!important;}
        .composer--mobile .m-padding-10 {margin: 10px 0!important;}
        .composer--mobile .m-padding-15 {margin: 15px 0!important;}
        .composer--mobile .m-padding-20 {margin: 20px 0!important;}
        .composer--mobile .m-padding-30 {margin: 30px 0!important;}
        .composer--mobile .m-padding-40 {margin: 40px 0!important;}
        .composer--mobile .m-padding-50 {margin: 50px 0!important;}
        .composer--mobile .m-padding-60 {margin: 60px 0!important;}
        .composer--mobile .m-padding-top10 {margin: 30px 0 0 0!important;}
        .composer--mobile .m-padding-top15 {margin: 15px 0 0 0!important;}
        .composer--mobile .m-padding-top20 {margin: 20px 0 0 0!important;}
        .composer--mobile .m-padding-top30 {margin: 30px 0 0 0!important;}
        .composer--mobile .m-padding-top40 {margin: 40px 0 0 0!important;}
        .composer--mobile .m-padding-top50 {margin: 50px 0 0 0!important;}
        .composer--mobile .m-padding-top60 {margin: 60px 0 0 0!important;}
        .composer--mobile .m-height10 {font-size:10px!important;line-height:10px!important;height:10px!important;}
        .composer--mobile .m-height15 {font-size:15px!important;line-height:15px!important;height:15px!important;}
        .composer--mobile .m-height20 {font-srobotoize:20px!important;line-height:20px!important;height:20px!important;}
        .composer--mobile .m-height25 {font-size:25px!important;line-height:25px!important;height:25px!important;}
        .composer--mobile .m-height30 {font-size:30px!important;line-height:30px!important;height:30px!important;}
        .composer--mobile .radius6 {border-radius: 6px!important;}
        .composer--mobile .fade-white {background-color: rgba(255, 255, 255, 0.8)!important;}
        .composer--mobile .rwd-on-mobile {display: inline-block!important;padding: 5px!important;}
        .composer--mobile .center-on-mobile {text-align: center!important;}
        .composer--mobile .rwd-col {width:100%!important;max-width:100%!important;display:inline-block!important;}
        .composer--mobile .type48 {font-size:48px!important;line-height:58px!important;}
      </style>
      </head>
      
      <body data-bgcolor="Body" style="margin-top: 0; margin-bottom: 0; padding-top: 0; padding-bottom: 0; width: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;" bgcolor="#000000">
      
      <span class="preheader-text" data-preheader-text style="color: transparent; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; visibility: hidden; width: 0; display: none; mso-hide: all;"></span>
      
      <!-- Preheader white space hack -->
      <div style="display: none; max-height: 0px; overflow: hidden;">
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;
      &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
      &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
      &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
      </div>
      
      <div data-primary-font="Poppins" data-secondary-font="Poppins" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;"></div>
      
      <table border="0" align="center" cellpadding="0" cellspacing="0" width="100%" style="width:100%;max-width:100%;">
        <tr><!-- Outer Table -->
          <td align="center" data-bgcolor="Body" bgcolor="#000000" class="container-padding" data-composer>
      
      <table data-outer-table border="0" align="center" cellpadding="0" cellspacing="0" class="outer-table row" role="presentation" width="580" style="width:580px;max-width:580px;" data-module="black-logo">
        <!-- black-logo -->
        <tr>
          <td height="60" style="font-size:60px;line-height:60px;" data-height="Spacing top">&nbsp;</td>
        </tr>
        <tr data-element="black-logo" data-label="Logo">
          <td align="center">
            <img style="width:189px;border:0px;display: inline!important;" src="https://dashboard.minexx.co/static/media/logo.622ddfec91b1cab3c9c8.png" width="189" border="0" editable="true" data-icon data-image-edit data-url data-label="Logo" data-image-width alt="logo">
          </td>
        </tr>
        <tr>
          <td height="30" style="font-size:30px;line-height:30px;" data-height="Spacing bottom">&nbsp;</td>
        </tr>
        <!-- black-logo -->
      </table>
      
      <table data-outer-table border="0" align="center" cellpadding="0" cellspacing="0" class="outer-table row" role="presentation" width="580" style="width:580px;max-width:580px;" data-module="black-intro-7">
        <!-- black-intro-7 -->
        <tr>
          <td height="30" style="font-size:30px;line-height:30px;" data-height="Spacing top">&nbsp;</td>
        </tr>
        <tr data-element="black-intro-7-subline" data-label="Intro Subline">
          <td data-text-style="Intro Subline" align="center" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:40px;line-height:53px;font-weight:400;font-style:normal;color:#FFFFFF;text-decoration:none;letter-spacing:0px;">
              <singleline>
                <div mc:edit data-text-edit>
                  Reports from  
                </div>
              </singleline>
          </td>
        </tr>
        <tr data-element="black-intro-7-headline" data-label="Intro Headline">
          <td class="type48" data-text-style="Intro Headline" align="center" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:64px;line-height:84px;font-weight:700;font-style:normal;color:#FFFFFF;text-decoration:none;letter-spacing:0px;">
              <singleline>
                <div mc:edit data-text-edit>
                  “Minexx Dashboard” 
                </div>
              </singleline>
          </td>
        </tr>
        <tr>
          <td height="10" style="font-size:10px;line-height:10px;" data-height="Spacing bottom">&nbsp;</td>
        </tr>
        <!-- black-intro-7 -->
      </table>
      
      <table data-outer-table border="0" align="center" cellpadding="0" cellspacing="0" class="outer-table row" role="presentation" width="580" style="width:580px;max-width:580px;" data-module="black-invitation-message">
        <!-- black-invitation-message -->
        <tr>
          <td height="10" style="font-size:10px;line-height:10px;" data-height="Spacing top">&nbsp;</td>
        </tr>
        <tr>
          <td align="center"> 
          <!-- Content -->
          <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;">
            <tr data-element="black-arrow-divider" data-label="Arrow">
              <td align="center">
                <img style="width:34px;border:0px;display: inline!important;" src="https://skidotools.co.bw/images/arrow.png" width="34" border="0" editable="true" data-icon data-image-edit data-url data-label="Arrow" data-image-width alt="arrow">
              </td>
            </tr>
            <tr>
              <td align="center" bgcolor="#333333" data-bgcolor="Inner BgColor"> 
              <!-- rwd-col -->
              <table border="0" cellpadding="0" cellspacing="0" align="center" class="row container-padding" width="93.1%" style="width:93.1%;max-width:93.1%;">
                <tr>
                  <td height="40" style="font-size:40px;line-height:40px;" data-height="Inner spacing top">&nbsp;</td>
                </tr>
                <tr data-element="black-intro-7-headline" data-label="Headlines">
                  <td data-text-style="Headlines" align="left" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:48px;line-height:48px;font-weight:300;font-style:normal;color:#FFFFFF;text-decoration:none;letter-spacing:0px;">
                      <singleline>
                        <div mc:edit data-text-edit>
                          Hi,
                        </div>
                      </singleline>
                  </td>
                </tr>
                <tr data-element="black-intro-7-headline" data-label="Headlines">
                  <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                </tr>
                <tr data-element="black-invitation-message-paragraph" data-label="Paragraphs">
                  <td class="center-text" data-text-style="Paragraphs" align="left" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:18px;line-height:32px;font-weight:400;font-style:normal;color:#FFFFFF;text-decoration:none;letter-spacing:0px;">
                      <singleline>
                        <div mc:edit data-text-edit>
                          I hope this email finds you well. As part of our commitment to transparency and keeping you informed about our operations, we are pleased to share with you the daily reports detailing the total stock deliveries and in-stock country balances from our Minexx Dashboard.
                          <br><br>
                          We believe that these reports will offer valuable insights into our operations and help you make informed investment decisions. Should you have any questions or require further clarification on any aspect of the reports, please do not hesitate to reach out to us.                  </div>
                      </singleline>
                  </td>
                </tr>
                <tr data-element="black-invitation-message-paragraph" data-label="Paragraphs">
                  <td height="36" style="font-size:36px;line-height:36px;">&nbsp;</td> 
                </tr>
                <tr data-element="black-invitation-splitter" data-label="Splitter">
                  <td align="center" height="1" data-bgcolor="Splitter" bgcolor="#555555" style="font-size:1px;line-height:1px;">&nbsp;</td>
                </tr>
                <tr data-element="black-invitation-splitter" data-label="Splitter">
                  <td height="34" style="font-size:34px;line-height:34px;">&nbsp;</td> 
                </tr>
                <tr data-element="black-invitation-author" data-label="Author">
                  <td align="center">
                    <!-- rwd-col -->
                    <table border="0" cellpadding="0" cellspacing="0" align="left" role="presentation" class="float-center">
                      <tr>
                        <td class="rwd-col" align="center">
      
                          <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td align="center">
                                <img style="width:60px;border:0px;display: inline!important;" src="https://dashboard.minexx.co/static/media/logo.622ddfec91b1cab3c9c8.png" width="60" border="0" editable="true" data-icon data-image-edit data-url data-label="Avatar" alt="Avatar">
                              </td>
                            </tr>
                          </table>
      
                        </td>
                        <td class="rwd-col" align="center" width="15" height="5" style="width:15px;max-width:15px;height:5px;">&nbsp;</td>
                        <td class="rwd-col" align="center">
      
                          <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td class="center-text" data-text-style="Name" align="left" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:24px;line-height:32px;font-weight:700;font-style:normal;color:#FFFFFF;text-decoration:none;letter-spacing:0px;">
                                  <singleline>
                                    <div mc:edit data-text-edit>
                                     Minexx Dashboard
                                    </div>
                                  </singleline>
                              </td>
                            </tr>
                            <tr>
                              <td height="5" style="font-size:5px;line-height:5px;">&nbsp;</td>
                            </tr>
                            <tr>
                              <td class="center-text" data-text-style="Occupation" align="left" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:14px;line-height:14px;font-weight:400;font-style:normal;color:#FFFFFF;text-decoration:none;letter-spacing:0px;">
                                  <singleline>
                                    <div mc:edit data-text-edit>
                                     This is an auto-generated email.
                                    </div>
                                  </singleline>
                              </td>
                            </tr>
                          </table>
      
                        </td>
                      </tr>
                    </table>
                    <!-- rwd-col -->
                  </td>
                </tr>
                <tr>
                  <td height="38" style="font-size:38px;line-height:38px;" data-height="Inner spacing bottom">&nbsp;</td> 
                </tr>
              </table>
              <!-- rwd-col -->
              </td>
            </tr>
          </table>
          <!-- Content -->
          </td>
        </tr>
        <tr>
          <td height="20" style="font-size:20px;line-height:20px;" data-height="Spacing bottom">&nbsp;</td>
        </tr>
        <!-- black-invitation-message -->
      </table>
      
      <table data-outer-table border="0" align="center" cellpadding="0" cellspacing="0" class="outer-table row" role="presentation" width="580" style="width:580px;max-width:580px;" data-module="black-cta-2">
        <tr>
          <td height="30" style="font-size:30px;line-height:30px;" data-height="Spacing top">&nbsp;</td>
        </tr>
        <tr data-element="black-cta-2-button" data-label="Buttons">
          <td align="center">
            <!-- Button -->
            <table border="0" cellspacing="0" cellpadding="0" role="presentation" align="center">
              <tr>
                <td align="center" data-border-radius-default="0,6,36" data-border-radius-custom="Buttons" data-bgcolor="Buttons" bgcolor="#32a9e1" style="border-radius: 6px;">
            <!--[if (gte mso 9)|(IE)]>
              <table border="0" cellpadding="0" cellspacing="0" align="center">
                <tr>
                  <td align="center" width="38"></td>
                  <td align="center" height="60" style="height:60px;">
                  <![endif]-->
                    <singleline>
                      <a href="https://dashboard.minexx.co" mc:edit data-button data-text-style="Buttons" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:18px;line-height:28px;font-weight:700;font-style:normal;color:#FFFFFF;text-decoration:none;letter-spacing:0px;padding: 16px 38px 16px 38px;display: inline-block;"><span>View on Dashboard</span></a>
                    </singleline>
                  <!--[if (gte mso 9)|(IE)]>
                  </td>
                  <td align="center" width="38"></td>
                </tr>
              </table>
            <![endif]-->
                </td>
              </tr>
            </table>
            <!-- Buttons -->
          </td>
        </tr>
        <tr>
          <td height="30" style="font-size:30px;line-height:30px;" data-height="Spacing bottom">&nbsp;</td>
        </tr>
      </table>
      
      <table data-outer-table border="0" align="center" cellpadding="0" cellspacing="0" class="outer-table row" role="presentation" width="580" style="width:580px;max-width:580px;" data-module="black-splitter">
        <!-- black-splitter -->
        <tr>
          <td height="30" style="font-size:30px;line-height:30px;" data-height="Spacing top">&nbsp;</td>
        </tr>
        <tr>
          <td align="center" height="8" data-border-color="dotted-dividers" style="font-size:8px;line-height:8px;border-top: 8px dotted #333333;">&nbsp;</td>
        </tr>
        <tr>
          <td height="30" style="font-size:30px;line-height:30px;" data-height="Spacing bottom">&nbsp;</td>
        </tr>
        <!-- black-splitter -->
      </table>
      
      <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="580" style="width:580px;max-width:580px;" data-module="black-footer">
        <!-- black-footer -->
        <tr>
          <td height="30" style="font-size:30px;line-height:30px;" data-height="Footer spacing top">&nbsp;</td>
        </tr>
        <tr data-element="black-footer-links" data-label="Footer Links">
          <td align="center">
            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
              <tr class="center-on-mobile">
                <td data-element="black-footer-1st-link" data-label="1st Link" data-text-style="Footer Links" class="rwd-on-mobile center-text" align="center" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:#999999;text-decoration:none;letter-spacing:0px;">
                  <!-- Links -->
                    <singleline>
                      <a href="https://minexx.co" mc:edit data-button data-text-style="Footer Links" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:14px;line-height:28px;font-weight:400;font-style:normal;color:#999999;text-decoration:none;letter-spacing:0px;display:inline-block;vertical-align:middle;"><span>Home</span></a> 
                    </singleline>
                  <!-- Links -->
                </td>
                <td data-element="black-footer-gap-1" data-label="1st Gap" class="hide-mobile" align="center" valign="middle">
                  <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td width="10"></td>
                      <td class="center-text" data-text-style="Paragraphs" align="center" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:28px;line-height:28px;font-weight:100;font-style:normal;color:#444444;text-decoration:none;letter-spacing:0px;">|</td>
                      <td width="10"></td>
                    </tr>
                  </table>
                </td>
                <td data-element="black-footer-2nd-link" data-label="2nd Link" data-text-style="Footer Links" class="rwd-on-mobile center-text" align="center" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:#999999;text-decoration:none;letter-spacing:0px;">
                  <!-- Links -->
                    <singleline>
                      <a href="https://minexx.co/what-we-do" mc:edit data-button data-text-style="Footer Links" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:14px;line-height:28px;font-weight:400;font-style:normal;color:#999999;text-decoration:none;letter-spacing:0px;display:inline-block;vertical-align:middle;"><span>What We Do</span></a> 
                    </singleline>
                  <!-- Links -->
                </td>
                <td data-element="black-footer-gap-2" data-label="2nd Gap" class="hide-mobile" align="center" valign="middle">
                  <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td width="10"></td>
                      <td class="center-text" data-text-style="Paragraphs" align="center" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:28px;line-height:28px;font-weight:100;font-style:normal;color:#444444;text-decoration:none;letter-spacing:0px;">|</td>
                      <td width="10"></td>
                    </tr>
                  </table>
                </td>
                <td data-element="black-footer-3rd-link" data-label="3rd Link" data-text-style="Footer Links" class="rwd-on-mobile center-text" align="center" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:#999999;text-decoration:none;letter-spacing:0px;">
                  <!-- Links -->
                    <singleline>
                      <a href="https://minexx.co/technology" mc:edit data-button data-text-style="Footer Links" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:14px;line-height:28px;font-weight:400;font-style:normal;color:#999999;text-decoration:none;letter-spacing:0px;display:inline-block;vertical-align:middle;"><span>Technology</span></a> 
                    </singleline>
                  <!-- Links -->
                </td>
                <td data-element="black-footer-gap-3" data-label="3rd Gap" class="hide-mobile" align="center" valign="middle">
                  <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td width="10"></td>
                      <td class="center-text" data-text-style="Paragraphs" align="center" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:28px;line-height:28px;font-weight:100;font-style:normal;color:#444444;text-decoration:none;letter-spacing:0px;">|</td>
                      <td width="10"></td>
                    </tr>
                  </table>
                </td>
                <td data-element="black-footer-4th-link" data-label="4th Link" data-text-style="Footer Links" class="rwd-on-mobile center-text" align="center" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:#999999;text-decoration:none;letter-spacing:0px;">
                  <!-- Links -->
                    <singleline>
                      <a href="https://minexx.co/blog" mc:edit data-button data-text-style="Footer Links" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:14px;line-height:28px;font-weight:400;font-style:normal;color:#999999;text-decoration:none;letter-spacing:0px;display:inline-block;vertical-align:middle;"><span>News</span></a> 
                    </singleline>
                  <!-- Links -->
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr data-element="black-footer-links" data-label="Footer Links">
          <td height="40" style="font-size:40px;line-height:40px;" data-height="Spacing under footer links">&nbsp;</td>
        </tr>
      
        <tr data-element="black-footer-paragraphs" data-label="Paragraphs">
          <td align="center">
            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="480" style="width:480px;max-width:480px;">
              <tr>
                <td class="center-text" data-text-style="Paragraphs" align="center" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:#999999;text-decoration:none;letter-spacing:0px;">
                  <multiline>
                    <div mc:edit data-text-edit>
                      ${new Date().getFullYear()} Minexx &middot; All Rights Reserved.<br>
                      <a href="mailto:hello@minexx.co" style="color: '#32a9e1';">hello@minexx.co</a>
                    </div>
                  </multiline>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td height="50" style="font-size:50px;line-height:50px;" data-height="Footer spacing bottom">&nbsp;</td>
        </tr>
        <!-- black-footer -->
      </table>
      
          </td>
        </tr><!-- Outer-Table -->
      </table>
      
      </body>
      </html>`,
      attachments: [
        {
          path: `${tmp.tmpdir}/Total Stock Delivery (${new Date().toISOString().substring(0, 10)}).pdf`,
        },
        {
          path: `${tmp.tmpdir}/In-Stock Country Balance (${new Date().toISOString().substring(0, 10)}).pdf`,
        },
      ],
    });
    success(null, `Cron job executed successfully at ${new Date().toLocaleString()}`, null, null);
  } catch (err) {
    error(null, `Cron job failed to execute at ${new Date().toLocaleString()}. Reason: ${err.message}`, null, null);
  }
};

app.get("/", async (req, res)=>{
  res.send({
    success: true,
    message: "The API is stable. All endpoints are responding normally",
    copyrights: {
      company: "Minexx",
      website: "https://minexx.co",
    },
    documentation: "https://docs.minexx.co",
  });
});

exports.scheduledCronJobs = functions.pubsub.schedule("0 17 * * MON-FRI").timeZone("Africa/Johannesburg").onRun((context)=>{
  success(null, `Running scheduled cron job at: ${context.timestamp}`, null, null);
  emailReports();
  return null;
});

exports.minexx = onRequest(app);
