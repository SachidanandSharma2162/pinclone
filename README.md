# 📌 Pinterest Clone

A full-stack Pinterest-style web application that allows users to create, like, and comment on posts, follow other users, and manage their profiles — all with a beautiful UI inspired by Pinterest.

## 🌐 Live Demo

*(Optional: Add your deployment link here if you've hosted it)*  
[View Live](https://your-deployment-link.com)

---

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript, EJS, Tailwind CSS  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB & Mongoose  
- **Authentication**: Passport.js  
- **File Handling**: Multer  
- **Image Uploads**: Stored in MongoDB as Buffer  
- **Templating**: EJS

---

## ✨ Features

- 🔐 **User Authentication** (Signup/Login/Logout)
- 🖼️ **Post Creation** (Upload image with title & description)
- ❤️ **Like Posts** (Toggle like/unlike)
- 💬 **Comment System** (Add comments on images)
- 👥 **Follow Users** (See followers/following)
- 👤 **Profile Page** (User's image, info, posts, and connections)
- 📸 **Pinterest-style Feed** with hover effects using Tailwind
- 🛠️ **Admin Panel** *(optional, if implemented)*

---

## 📷 Screenshots

> *(Add screenshots/gifs of your app in action — home feed, profile page, post page, etc.)*

---

## 📁 Folder Structure

Pinterest-Clone/ ├── models/ │ ├── userModel.js │ └── postModel.js ├── routes/ │ └── index.js ├── views/ │ ├── imageinfo.ejs │ ├── userprofile.ejs │ ├── feed.ejs │ └── ...other EJS files ├── public/ │ └── styles (Tailwind CSS) ├── uploads/ │ └── ... (if saving locally) ├── app.js / server.js └── README.md

---


---

## 🧪 How to Run Locally

```bash
git clone https://github.com/SachidanandSharma2162/pinclone.git
cd pinterest-clone
npm install
mongodb://127.0.0.1:27017/pinterest
node app.js
