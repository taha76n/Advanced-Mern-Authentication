// export const getOtpHtml = ({ email, otp }) => {
//   const appName = process.env.APP_NAME || "Authentication App";

//   return `
//   <!DOCTYPE html>
//   <html>
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1" />
//     <title>${appName} Verification Code</title>
//   </head>
//   <body style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;color:#111;">
//     <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f6f7fb;">
//       <tr>
//         <td align="center" style="padding:24px;">
//           <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e9ecf3;border-radius:12px;">
//             <!-- Header -->
//             <tr>
//               <td align="center" style="background:#111827;padding:18px 24px;">
//                 <span style="color:#fff;font-size:16px;font-weight:bold;letter-spacing:0.3px;">${appName}</span>
//               </td>
//             </tr>
//             <!-- Body -->
//             <tr>
//               <td style="padding:32px;">
//                 <h1 style="margin:0 0 12px;font-size:22px;font-weight:bold;color:#111;">Verify your email - ${email}</h1>
//                 <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444;">
//                   Use the verification code below to complete your sign-in to ${appName}.
//                 </p>
//                 <div style="margin:20px 0;text-align:center;">
//                   <span style="display:inline-block;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:10px;
//                                padding:14px 18px;font-size:32px;letter-spacing:10px;font-weight:bold;color:#111;">
//                     ${otp}
//                   </span>
//                 </div>
//                 <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#555;">
//                   This code will expire in <strong>5 minutes</strong>.
//                 </p>
//                 <p style="margin:0;font-size:14px;line-height:1.6;color:#555;">
//                   If this wasn’t initiated, this email can be safely ignored.
//                 </p>
//               </td>
//             </tr>
//             <!-- Footer -->
//             <tr>
//               <td align="center" style="padding:16px 24px;font-size:12px;color:#6b7280;">
//                 © ${new Date().getFullYear()} ${appName}. All rights reserved.
//               </td>
//             </tr>
//           </table>
//         </td>
//       </tr>
//     </table>
//   </body>
//   </html>`;
// };

// export const getVerifyEmailHtml = ({ email, token }) => {
//   const appName = process.env.APP_NAME || "Authentication App";
//   const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
//   const verifyUrl = `${baseUrl.replace(/\/+$/, "")}/verify/${encodeURIComponent(token)}`;
//   console.log(verifyUrl);
  

//   return `
//   <!DOCTYPE html>
//   <html>
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1" />
//     <title>${appName} Verify Your Account</title>
//   </head>
//   <body style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;color:#111;">
//     <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f6f7fb;">
//       <tr>
//         <td align="center" style="padding:24px;">
//           <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e9ecf3;border-radius:12px;">
//             <!-- Header -->
//             <tr>
//               <td align="center" style="background:#111827;padding:18px 24px;">
//                 <span style="color:#fff;font-size:16px;font-weight:bold;letter-spacing:0.3px;">${appName}</span>
//               </td>
//             </tr>
//             <!-- Body -->
//             <tr>
//               <td style="padding:32px;">
//                 <h1 style="margin:0 0 12px;font-size:22px;font-weight:bold;color:#111;">Verify your account - ${email}</h1>
//                 <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444;">
//                   Thanks for registering with ${appName}. Click the button below to verify your account.
//                 </p>
//                 <div style="text-align:center;margin:20px 0;">
//                   <a href="${verifyUrl}" target="_blank" rel="noopener"
//                      style="display:inline-block;background:#111827;color:#fff !important;text-decoration:none;
//                             padding:12px 18px;border-radius:8px;font-weight:600;font-size:14px;">
//                     Verify account
//                   </a>
//                 </div>
//                 <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#555;">
//                   If the button doesn’t work, copy and paste this link into your browser:
//                 </p>
//                 <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#555;word-break:break-all;">
//                   <a href="${verifyUrl}" target="_blank" rel="noopener" style="color:#111827;text-decoration:underline;">
//                     ${verifyUrl}
//                   </a>
//                 </p>
//                 <p style="margin:0;font-size:14px;line-height:1.6;color:#555;">
//                   If this wasn’t you, you can safely ignore this email.
//                 </p>
//               </td>
//             </tr>
//             <!-- Footer -->
//             <tr>
//               <td align="center" style="padding:16px 24px;font-size:12px;color:#6b7280;">
//                 © ${new Date().getFullYear()} ${appName}. All rights reserved.
//               </td>
//             </tr>
//           </table>
//         </td>
//       </tr>
//     </table>
//   </body>
//   </html>`;
// };
