import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

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

export const sendPasswordMail = async (to, otp, username) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "Reset your password",
    html: `<!DOCTYPE html>
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
                    Hello ${username || "User"},
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
    </html>`,
  });
};

export const sendVerificationMail = async (to, otp, username) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "Verify your Email",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In Verification OTP</title>
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
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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
            background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
            border: 2px dashed #f59e0b;
            border-radius: 10px;
            padding: 25px;
            margin: 30px 0;
            text-align: center;
        }
        
        .otp-label {
            font-size: 14px;
            color: #d97706;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
        }
        
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #b45309;
            letter-spacing: 8px;
            margin: 10px 0;
            font-family: 'Courier New', monospace;
        }
        
        .otp-validity {
            font-size: 12px;
            color: #d97706;
            margin-top: 10px;
        }
        
        .signin-info {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            border: 1px solid #60a5fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: left;
        }
        
        .signin-info h3 {
            color: #1d4ed8;
            margin-bottom: 12px;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .signin-info p {
            font-size: 14px;
            color: #1e40af;
            line-height: 1.5;
        }
        
        .device-info {
            background-color: #f1f5f9;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: left;
        }
        
        .device-info h3 {
            color: #334155;
            margin-bottom: 15px;
            font-size: 16px;
        }
        
        .device-details {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 8px 16px;
            font-size: 14px;
        }
        
        .device-label {
            color: #64748b;
            font-weight: 600;
        }
        
        .device-value {
            color: #475569;
        }
        
        .security-warning {
            background-color: #fef2f2;
            border: 1px solid #fca5a5;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
            color: #dc2626;
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
        
        .steps {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: left;
        }
        
        .steps h3 {
            color: #0369a1;
            margin-bottom: 15px;
            font-size: 16px;
        }
        
        .step {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12px;
        }
        
        .step-number {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            margin-right: 12px;
            flex-shrink: 0;
        }
        
        .step-text {
            font-size: 14px;
            color: #0c4a6e;
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
            
            .device-details {
                grid-template-columns: 1fr;
                gap: 4px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>🍴 Forksy Sign In Verification</h1>
            <p>Confirm your identity to access your account</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hello ${username || "User"},
            </div>
            
            <div class="message">
                We detected a sign-in attempt to your Forksy account. To ensure the security of 
                your account and complete the sign-in process, please verify your identity using 
                the One-Time Password (OTP) below:
            </div>
            
            <div class="otp-container">
                <div class="otp-label">Sign In Verification Code</div>
                <div class="otp-code">${otp}</div>
                <div class="otp-validity">Valid for 10 minutes</div>
            </div>
            
            <div class="signin-info">
                <h3>🔐 Sign In Details:</h3>
                <p>
                    This verification is required because we want to ensure that only you can 
                    access your Forksy account. Enter the OTP above to complete your sign-in 
                    and start exploring delicious food options!
                </p>
            </div>
            
            <div class="device-info">
                <h3>📱 Sign-in attempt from:</h3>
                <div class="device-details">
                    <span class="device-label">Date & Time:</span>
                    <span class="device-value">${
                      timestamp || new Date().toLocaleString()
                    }</span>
                    <span class="device-label">Device:</span>
                    <span class="device-value">${device || "Web Browser"}</span>
                    <span class="device-label">Location:</span>
                    <span class="device-value">${location || "Unknown"}</span>
                    <span class="device-label">IP Address:</span>
                    <span class="device-value">${
                      ipAddress || "Hidden for security"
                    }</span>
                </div>
            </div>
            
            <div class="steps">
                <h3>📋 How to complete sign in:</h3>
                <div class="step">
                    <div class="step-number">1</div>
                    <div class="step-text">Copy the 6-digit OTP code above</div>
                </div>
                <div class="step">
                    <div class="step-number">2</div>
                    <div class="step-text">Return to the Forksy sign-in page</div>
                </div>
                <div class="step">
                    <div class="step-number">3</div>
                    <div class="step-text">Enter the OTP in the verification field</div>
                </div>
                <div class="step">
                    <div class="step-number">4</div>
                    <div class="step-text">Access your account and start ordering!</div>
                </div>
            </div>
            
            <div class="security-warning">
                🚨 <strong>Security Alert:</strong> If you didn't attempt to sign in to your 
                Forksy account, please secure your account immediately by changing your password 
                and contact our support team.
            </div>
            
            <div class="security-tips">
                <h3>🛡️ What happens after verification:</h3>
                <ul>
                    <li>Your email will be confirmed and account activated</li>
                    <li>You'll gain access to browse hundreds of restaurants</li>
                    <li>Receive exclusive offers and promotional discounts</li>
                    <li>Track your orders in real-time with notifications</li>
                    <li>Save your favorite restaurants and previous orders</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p>This is an automated security message from Forksy Food Delivery.</p>
            <div class="contact">
                Experiencing issues? Contact us at support@forksy.com<br>
                © 2024 Forksy. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>`,
  });
};
