-- REVIVIO V2: Seed Development Data

-- Seed Users (Passwords: admin123, tech123, cust123)
-- Admin
INSERT INTO users (id, first_name, last_name, email, password, role, phone, enabled, created_at, updated_at)
VALUES (1, 'Arun', 'Kulkarni', 'admin@revivio.com', '$2a$10$ZuXOT7XCfXDLwUMugAQZyOGJILsFsyWwunt4XZFMyvlcR1JetevcC', 'ADMIN', '+91 98000 11111', TRUE, NOW(), NOW());

-- Technicians
INSERT INTO users (id, first_name, last_name, email, password, role, phone, enabled, created_at, updated_at)
VALUES (2, 'Sarah', 'Jenkins', 'tech1@revivio.com', '$2a$10$As2ffzuAcfcvkeR5Ib7lB.Gg6Tb83YJgOPPSZA92c6G8AsKfx4NUi', 'TECHNICIAN', '+91 98000 22222', TRUE, NOW(), NOW());

INSERT INTO users (id, first_name, last_name, email, password, role, phone, enabled, created_at, updated_at)
VALUES (3, 'David', 'Miller', 'tech2@revivio.com', '$2a$10$As2ffzuAcfcvkeR5Ib7lB.Gg6Tb83YJgOPPSZA92c6G8AsKfx4NUi', 'TECHNICIAN', '+91 98000 33333', TRUE, NOW(), NOW());

-- Customers
INSERT INTO users (id, first_name, last_name, email, password, role, phone, enabled, created_at, updated_at)
VALUES (4, 'Alex', 'Morgan', 'customer1@revivio.com', '$2a$10$m0DpeQSesPVzUb9OwHkKYeArRuofy/9ZL6STKN8QavDVo1jHj55RK', 'CUSTOMER', '+91 98000 44444', TRUE, NOW(), NOW());

INSERT INTO users (id, first_name, last_name, email, password, role, phone, enabled, created_at, updated_at)
VALUES (5, 'Rohit', 'Sharma', 'customer2@revivio.com', '$2a$10$m0DpeQSesPVzUb9OwHkKYeArRuofy/9ZL6STKN8QavDVo1jHj55RK', 'CUSTOMER', '+91 98000 55555', TRUE, NOW(), NOW());

-- Seed Brands
INSERT INTO brands (id, name, description, active, created_at, updated_at)
VALUES
(1, 'Apple', 'Premium Consumer Electronics & Computers', TRUE, NOW(), NOW()),
(2, 'Samsung', 'Smartphones, Displays & Household Appliances', TRUE, NOW(), NOW()),
(3, 'Sony', 'High-end Audio, Bravia Displays & Imaging', TRUE, NOW(), NOW());

-- Seed Categories
INSERT INTO categories (id, name, description, icon_name, active, created_at, updated_at)
VALUES
(1, 'Smartphone', 'Cellular handheld devices and tablets', 'Smartphone', TRUE, NOW(), NOW()),
(2, 'Laptop', 'Notebooks, MacBooks and portable computers', 'Laptop', TRUE, NOW(), NOW()),
(3, 'Television', 'OLED, LED and Smart Televisions', 'Tv', TRUE, NOW(), NOW()),
(4, 'Audio', 'Noise cancelling headphones and audio systems', 'Headphones', TRUE, NOW(), NOW());

-- Seed Products
INSERT INTO products (id, name, model_number, description, brand_id, category_id, active, created_at, updated_at)
VALUES
(1, 'iPhone 15 Pro', 'A3101', 'Titanium design with A17 Pro chip', 1, 1, TRUE, NOW(), NOW()),
(2, 'MacBook Pro 16" M3', 'A2991', '16-inch Liquid Retina XDR display with M3 Max', 1, 2, TRUE, NOW(), NOW()),
(3, 'Galaxy S24 Ultra', 'SM-S928B', 'Titanium frame with Snapdragon 8 Gen 3', 2, 1, TRUE, NOW(), NOW()),
(4, 'Galaxy Tab S9', 'SM-X710', 'Dynamic AMOLED 2X tablet with S Pen', 2, 1, TRUE, NOW(), NOW()),
(5, 'Bravia 65" 4K OLED', 'XR-65A80L', 'Cognitive Processor XR OLED display', 3, 3, TRUE, NOW(), NOW()),
(6, 'WH-1000XM5 Wireless Headphones', 'WH1000XM5/B', 'Industry-leading noise cancellation headset', 3, 4, TRUE, NOW(), NOW());

-- Seed Warranty Policies
INSERT INTO warranty_policies (id, name, description, duration_months, coverage_type, covers_physical_damage, covers_water_damage, active, created_at, updated_at)
VALUES
(1, 'Standard Consumer 12M', '12 months limited manufacturer hardware coverage', 12, 'STANDARD', FALSE, FALSE, TRUE, NOW(), NOW()),
(2, 'Revivio Care+ 24M', '24 months comprehensive care including accidental protection', 24, 'PREMIUM', TRUE, TRUE, TRUE, NOW(), NOW()),
(3, 'Enterprise Platinum 36M', '36 months extended enterprise priority bench repair', 36, 'EXTENDED', TRUE, FALSE, TRUE, NOW(), NOW());

