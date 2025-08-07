# 🛡️ Secure Node.js API – Applying Security Best Practices in Node.js

## 🎯 Project Goal

The goal of this project is to **implement most of the essential security principles in a Node.js application**
-

## ✅ Features Implemented

###  1. Use flat Promise chains
- use async and await to be able to catch all erroes

### 2. set request size limits 
- use (raw-body) package to control request body 

### 3. Do not block the event loop

###  4.perform input validation
- sanatize or clearup to input data befor validation layer
- use =>manual sanatize
- use (xxs npm )to protect from script input  and MongoDB injection

### 6.Perform output escaping
- use escape-html from npm
-  ex: const escapeHtml = require('escape-html');
-    res.send(`<div>${escapeHtml(user.name)}</div>`);

### 7.Perform application activity logging
- use escape-html from npm
-  here are modules such as Winston, Bunyan, or Pino to perform application activity logging.

### 8.Monitor the event loop
- use toobusy-js  from npm => to mintor if event loop is busy
- this package calc the busy by calc the lag, if lag = 70ms the package return true and send bust message

### 9.Take precautions against (brute-forcing)
- Attackers can use brute-forcing as a( password )guessing attack to obtain account passwords
- use npm i express-rate-limit
- for sensitive pages like login and signup....

### 10.anti csrf 
- use => npm i csrf

### 11.Remove unnecessary routes 

### 12.Prevent HTTP Parameter Pollution
- attack in which attackers send multiple HTTP parameters with the same name and this causes your application to interpret them unpredictably
- hpp package solve this problem by select last parameter

### 13.Only return what is necessary
- when querying and using user objects, you need to return only needed fields as it may be vulnerable to personal information disclosure.

###  14. Global Error Handling
- Captures unhandled promise rejections:
```js
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  process.exit(1);
});

###  15. Global Error Handling
- 
