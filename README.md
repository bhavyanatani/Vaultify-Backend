# 🧠 Vaultify – Password Manager (Backend)

Vaultify backend is built using Node.js and Express.js. It provides a secure REST API for user authentication, password encryption/decryption, and CRUD operations for stored passwords.  

---

## 🚀 Features

- User signup and login with JWT authentication  
- AES encryption for secure password storage  
- Password strength checking (using zxcvbn)  
- Middleware-protected routes  
- Validation using express-validator  
- MongoDB database integration with Mongoose  
- Environment-based configuration using dotenv  

---

## 🧩 Tech Stack

- Node.js  
- Express.js  
- MongoDB + Mongoose  
- CryptoJS (AES encryption)  
- JWT (Authentication)  
- Express-validator  
- Zxcvbn (Password strength meter)  

---

## ⚙️ Getting Started

1️⃣ Clone the Repository  
git clone https://github.com/yourusername/vaultify-backend.git  
cd vaultify-backend  

2️⃣ Install Dependencies  
npm install  

3️⃣ Setup Environment Variables  
Create a `.env` file in the root directory and add the following:  

PORT=5000  
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_jwt_secret  
CRYPTO_SECRET=your_crypto_secret  

---

## ▶️ Run the Server

**Start the server**  
```bash
nodemon index.js
```

Server will run at:  
http://localhost:5000  

---

## 🧠 API Endpoints

### Auth Routes
POST /api/auth/singup → Register new user  
POST /api/auth/login → Login user and get token  
POST /api/auth/getuser → Get logged-in user details  

### Password Routes (Protected)
POST /api/passwords/addPassword → Add a new password  
GET /api/passwords/fetchPasswords → Fetch all passwords of a user  
PUT /api/passwords/updatePassword/:id → Update a password  
DELETE /api/passwords/deletePassword/:id → Delete a password  
POST /api/passwords/checkstrength/:id → Check the strength of a password
---

## 🔒 Security Highlights

- AES-Encrypted password storage using CryptoJS  
- JWT-based authentication with middleware protection  
- Validation on all routes to prevent malformed data  
- Secure password strength checking with zxcvbn  

---

## 🌐 Deployment

This project is deployed on Vercel.
You can deploy your own version easily by connecting your GitHub repository to https://render.com

---

## 💡 Future Enhancements

- Add rate limiting to prevent abuse  
- Enable 2FA for authentication  
- Add password sharing between users with permissions  
- Add activity logs and notifications  

---

## 👨‍💻 Author

Bhavya Natani  
IIEST Shibpur | Developer & Designer  

---

⭐ If you like this project, consider giving it a star on GitHub!
