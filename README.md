# REVIVIO — Product Warranty & Repair Service Platform

> **"Bring products back to life."**

Revivio is a full-stack, enterprise-grade product-care platform connecting **Customers**, **Service Technicians**, and **Platform Administrators** in a single ecosystem. It streamlines the end-to-end hardware lifecycle: customer product registration, automated warranty eligibility calculation, service ticket lodging with invoice/media verification, administrative claim triage and dispatch, technician bench diagnosis, and repair certification.

Designed with a modern, minimalist visual identity inspired by Linear, Stripe, and Apple, Revivio is built strictly as a deterministic, **non-AI modular monolith** ensuring complete reliability, security, and data integrity.

---

## 🎨 Brand Identity & Design System

The product identity is defined by two signature colors:
- **Primary Brand Color — Midnight Navy**: `#142B3B` (Structure, precision, and trust)
- **Secondary Brand Color — Revive Mint**: `#27C6A5` (Renewal, restoration, and vitality)

### Comprehensive Theme Support
Revivio features a full, seamless Light and Dark mode system:
- **Light Theme**: Main Background `#F5F7F8`, Surface `#FFFFFF`, Primary Text `#142B3B`, Accent `#27C6A5`.
- **Dark Theme**: Main Background `#101E2C`, Surface `#172A3A`, Elevated Surface `#1C3040`, Primary Text `#F5F8FA`, Accent `#27C6A5`.
- **Theme Persistence**: Synced with `localStorage`, respecting system OS preferences without layout shift or FOUC (Flash of Unstyled Content).
- **Custom Brandmark**: SVG-composed renewal ring with precision wrench iconography.

---

## 🛠️ Technology Stack

### Frontend Architecture
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS v4 + `@tailwindcss/postcss`
- **Component Primitives**: shadcn/ui design patterns & Lucide React icons
- **State & Data Fetching**: Axios client with JWT Bearer interceptors, TanStack Query, React Context
- **Routing**: React Router DOM v6 with role-based route protection
- **Data Visualizations**: Recharts (responsive area and donut charts matching both light & dark tokens)

### Backend Architecture
- **Runtime & Language**: Java 17, Spring Boot 3.3.5 (Modular Monolith)
- **Security**: Spring Security with stateless JWT filter (`jjwt` 0.12.6) and BCrypt password encryption
- **Persistence & ORM**: Spring Data JPA, Hibernate, PostgreSQL
- **Schema Management**: Flyway database migrations (`V1__create_initial_schema.sql`, `V2__seed_development_data.sql`)
- **API Documentation**: Springdoc OpenAPI / Swagger UI 2.6.0
- **Validation**: Jakarta Bean Validation (`@Valid`, `@PastOrPresent`, `@NotBlank`, etc.)

### Infrastructure & Containerization
- **Containerization**: Multi-stage Docker builds (Temurin Java 17 Alpine runtime, Node 20 builder, Nginx Alpine)
- **Orchestration**: Docker Compose with PostgreSQL 16 healthchecks and persistent volumes

---

## 👥 Role-Based Access Matrix

| Capability | Customer | Technician | Administrator |
| :--- | :---: | :---: | :---: |
| Self-Registration & Authentication | ✅ | ❌ *(controlled)* | ❌ *(controlled)* |
| Product Registration & Invoice Upload | ✅ | ❌ | ❌ |
| View Hardware Inventory & Warranty Status | ✅ *(own)* | ❌ | ✅ *(all)* |
| Submit Service / Repair Requests | ✅ | ❌ | ❌ |
| Live Repair Status Stepper (6-stage timeline) | ✅ *(own)* | ✅ *(assigned)* | ✅ *(all)* |
| Claim Coverage Review (Approve/Reject) | ❌ | ❌ | ✅ |
| Technician Dispatch & Bench Allocation | ❌ | ❌ | ✅ |
| Record Diagnostic Inspection & Bench Notes | ❌ | ✅ | ❌ |
| Update Repair State & Certification | ❌ | ✅ | ❌ |
| Catalog, Brand, Category & Policy Management | ❌ | ❌ | ✅ |
| Platform Analytics & Executive Dashboard | ❌ | ❌ | ✅ |
| Confidential Internal Admin Notes Visibility | ❌ *(masked)* | ❌ *(masked)* | ✅ *(full)* |

---

## 📱 Complete Screen Catalog (22 Polished Screens)

### 1. Public Experience
1. **Landing Page (`/`)**: Hero section, interactive live repair simulator card, bento grid feature showcases, 5-stage product care lifecycle, customer testimonials, and quick role portal links.
2. **Login Page (`/login`)**: Secure authentication with fast-fill demo pills for instant one-click login as Customer, Technician, or Admin.
3. **Register Page (`/register`)**: Customer account creation with client and server validation.

