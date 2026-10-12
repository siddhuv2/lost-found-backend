# College Lost and Found Portal — Full Stack Web Application

A full-stack web application designed for college campuses (students, faculty, and administration) to report lost belongings, log found items, search missing items by category or location, and securely claim matching items.

Built with **Java Spring Boot 3**, **Spring Security (JWT + BCrypt)**, **Spring Data JPA**, **MySQL**, and **React (Vite)**.

---

## 1. System Requirements & Prerequisites

Ensure the following tools are installed on your machine:

1. **Java Development Kit (JDK)**: Java 21 or higher (LTS recommended)
   - Verify with: `java -version`
2. **Apache Maven**: Version 3.8+ or higher
   - Verify with: `mvn -version`
3. **Node.js & npm**: Node 18+ or 20+ (with npm 9+)
   - Verify with: `node -v` and `npm -v`
4. **MySQL Database Server**: MySQL 8.0+
   - Ensure MySQL service is running on `localhost:3306`

---

## 2. Database Setup (MySQL)

Open your MySQL client (MySQL Workbench, MySQL Shell, or command line):

```sql
CREATE DATABASE IF NOT EXISTS college_lost_found
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

> **Note:** Spring Boot JPA is pre-configured with `spring.jpa.hibernate.ddl-auto=update` and `createDatabaseIfNotExist=true`. If the database credentials are valid, Hibernate will automatically create all tables (`users`, `items`, `claims`) and indexes on initial startup.

---

## 3. Configuration & Environment Variables

### Backend Configuration (`college-lost-found/backend`)
Configuration is located in `src/main/resources/application.properties`. You can either:
1. Update your credentials in `application.properties`:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   ```
2. Or set environment variables before running:
   - On Windows (PowerShell):
     ```powershell
     $env:DB_USERNAME="root"
     $env:DB_PASSWORD="your_mysql_password"
     ```
   - On Linux / macOS:
     ```bash
     export DB_USERNAME="root"
     export DB_PASSWORD="your_mysql_password"
     ```

### Frontend Configuration (`college-lost-found/frontend`)
The frontend is pre-configured to use the Vite proxy forwarding `/api` and `/uploads` requests directly to `http://localhost:8080`.

---

## 4. Running the Application

### A. Run Spring Boot Backend
Navigate to the backend directory and run:

```bash
cd college-lost-found/backend
mvn spring-boot:run
```

The Spring Boot backend will start at:
👉 **`http://localhost:8080`**

### B. Run React Frontend
In a separate terminal, navigate to the frontend directory:

```bash
cd college-lost-found/frontend
npm install
npm run dev
```

The React Vite application will start at:
👉 **`http://localhost:5173`**

---

## 5. Testing the Key Workflows

### 1. User Registration
1. Open `http://localhost:5173` in your browser.
2. Click **Register** on the landing page or navbar.
3. Fill out the registration form:
   - **Full Name**: e.g., Alex Johnson
   - **College Email**: e.g., alex@college.edu
   - **Student/Staff ID**: e.g., CS-2024-101
   - **Department**: e.g., Computer Science & Engineering
   - **Password**: `password123`
   - **Confirm Password**: `password123`
4. Submit the form. Passwords are encrypted with BCrypt and a secure JWT token is issued.

### 2. User Login & Dashboard
1. Log in with your registered college email and password.
2. The **Dashboard** displays:
   - Personalized welcome banner with department & student ID.
   - Live summary counts of active Lost and Found items.
   - Campus-wide search bar.
   - Direct quick actions: "Report Lost Item" & "Report Found Item".
   - Recently reported items feed.

### 3. Reporting a Lost Item
1. Click **Report Lost Item** (or navigate to `/report-lost`).
2. Enter item title, category (e.g., Electronics, ID Card, Bags, Keys), location lost (e.g., Central Library 2nd Floor), date, description, optional photo, and additional identifying details.
3. Submit the report. It immediately appears in **Browse Items** and **My Reports**.

### 4. Reporting a Found Item
1. Click **Report Found Item** (or navigate to `/report-found`).
2. Provide details of the item found without disclosing sensitive credentials.
3. Submit the report. The item status becomes `ACTIVE` and visible for matching.

### 5. Browse, Filter & Search
1. Click **Browse Items** in the navigation bar.
2. Filter by:
   - **Type**: Lost Belongings or Found Items.
   - **Category**: ID Card, Electronics, Books, Bags, etc.
   - **Location**: Specific building or room filter.
   - **Search Query**: Real-time keyword search.

### 6. Claim Process & Verification
1. Open an item in the details view (`/items/{id}`).
2. If the item belongs to another student, click **Submit Claim Request**.
3. State confidential proof of ownership (e.g., stickers, wallpapers, engraved initials).
4. The claimant's request will appear under the reporter's **My Reports &rarr; Incoming Claims Received** tab.
5. The reporter can **Accept Claim** or **Reject Claim** with a custom handover response note.
6. When accepted, the item status updates to `RETURNED` / `RECOVERED` and resolves duplicate claims automatically.

---

## 6. REST API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token | No |
| `POST` | `/api/auth/logout` | Invalidate / sign out user session | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (Bearer) |
| `GET` | `/api/items` | Search & paginate lost/found items | No |
| `GET` | `/api/items/{id}` | Retrieve single item details | No |
| `GET` | `/api/items/summary` | Dashboard statistics & recent items | No |
| `POST` | `/api/items` | Create new lost or found report (supports image) | Yes (Bearer) |
| `PUT` | `/api/items/{id}` | Update item report | Yes (Owner only) |
| `DELETE` | `/api/items/{id}` | Delete item report | Yes (Owner only) |
| `GET` | `/api/items/my-reports`| Get items reported by current user | Yes (Bearer) |
| `POST` | `/api/items/{id}/claims` | Submit an ownership claim request | Yes (Bearer) |
| `GET` | `/api/claims/received` | View claims received for current user's items | Yes (Bearer) |
| `GET` | `/api/claims/my-claims` | View claims submitted by current user | Yes (Bearer) |
| `PATCH`| `/api/claims/{id}/decision` | Accept or reject claim with response note | Yes (Owner only) |

---

## 7. Common Issues & Solutions

1. **MySQL Access Denied (`Communications link failure` or `Access denied for user 'root'`)**:
   - Ensure the MySQL Windows service is running (`Get-Service MySQL80` or `net start MySQL80`).
   - Check `spring.datasource.password` in `application.properties` or provide `$env:DB_PASSWORD`.
2. **Port 8080 or 5173 already in use**:
   - Change server port in `application.properties` (e.g. `server.port=8081`).
   - Or run Vite with `npm run dev -- --port 5174`.
3. **Image uploads not showing**:
   - Images are saved safely to `college-lost-found/backend/uploads` and served statically via Spring MVC Web configuration at `/uploads/{filename}`.