-- Seed Customer Products (For customer Alex Morgan, id=4)
INSERT INTO customer_products (id, customer_id, product_id, serial_number, purchase_date, purchase_price, additional_notes, invoice_verified, created_at, updated_at)
VALUES
(1, 4, 1, 'APP-IP15P-9921', '2025-09-20', 134900.00, 'Purchased from Apple Store BKC', TRUE, NOW() - INTERVAL '120 days', NOW()),
(2, 4, 2, 'APP-MBP16-3021', '2025-01-15', 249900.00, 'Direct developer machine', TRUE, NOW() - INTERVAL '200 days', NOW()),
(3, 4, 6, 'SNY-WH10-8832', '2024-01-10', 29990.00, 'Flight travel headset', TRUE, NOW() - INTERVAL '400 days', NOW());

-- Seed Warranties
-- Product 1: 24-month Care+ (Active until Sept 2027)
INSERT INTO warranties (id, customer_product_id, warranty_policy_id, start_date, end_date, status, created_at, updated_at)
VALUES (1, 1, 2, '2025-09-20', '2027-09-20', 'ACTIVE', NOW() - INTERVAL '120 days', NOW());

-- Product 2: 36-month Enterprise (Active until Jan 2028)
INSERT INTO warranties (id, customer_product_id, warranty_policy_id, start_date, end_date, status, created_at, updated_at)
VALUES (2, 2, 3, '2025-01-15', '2028-01-15', 'ACTIVE', NOW() - INTERVAL '200 days', NOW());

-- Product 3: 12-month Standard (Expired Jan 2025)
INSERT INTO warranties (id, customer_product_id, warranty_policy_id, start_date, end_date, status, created_at, updated_at)
VALUES (3, 3, 1, '2024-01-10', '2025-01-10', 'EXPIRED', NOW() - INTERVAL '400 days', NOW());

-- Seed Repair Request
INSERT INTO repair_requests (id, reference_number, customer_id, customer_product_id, issue_category, issue_title, issue_description, priority, status, technician_notes, diagnosis_notes, repair_actions, created_at, updated_at)
VALUES (
    1,
    'RV-2026-00001',
    4,
    1,
    'BATTERY',
    'Battery draining faster than expected',
    'Battery health diagnostic shows sudden drop under standard browser operations.',
    'HIGH',
    'IN_REPAIR',
    'Disassembled display bezel. Power controller calibrated and replacement battery initialized.',
    'Battery capacity tested at 71% health with swollen cell telemetry.',
    'Replaced internal lithium pack with genuine OEM module.',
    NOW() - INTERVAL '2 days',
    NOW()
);

-- Seed Assignment
INSERT INTO repair_assignments (id, repair_request_id, technician_id, assigned_by_id, active, assignment_notes, assigned_at)
VALUES (1, 1, 2, 1, TRUE, 'High priority customer unit. Expeditious turnaround requested.', NOW() - INTERVAL '1 day');

-- Seed Repair History
INSERT INTO repair_history (id, repair_request_id, previous_status, new_status, actor_id, actor_name, comment, created_at)
VALUES
(1, 1, NULL, 'REQUESTED', 4, 'Alex Morgan', 'Service claim submitted via customer portal', NOW() - INTERVAL '2 days'),
(2, 1, 'REQUESTED', 'UNDER_REVIEW', 1, 'Arun Kulkarni', 'Warranty verified under Revivio Care+ policy', NOW() - INTERVAL '1 day 18 hours'),
(3, 1, 'UNDER_REVIEW', 'APPROVED', 1, 'Arun Kulkarni', 'Claim approved for hardware component repair', NOW() - INTERVAL '1 day 16 hours'),
(4, 1, 'APPROVED', 'ASSIGNED', 1, 'Arun Kulkarni', 'Assigned to Lead Technician Sarah Jenkins', NOW() - INTERVAL '1 day'),
(5, 1, 'ASSIGNED', 'IN_REPAIR', 2, 'Sarah Jenkins', 'Bench repair commenced. Disassembling unit.', NOW() - INTERVAL '12 hours');

-- Seed Notifications
INSERT INTO notifications (id, user_id, type, title, message, read, reference_id, reference_type, created_at)
VALUES
(1, 4, 'REPAIR_STATUS_CHANGED', 'Repair Commenced', 'Technician Sarah Jenkins has started work on your iPhone 15 Pro (RV-2026-00001).', FALSE, 1, 'REPAIR_REQUEST', NOW() - INTERVAL '12 hours'),
(2, 4, 'WARRANTY_VERIFIED', 'Warranty Coverage Active', 'MacBook Pro 16" M3 was confirmed with 36 Months Enterprise Care.', TRUE, 2, 'CUSTOMER_PRODUCT', NOW() - INTERVAL '10 days'),
(3, 2, 'TECHNICIAN_ASSIGNED', 'New Bench Assignment', 'You have been assigned repair job RV-2026-00001 (iPhone 15 Pro).', TRUE, 1, 'REPAIR_REQUEST', NOW() - INTERVAL '1 day');

-- Reset sequences to prevent key collision on subsequent inserts
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('brands_id_seq', (SELECT MAX(id) FROM brands));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('warranty_policies_id_seq', (SELECT MAX(id) FROM warranty_policies));
SELECT setval('customer_products_id_seq', (SELECT MAX(id) FROM customer_products));
SELECT setval('warranties_id_seq', (SELECT MAX(id) FROM warranties));
SELECT setval('repair_requests_id_seq', (SELECT MAX(id) FROM repair_requests));
SELECT setval('repair_assignments_id_seq', (SELECT MAX(id) FROM repair_assignments));
SELECT setval('repair_history_id_seq', (SELECT MAX(id) FROM repair_history));
SELECT setval('notifications_id_seq', (SELECT MAX(id) FROM notifications));