### 2. Customer Portal (`/customer/*`)
4. **Dashboard (`/customer/dashboard`)**: Metric cards (registered devices, active warranties, pending repairs), recent activity log, and quick-action shortcuts.
5. **My Products (`/customer/products`)**: Filterable hardware collection with live warranty status badges.
6. **Register Product (`/customer/products/register`)**: 3-step registration wizard with brand/model cascading selector, serial uniqueness check, and invoice upload.
7. **Product Detail (`/customer/products/:id`)**: Comprehensive hardware inspection, warranty coverage expiry countdown, and repair ticket history.
8. **My Repairs (`/customer/repairs`)**: Service request directory with status and priority filtering.
9. **Submit Repair (`/customer/repairs/new`)**: Interactive claim form with hardware selection, issue categorization, problem description, and photo attachments.
10. **Repair Detail (`/customer/repairs/:id`)**: 6-stage interactive timeline stepper (`REQUESTED` → `UNDER_REVIEW` → `APPROVED` → `ASSIGNED` → `IN_REPAIR` → `COMPLETED`), warranty coverage determination, and care advice.
11. **Notifications (`/customer/notifications`)**: Real-time event notifications for warranty and repair status changes.
12. **Profile & Settings (`/customer/settings`)**: Personal details, notification preferences, and account management.

### 3. Technician Workbench (`/technician/*`)
13. **Dashboard (`/technician/dashboard`)**: Workbench overview, active bench tickets, pending diagnoses, and completion velocity.
14. **Assigned Jobs (`/technician/jobs`)**: Filterable job queue with priority tags and customer reported symptoms.
15. **Job Detail Workbench (`/technician/jobs/:id`)**: 3-panel workbench: hardware specs, diagnostic recording panel, repair action logger, and certification submission.
16. **Completed Jobs History (`/technician/completed`)**: Searchable archive of certified repairs.

### 4. Admin Management Center (`/admin/*`)
17. **Executive Dashboard (`/admin/dashboard`)**: High-level platform KPIs, repair volume trends (Recharts area chart), and issue distribution breakdown (Recharts donut chart).
18. **Repairs Triage (`/admin/repairs`)**: Operations center for filtering, triaging, and allocating incoming service tickets.
19. **Repair Review & Dispatch (`/admin/repairs/:id`)**: Claim adjudication (Approve with Warranty / Deny with justification) and technician assignment modal.
20. **Catalog Management (`/admin/products`, `/admin/categories`, `/admin/brands`)**: Full management of brands, categories, and hardware models.
21. **Warranty Policy Engine (`/admin/warranty-policies`)**: Configurable policies (standard, extended, accidental damage) with duration rules.
22. **User Management (`/admin/customers`, `/admin/technicians`)**: User account auditing, status toggles, and technician certifications.

---

## 🔑 Development Seed Accounts & Credentials

The database migrations (`V2__seed_development_data.sql`) pre-populate realistic seed data with real BCrypt password hashes. You can log in immediately with the following accounts:

| Role | Email | Password | Pre-loaded Data |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@revivio.com` | `admin123` | Full access to platform analytics, catalog, claims triage, and dispatch. |
| **Technician 1** | `tech1@revivio.com` | `tech123` | Assigned to hardware repairs on Apple MacBook Pro and Dell XPS. |
| **Technician 2** | `tech2@revivio.com` | `tech123` | Certified electronics technician ready for bench dispatch. |
| **Customer 1** | `customer1@revivio.com` | `cust123` | Owns registered MacBook Pro M3 and iPhone 15 Pro with active warranties. |
| **Customer 2** | `customer2@revivio.com` | `cust123` | Owns registered Sony WH-1000XM5 and Dell XPS 15 with pending repairs. |

> 💡 **Tip**: On the `/login` page, you can simply click any of the **Demo Account Pills** to auto-fill credentials instantly!

---

## 🚀 Quick Start Guide

### Option 1: Run with Docker Compose (Recommended)

Ensure Docker Desktop is running, then execute from the root directory:

```bash
docker compose up --build
```

- **Frontend App**: [http://localhost:5173](http://localhost:5173) or [http://localhost](http://localhost)
- **Backend API**: [http://localhost:8080/api/v1](http://localhost:8080/api/v1)
- **Swagger UI**: [http://localhost:8080/api/v1/swagger-ui.html](http://localhost:8080/api/v1/swagger-ui.html)
- **PostgreSQL Database**: `localhost:5432` (`revivio_db` / `revivio_user` / `revivio_pass`)

---

### Option 2: Local Development Setup

#### Prerequisites
- Windows 11 / macOS / Linux
- Java 17 (JDK)
- Apache Maven 3.8+
- Node.js 18+ and npm
- PostgreSQL 14+ running locally on port 5432

#### 1. Database Setup
Create the PostgreSQL database and user:
```sql
CREATE DATABASE revivio_db;
CREATE USER revivio_user WITH ENCRYPTED PASSWORD 'revivio_pass';
GRANT ALL PRIVILEGES ON DATABASE revivio_db TO revivio_user;
```

#### 2. Start the Backend (Spring Boot)
```powershell
cd revivio-backend
mvn clean spring-boot:run
```
Flyway will automatically execute migrations `V1` and `V2`, setting up all tables and seeding initial accounts. The backend will start on `http://localhost:8080/api/v1`.

#### 3. Start the Frontend (React + Vite)
In a separate terminal:
```powershell
cd revivio-frontend
npm install
npm run dev
```
The application will launch on `http://localhost:5173`.

