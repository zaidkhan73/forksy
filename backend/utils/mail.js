import nodemailer from 'nodemailer';
import dotenv from "dotenv"

dotenv.config()

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export const sendOtpMail = async (to,otp,username) => {
    await transporter.sendMail({
        from:process.env.EMAIL,
        to,
        subject:"Reset your password",
        html:`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset OTP</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
            }
            
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-align: center;
                padding: 30px 20px;
            }
            
            .header h1 {
                margin-bottom: 10px;
                font-size: 28px;
                font-weight: 600;
            }
            
            .header p {
                font-size: 16px;
                opacity: 0.9;
            }
            
            .content {
                padding: 40px 30px;
                text-align: center;
            }
            
            .greeting {
                font-size: 18px;
                margin-bottom: 20px;
                color: #555;
            }
            
            .message {
                font-size: 16px;
                color: #666;
                margin-bottom: 30px;
                line-height: 1.5;
            }
            
            .otp-container {
                background-color: #f8f9ff;
                border: 2px dashed #667eea;
                border-radius: 10px;
                padding: 25px;
                margin: 30px 0;
                text-align: center;
            }
            
            .otp-label {
                font-size: 14px;
                color: #888;
                margin-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .otp-code {
                font-size: 36px;
                font-weight: bold;
                color: #667eea;
                letter-spacing: 8px;
                margin: 10px 0;
                font-family: 'Courier New', monospace;
            }
            
            .otp-validity {
                font-size: 12px;
                color: #999;
                margin-top: 10px;
            }
            
            .warning {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
                font-size: 14px;
                color: #856404;
            }
            
            .security-tips {
                background-color: #e8f4fd;
                border-left: 4px solid #3498db;
                padding: 15px;
                margin: 20px 0;
                text-align: left;
            }
            
            .security-tips h3 {
                color: #2980b9;
                margin-bottom: 10px;
                font-size: 16px;
            }
            
            .security-tips ul {
                padding-left: 20px;
            }
            
            .security-tips li {
                font-size: 14px;
                color: #34495e;
                margin-bottom: 5px;
            }
            
            .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                border-top: 1px solid #eee;
            }
            
            .footer p {
                font-size: 14px;
                color: #666;
                margin-bottom: 10px;
            }
            
            .footer .contact {
                font-size: 12px;
                color: #999;
            }
            
            .button {
                display: inline-block;
                padding: 12px 30px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                border-radius: 25px;
                font-weight: 600;
                margin: 20px 0;
                transition: transform 0.2s;
            }
            
            .button:hover {
                transform: translateY(-2px);
            }
            
            @media (max-width: 600px) {
                .email-container {
                    margin: 10px;
                }
                
                .content {
                    padding: 20px 15px;
                }
                
                .otp-code {
                    font-size: 28px;
                    letter-spacing: 4px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>🍴 Forksy Password Reset</h1>
                <p>Secure your food delivery account</p>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Hello ${username || 'User'},
                </div>
                
                <div class="message">
                    We received a request to reset your Forksy account password. To keep your 
                    food delivery account secure, please use the One-Time Password (OTP) below:
                </div>
                
                <div class="otp-container">
                    <div class="otp-label">Your OTP Code</div>
                    <div class="otp-code">${otp}</div>
                    <div class="otp-validity">Valid for 10 minutes</div>
                </div>
                
                <div class="warning">
                    ⚠️ <strong>Security Notice:</strong> If you didn't request this password reset, 
                    please ignore this email and your password will remain unchanged.
                </div>
                
                <div class="security-tips">
                    <h3>🛡️ Security Tips:</h3>
                    <ul>
                        <li>Never share your OTP with anyone</li>
                        <li>Our team will never ask for your OTP over phone or email</li>
                        <li>Complete the password reset process within 10 minutes</li>
                        <li>Use a strong, unique password for your account</li>
                    </ul>
                </div>
            </div>
            
            <div class="footer">
                <p>This is an automated message from Forksy Food Delivery.</p>
                <div class="contact">
                    Need help? Contact us at support@forksy.com<br>
                    © 2024 Forksy. All rights reserved.
                </div>
            </div>
        </div>
    </body>
    </html>`
    })
}