CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_email VARCHAR(255),
    payment_method VARCHAR(50),
    total_price DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'pending',
    settlement_status VARCHAR(50) DEFAULT 'pending',
    commission_amount DECIMAL(10, 2) DEFAULT 0,
    settled_amount DECIMAL(10, 2) DEFAULT 0,
    settled_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
