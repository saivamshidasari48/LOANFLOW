
# 🚀 LOANFLOW – Enterprise Loan Management Platform

LOANFLOW is a production-ready full-stack web application that streamlines the end-to-end loan lifecycle for financial organizations.
It enables **customers to apply for loans**, **analysts to review and approve applications**, and **administrators to manage users and system metrics** — all secured using **JWT authentication and role-based access control**.

This project demonstrates real-world software engineering practices including scalable backend APIs, cloud deployment, secure authentication, and modern responsive UI design.

---

## 🌐 Live Demo

> 🔗 **Frontend:** *(Vercel URL coming soon)*
> 🔗 **Backend API:** *(Cloud Run URL coming soon)*

### 🔑 Demo Credentials

| Role     | Username | Password    |
| -------- | -------- | ----------- |
| Admin    | admin    | admin123    |
| Analyst  | analyst3 | Ana         |
| Customer | sai      | Sai         |

> ⚠️ Demo data may reset periodically.

---

## 🎯 Business Value

✔ Automates loan application processing
✔ Reduces manual review effort
✔ Improves auditability and traceability
✔ Enforces secure role-based access
✔ Designed for cloud scalability

---

## ✨ Core Features

### 🔐 Security & Authentication

* JWT-based stateless authentication
* Role-based authorization (ADMIN / ANALYST / CUSTOMER)
* BCrypt password encryption
* Secure REST APIs with Spring Security
* CORS protection

### 👤 Customer Portal

* Submit loan applications
* Track application status in real time
* View loan history

### 🧑‍💼 Analyst Dashboard

* Review loan applications
* Approve or reject loans
* Filter and paginate loan records
* Real-time status updates

### 🛠 Admin Console

* View system metrics dashboard
* Manage users and roles
* Activate / deactivate accounts
* Monitor platform usage

### 🎨 UI/UX

* Responsive Material UI design
* Professional dashboard layout
* Animated cards and loading skeletons
* Mobile-friendly experience

---

## 🧰 Technology Stack

### Frontend

* React (TypeScript)
* Material UI (MUI)
* Axios
* React Router
* Vercel Hosting

### Backend

* Java 17
* Spring Boot
* Spring Security
* JWT Authentication
* REST APIs
* Hibernate / JPA
* Docker
* Google Cloud Run

### Database

* PostgreSQL (Supabase)

### DevOps

* GitHub
* CI/CD pipelines
* Cloud containerization

---

## 🏗 Architecture Overview

```
[ React Frontend (Vercel) ]
            |
            v
[ Spring Boot API (Google Cloud Run) ]
            |
            v
[ PostgreSQL Database (Supabase) ]
```

---

## 📸 Screenshots

> Add screenshots after deployment:

```
/screenshots
 ├─ login.png
 ├─ admin-dashboard.png
 ├─ analyst-dashboard.png
 ├─ loan-approval.png
 └─ mobile-view.png
```

Example markdown:

```md
![Admin Dashboard](screenshots/admin-dashboard.png)
```

---

## 📂 Project Structure

```
LOANFLOW/
 ├── backend/        → Spring Boot backend
 ├── frontend/       → React frontend
 ├── .gitignore
 ├── README.md
```

---

## ⚙️ Local Development Setup

### ✅ Prerequisites

* Java 17+
* Node.js 18+
* Maven
* PostgreSQL or Supabase
* Git

---

### ▶️ Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs at:

```
http://localhost:8080
```

---

### ▶️ Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

### 🔑 Environment Variables (Backend)

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/loanflow
spring.datasource.username=postgres
spring.datasource.password=postgres

jwt.secret=your_secure_secret_key
```

---

## 🔌 API Reference (Sample)

### 🔐 Authentication

```
POST /api/auth/login
POST /api/auth/register
```

### 👤 Loans

```
POST   /api/loans/apply
GET    /api/loans
PATCH  /api/loans/{id}/approve
PATCH  /api/loans/{id}/reject
```

### 🛠 Admin

```
GET  /api/admin/metrics
GET  /api/admin/users
PUT  /api/admin/users/{id}/role
PUT  /api/admin/users/{id}/active
```

---

## 🚀 Deployment

### Frontend

* Hosted on **Vercel**

### Backend

* Containerized using Docker
* Deployed on **Google Cloud Run**

### Database

* Hosted on **Supabase PostgreSQL**

---

## 📈 Future Enhancements

* Loan analytics dashboard
* Email notifications
* Audit logging
* Document uploads
* CI/CD automation
* Role hierarchy

---

## 👨‍💻 Author

**Sai Vamshi Dasari**
Master’s in Computer Science
Full Stack Software Engineer

📧 Email: [saivamshidasari48@email.com](mailto:your@email.com)
🔗 LinkedIn: [https://www.linkedin.com/in/sai-vamshi-dasari-91279639a/](https://linkedin.com/in/your-profile)
💻 GitHub: [https://github.com/your-username](https://github.com/your-username)

---

## ⭐ Support

If you find this project useful, please ⭐ the repository and feel free to connect!

---

---

