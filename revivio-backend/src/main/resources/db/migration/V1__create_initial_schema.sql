-- REVIVIO V1: Create Initial Relational Schema

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('CUSTOMER', 'TECHNICIAN', 'ADMIN')),
    phone VARCHAR(20),
    address TEXT,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Brands table
CREATE TABLE brands (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    logo_url VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(100),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Products table (Catalogue)
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    model_number VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    brand_id BIGINT NOT NULL REFERENCES brands(id),
    category_id BIGINT NOT NULL REFERENCES categories(id),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_category ON products(category_id);

-- Warranty Policies table
CREATE TABLE warranty_policies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    duration_months INT NOT NULL,
    coverage_type VARCHAR(20) NOT NULL CHECK (coverage_type IN ('STANDARD', 'PREMIUM', 'EXTENDED')),
    covers_physical_damage BOOLEAN NOT NULL DEFAULT FALSE,
    covers_water_damage BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Customer Products table (Registered Devices)
CREATE TABLE customer_products (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES users(id),
    product_id BIGINT NOT NULL REFERENCES products(id),
    serial_number VARCHAR(200) NOT NULL UNIQUE,
    purchase_date DATE NOT NULL,
    purchase_price NUMERIC(12,2),
    additional_notes TEXT,
    invoice_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_customer_products_customer ON customer_products(customer_id);
CREATE INDEX idx_customer_products_serial ON customer_products(serial_number);

-- Warranties table
CREATE TABLE warranties (
    id BIGSERIAL PRIMARY KEY,
    customer_product_id BIGINT NOT NULL UNIQUE REFERENCES customer_products(id) ON DELETE CASCADE,
    warranty_policy_id BIGINT NOT NULL REFERENCES warranty_policies(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL CHECK (status IN ('ACTIVE', 'EXPIRED', 'PENDING_VERIFICATION', 'VOID')),
    void_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Repair Requests table
CREATE TABLE repair_requests (
    id BIGSERIAL PRIMARY KEY,
    reference_number VARCHAR(30) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL REFERENCES users(id),
    customer_product_id BIGINT NOT NULL REFERENCES customer_products(id),
    issue_category VARCHAR(30) NOT NULL,
    issue_title VARCHAR(300) NOT NULL,
    issue_description TEXT NOT NULL,
    priority VARCHAR(10) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    status VARCHAR(30) NOT NULL DEFAULT 'REQUESTED',
    rejection_reason TEXT,
    admin_notes TEXT,
    technician_notes TEXT,
    diagnosis_notes TEXT,
    repair_actions TEXT,
    completion_notes TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_repair_requests_customer ON repair_requests(customer_id);
CREATE INDEX idx_repair_requests_status ON repair_requests(status);
CREATE INDEX idx_repair_requests_reference ON repair_requests(reference_number);

-- Repair Assignments table
CREATE TABLE repair_assignments (
    id BIGSERIAL PRIMARY KEY,
    repair_request_id BIGINT NOT NULL REFERENCES repair_requests(id) ON DELETE CASCADE,
    technician_id BIGINT NOT NULL REFERENCES users(id),
    assigned_by_id BIGINT NOT NULL REFERENCES users(id),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    assignment_notes TEXT,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);
CREATE INDEX idx_repair_assignments_repair ON repair_assignments(repair_request_id);
CREATE INDEX idx_repair_assignments_technician ON repair_assignments(technician_id);

-- Repair History table
CREATE TABLE repair_history (
    id BIGSERIAL PRIMARY KEY,
    repair_request_id BIGINT NOT NULL REFERENCES repair_requests(id) ON DELETE CASCADE,
    previous_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    actor_id BIGINT NOT NULL,
    actor_name VARCHAR(200) NOT NULL,
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_repair_history_repair ON repair_history(repair_request_id);

-- Notifications table
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(300) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    reference_id BIGINT,
    reference_type VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read);

-- Attachments table
CREATE TABLE attachments (
    id BIGSERIAL PRIMARY KEY,
    original_filename VARCHAR(300) NOT NULL,
    stored_filename VARCHAR(300) NOT NULL UNIQUE,
    content_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    category VARCHAR(30) NOT NULL CHECK (category IN ('INVOICE', 'REPAIR_IMAGE', 'SERVICE_REPORT', 'OTHER')),
    reference_id BIGINT,
    reference_type VARCHAR(50),
    uploaded_by_id BIGINT NOT NULL REFERENCES users(id),
    storage_path VARCHAR(500) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_attachments_reference ON attachments(reference_id, reference_type);
