# Zoo Management System (ZooMS)

A full-stack Zoo Management System built with **Node.js + Express + MongoDB + EJS**.

## 🌟 Features
- Home page + 5 category pages (Herbivores, Carnivores, Omnivores, Birds, Reptiles) — animal data pulled live from MongoDB
- User registration and login with securely hashed passwords (bcrypt) and sessions
- The first person to register automatically becomes **admin**; everyone after that is a normal visitor
- Admin panel to **Add / Edit / Delete** animals, including image upload
- **Online ticket booking** — visitors can book entry tickets (adults/children), get a unique ticket code, and print their ticket
- Admin can view all ticket bookings and mark them as Used/Cancelled

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Templating:** EJS
- **Authentication:** express-session + bcryptjs
- **File uploads:** Multer

## 📁 Project Structure
```
zoo-management-system/
├── server.js              # app entry point
├── seed.js                # populates database with starter animal data
├── config/                 # database connection + file upload config
├── models/                 # Mongoose schemas (User, Animal, Ticket)
├── middleware/              # auth/session protection
├── routes/                  # Express route handlers
├── views/                   # EJS templates
└── public/                  # CSS and images
