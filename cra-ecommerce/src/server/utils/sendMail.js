//------------------------Cấu hình email tự động-----------------\\ 

const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const id = "535677816384-a4qa52l3ki1sblkrdsrdi60m2s7mti91.apps.googleusercontent.com"
const secret = "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"
const refreshToken= "1//04xSW6y_LXBueCgYIARAAGAQSNwF-L9IrQhnEwMDKw9OArOKiOSD1i6tuhLViQVyzjY3T_nlNqt4qpsgmDtd83fVD9UlEH5lB6iU"
const oauth2Client = new OAuth2(
    id,
    secret,
    "https://developers.google.com/oauthplayground"
  );

oauth2Client.setCredentials({
    refresh_token: refreshToken
  });

  const getAccessToken = async () => {
    return new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject(`Không thể tạo access token: ${err.message}`);
        }
        resolve(token);
      });
    });
  };
const sendMail = asyncHandler(async ({ email, html, subject }) => {

    try{
          const accessToken = await getAccessToken();

          let transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
              type: "OAuth2",
              user: "duongtoantrung9423@gmail.com",
              accessToken:accessToken,
              clientId: id ,//"${process.env.CLIENT_ID}",
              clientSecret: secret ,//"${process.env.CLIENT_SECRET}",
              refreshToken: refreshToken // "${process.env.REFRESH_TOKEN}"
            }
          });
        
          // Setup nội dung mail
          const info = {
            from: '" Hỗ trợ người dùng Ecom. | No-reply email" <no-reply@Ecom.vn>', // Địa chỉ người gửi
            to: email, // Danh sách người nhận
            subject: subject, // Tiêu đề email
            //text: "Nội dung text...",
            html: html, // Nội dung HTML
          };
        const result = await transport.sendMail(info);
        return result;
        
    }
    catch(error)
    {
        throw new Error(error)
    }
    

});

module.exports = sendMail;
