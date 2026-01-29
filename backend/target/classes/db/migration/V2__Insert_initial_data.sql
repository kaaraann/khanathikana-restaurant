-- V2: Insert initial data

-- Insert default admin user
-- Password: admin123 (BCrypt encrypted)
INSERT INTO users (username, password, passcode, card_id, role, active) VALUES
('admin', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', '1234', 'CARD001', 'ADMIN', TRUE);

-- Insert tables
-- AC Section (20 tables)
INSERT INTO tables (table_number, section, capacity, status) VALUES
('AC1', 'AC', 4, 'BLANK'),
('AC2', 'AC', 4, 'BLANK'),
('AC3', 'AC', 4, 'BLANK'),
('AC4', 'AC', 4, 'BLANK'),
('AC5', 'AC', 4, 'BLANK'),
('AC6', 'AC', 6, 'BLANK'),
('AC7', 'AC', 6, 'BLANK'),
('AC8', 'AC', 4, 'BLANK'),
('AC9', 'AC', 4, 'BLANK'),
('AC10', 'AC', 4, 'BLANK'),
('AC11', 'AC', 4, 'BLANK'),
('AC12', 'AC', 4, 'BLANK'),
('AC13', 'AC', 6, 'BLANK'),
('AC14', 'AC', 6, 'BLANK'),
('AC15', 'AC', 4, 'BLANK'),
('AC16', 'AC', 4, 'BLANK'),
('AC17', 'AC', 4, 'BLANK'),
('AC18', 'AC', 4, 'BLANK'),
('AC19', 'AC', 8, 'BLANK'),
('AC20', 'AC', 8, 'BLANK');

-- Garden Section (20 tables)
INSERT INTO tables (table_number, section, capacity, status) VALUES
('G21', 'Garden', 4, 'BLANK'),
('G22', 'Garden', 4, 'BLANK'),
('G23', 'Garden', 4, 'BLANK'),
('G24', 'Garden', 4, 'BLANK'),
('G25', 'Garden', 4, 'BLANK'),
('G26', 'Garden', 6, 'BLANK'),
('G27', 'Garden', 6, 'BLANK'),
('G28', 'Garden', 4, 'BLANK'),
('G29', 'Garden', 4, 'BLANK'),
('G30', 'Garden', 4, 'BLANK'),
('G31', 'Garden', 4, 'BLANK'),
('G32', 'Garden', 4, 'BLANK'),
('G33', 'Garden', 6, 'BLANK'),
('G34', 'Garden', 6, 'BLANK'),
('G35', 'Garden', 4, 'BLANK'),
('G36', 'Garden', 4, 'BLANK'),
('G37', 'Garden', 4, 'BLANK'),
('G38', 'Garden', 4, 'BLANK'),
('G39', 'Garden', 8, 'BLANK'),
('G40', 'Garden', 8, 'BLANK');

-- Non-AC Section (10 tables)
INSERT INTO tables (table_number, section, capacity, status) VALUES
('NA41', 'Non-AC', 4, 'BLANK'),
('NA42', 'Non-AC', 4, 'BLANK'),
('NA43', 'Non-AC', 4, 'BLANK'),
('NA44', 'Non-AC', 4, 'BLANK'),
('NA45', 'Non-AC', 6, 'BLANK'),
('NA46', 'Non-AC', 6, 'BLANK'),
('NA47', 'Non-AC', 4, 'BLANK'),
('NA48', 'Non-AC', 4, 'BLANK'),
('NA49', 'Non-AC', 8, 'BLANK'),
('NA50', 'Non-AC', 8, 'BLANK');

-- Insert categories
INSERT INTO categories (name, description, active, display_order) VALUES
('Beverages', 'Hot and cold beverages', TRUE, 1),
('Favorite Items', 'Customer favorite dishes', TRUE, 2),
('Indian', 'Traditional Indian cuisine', TRUE, 3),
('Mocktails', 'Non-alcoholic refreshing drinks', TRUE, 4),
('Cocktails', 'Alcoholic beverages', TRUE, 5),
('Soft Drinks', 'Carbonated and packaged drinks', TRUE, 6),
('Starters', 'Appetizers and starters', TRUE, 7),
('Main Course', 'Main dishes', TRUE, 8),
('Desserts', 'Sweet dishes', TRUE, 9),
('Breads', 'Indian breads', TRUE, 10);

-- Insert menu items
INSERT INTO menu_items (name, description, price, category_id, available, is_favorite) VALUES
-- Beverages
('Chaas', 'Traditional buttermilk', 40, 1, TRUE, TRUE),
('Chai', 'Indian tea', 30, 1, TRUE, TRUE),
('Coffee', 'Hot coffee', 50, 1, TRUE, FALSE),
('Limbu Paani', 'Fresh lemonade', 35, 1, TRUE, TRUE),
('Thandai', 'Traditional Indian drink', 45, 1, TRUE, FALSE),
('Mango Lassi', 'Sweet mango yogurt drink', 60, 1, TRUE, TRUE),

-- Mocktails
('Virgin Pina Colada', 'Tropical mocktail', 120, 4, TRUE, TRUE),
('Blue Lagoon', 'Blue mocktail', 100, 4, TRUE, FALSE),
('Mojito', 'Mint mocktail', 90, 4, TRUE, FALSE),

-- Soft Drinks
('Soda', 'Plain soda', 25, 6, TRUE, FALSE),
('Coca Cola', 'Soft drink', 40, 6, TRUE, FALSE),
('Sprite', 'Lemon soft drink', 40, 6, TRUE, FALSE),

-- Indian Main Course
('Masala Dosa', 'South Indian crepe', 80, 3, TRUE, TRUE),
('Paneer Tikka', 'Grilled cottage cheese', 150, 3, TRUE, TRUE),
('Butter Chicken', 'Creamy chicken curry', 250, 3, TRUE, FALSE),
('Dal Makhani', 'Black lentil curry', 180, 3, TRUE, FALSE),
('Biryani', 'Fragrant rice dish', 220, 3, TRUE, TRUE),
('Palak Paneer', 'Spinach with cottage cheese', 170, 3, TRUE, FALSE),
('Chole Bhature', 'Chickpea curry with fried bread', 120, 3, TRUE, TRUE),

-- Breads
('Naan', 'Indian bread', 40, 10, TRUE, FALSE),
('Butter Naan', 'Butter topped naan', 50, 10, TRUE, FALSE),
('Garlic Naan', 'Garlic flavored naan', 60, 10, TRUE, FALSE),
('Roti', 'Whole wheat flatbread', 30, 10, TRUE, FALSE);
