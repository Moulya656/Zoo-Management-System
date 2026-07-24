# Zoo Management System 

A full-stack Zoo Management System built with **Node.js + Express + MongoDB + EJS**.

## Features
- Home page + 5 category pages (Herbivores, Carnivores, Omnivores, Birds, Reptiles) — animal
  data is pulled live from MongoDB, not hardcoded in HTML
- User registration and login with securely hashed passwords (bcrypt) and sessions
- The very first person who registers automatically becomes **admin**; everyone after
  that registers as a normal visitor
- Admin panel to **Add / Edit / Delete** animals, including image uploa

## Project structure
zoo-management-system/
├── server.js             
├── seed.js               
├── package.json
├── .env.example            
├── config/
│   ├── db.js               
│   └── upload.js           
├── models/
│   ├── User.js              
│   └── Animal.js           
├── middleware/
│   └── auth.js              
├── routes/
│   ├── authRoutes.js         
│   ├── animalRoutes.js       
│   └── adminRoutes.js        
├── views/                  
│   ├── partials/header.ejs & footer.ejs
│   ├── index.ejs, category.ejs, login.ejs, register.ejs
│   └── admin-dashboard.ejs, admin-form.ejs
└── public/
    ├── css/styles.css
    └── images/                


