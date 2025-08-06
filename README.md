# 🛡️ Secure Node.js API – Applying Security Best Practices in Node.js

## 🎯 Project Goal

The goal of this project is to **implement most of the essential security principles in a Node.js application**, to protect the system from common vulnerabilities such as XSS, CSRF, LFI, and more.

---

## ✅ Features Implemented

### 🔐 1. Security Headers with Helmet
- `helmet.hidePoweredBy()` – Hides the "X-Powered-By" header to prevent technology disclosure.
- `helmet.noSniff()` – Prevents browsers from MIME-sniffing the response.
- `helmet.xssFilter()` – Disables XSS Auditor (legacy browsers).
- `Content-Security-Policy` – Strong CSP to prevent inline JavaScript and XSS attacks.

### 🚫 2. Cache Control for Sensitive Pages
- Used `nocache` middleware to prevent sensitive data from being cached by browsers.

### 📩 3. IE File Execution Protection
- Used `helmet.ieNoOpen()` to prevent Internet Explorer from executing downloaded files in the site’s context.

### 🔐 4. Data Exposure Minimization
- Only returns specific fields from user or database objects to reduce the risk of exposing sensitive information.

### 🔄 5. Stripe Webhook Signature Verification
- Uses `stripe.webhooks.constructEvent()` to validate webhook signatures and ensure secure integration.

### ⚠️ 6. Global Error Handling
- Captures unhandled promise rejections:
```js
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  process.exit(1);
});