---

## 🧪 Testing & Verification

### Backend Automated Test Suite
Revivio includes a full JUnit 5 and Mockito unit test suite verifying core business rules:
- `AuthServiceTest`: User registration, BCrypt password verification, duplicate email prevention, and JWT token issuance.
- `CustomerProductServiceTest`: Product registration with warranty issuance, serial number deduplication, and ownership authorization checks.
- `RepairServiceTest`: Service ticket lodging, reference number sequence formatting (`RV-YYYY-NNNNN`), single active ticket enforcement per serial, technician assignment, and customer data masking.
- `RepairWorkflowServiceTest`: Deterministic state machine transition validation (`REQUESTED` → `UNDER_REVIEW` → `APPROVED` → `ASSIGNED` → `IN_REPAIR` → `COMPLETED`) and illegal transition prevention.
- `WarrantyServiceTest`: 12-month and 24-month duration calculation, inclusive boundary verification, and dynamic expired-state recalculation.

Run the tests:
```powershell
cd revivio-backend
mvn test
```
**Test Results**: `31 tests run, 0 failures, 0 errors, 0 skipped` (`BUILD SUCCESS`).

### Frontend Production Build
Verify the frontend bundle:
```powershell
cd revivio-frontend
npm run build
```
Builds cleanly with zero errors in ~14 seconds.

---

## 📂 Project Structure

```text
Revivio/
├── docker-compose.yml              # Multi-container orchestration (PostgreSQL, Backend, Frontend)
├── .env.example                    # Template environment variables
├── .gitignore                      # Git exclusion rules
├── README.md                       # Master platform documentation
│
├── docs/                           # Architecture and specification documents
│   ├── database-design.md          # Complete entity relationships, constraints & SQL schema
│   └── ui-specification.md         # Design system tokens, color palettes & 22-screen UI specs
│
├── revivio-backend/                # Spring Boot 3.3.5 Modular Monolith
│   ├── Dockerfile                  # Multi-stage Java 17 Alpine runtime container
│   ├── pom.xml                     # Maven project configuration
│   └── src/
│       ├── main/
│       │   ├── java/com/revivio/
│       │   │   ├── assignment/     # Technician assignment domain
│       │   │   ├── attachment/     # File storage and attachment domain
│       │   │   ├── auth/           # Authentication, JWT, and user registration
│       │   │   ├── brand/          # Hardware brand catalog
│       │   │   ├── category/       # Product category catalog
│       │   │   ├── common/         # API responses, pagination wrappers, utils
│       │   │   ├── config/         # Security, CORS, and OpenAPI Swagger configurations
│       │   │   ├── customerproduct/# Customer hardware registration domain
│       │   │   ├── dashboard/      # Role-specific analytics and dashboard metrics
│       │   │   ├── exception/      # Global error handling and custom exceptions
│       │   │   ├── notification/   # Notification event dispatch domain
│       │   │   ├── product/        # Hardware model catalog
│       │   │   ├── repair/         # Service ticket & repair workflow state machine
│       │   │   ├── security/       # JWT authentication filter and UserDetails service
│       │   │   ├── user/           # User account and role management
│       │   │   └── warranty/       # Warranty policies and calculation engine
│       │   └── resources/
│       │       ├── application.yml # Core Spring Boot configuration
│       │       └── db/migration/   # Flyway SQL migrations (V1 schema, V2 seed data)
│       └── test/                   # JUnit 5 & Mockito test suites (31 unit tests)
│
└── revivio-frontend/               # React 18 + Vite + Tailwind CSS Application
    ├── Dockerfile                  # Multi-stage Node builder + Nginx Alpine container
    ├── nginx.conf                  # Nginx SPA router and API reverse proxy
    ├── package.json
    ├── tailwind.config.js
    └── src/
        ├── components/             # Reusable UI primitives (Button, Card, Modal, Table, etc.)
        │   ├── brand/              # Custom Revivio brandmark SVG
        │   └── routing/            # Role-based protected routes
        ├── contexts/               # AuthContext (JWT) and ThemeContext (Light/Dark)
        ├── layouts/                # Public, Customer, Technician, and Admin navigation layouts
        ├── lib/                    # Axios API service client and date/currency formatting utils
        └── pages/                  # All 22 screen implementations across all roles
```

---

## 🔒 Security Best Practices Implemented

1. **Stateless JWT Authorization**: Cryptographically signed tokens verified on every restricted request.
2. **Strict Role-Based Access Control**: URLs and service methods are secured by role (`ROLE_CUSTOMER`, `ROLE_TECHNICIAN`, `ROLE_ADMIN`).
3. **Data Masking & Confidentiality**: Sensitive administrative fields (such as `adminNotes` or internal claim fraud checks) are stripped before returning responses to customers.
4. **Ownership Verification**: Customers can only inspect or lodge claims for hardware serial numbers registered to their own account.
5. **Single Active Repair Constraint**: Prevents duplicate active tickets on the same physical unit.
6. **Deterministic Workflow Enforcement**: Technicians and administrators cannot bypass legal state machine stages.
