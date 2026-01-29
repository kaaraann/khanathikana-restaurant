-- V3: Remove Favorite Items category and add more menu items

-- Delete the Favorite Items category (ID 2)
DELETE FROM categories WHERE name = 'Favorite Items';

-- Add more Beverages
INSERT INTO menu_items (name, description, price, category_id, available, is_favorite) VALUES
('Green Tea', 'Healthy green tea', 35, 1, TRUE, FALSE),
('Black Tea', 'Strong black tea', 30, 1, TRUE, FALSE),
('Masala Chai', 'Spiced Indian tea', 35, 1, TRUE, TRUE),
('Cold Coffee', 'Iced coffee drink', 70, 1, TRUE, TRUE),
('Hot Chocolate', 'Rich chocolate drink', 80, 1, TRUE, FALSE),
('Badam Milk', 'Almond flavored milk', 60, 1, TRUE, FALSE),
('Rose Milk', 'Rose flavored milk', 55, 1, TRUE, FALSE),
('Sweet Lassi', 'Sweet yogurt drink', 50, 1, TRUE, TRUE),
('Salt Lassi', 'Salted yogurt drink', 45, 1, TRUE, FALSE),
('Jal Jeera', 'Cumin flavored drink', 40, 1, TRUE, FALSE);

-- Add more Mocktails
INSERT INTO menu_items (name, description, price, category_id, available, is_favorite) VALUES
('Shirley Temple', 'Classic mocktail', 95, 4, TRUE, FALSE),
('Watermelon Cooler', 'Fresh watermelon drink', 110, 4, TRUE, TRUE),
('Mango Mojito', 'Mango flavored mojito', 105, 4, TRUE, FALSE),
('Strawberry Daiquiri', 'Virgin strawberry drink', 115, 4, TRUE, FALSE),
('Peach Iced Tea', 'Peach flavored tea', 85, 4, TRUE, FALSE),
('Lemon Mint Cooler', 'Refreshing lemon mint', 80, 4, TRUE, TRUE);

-- Add Cocktails
INSERT INTO menu_items (name, description, price, category_id, available, is_favorite) VALUES
('Whiskey Sour', 'Classic whiskey cocktail', 250, 5, TRUE, FALSE),
('Margarita', 'Tequila based cocktail', 280, 5, TRUE, TRUE),
('Long Island Iced Tea', 'Strong mixed cocktail', 350, 5, TRUE, FALSE),
('Cosmopolitan', 'Vodka cranberry cocktail', 300, 5, TRUE, FALSE),
('Bloody Mary', 'Vodka tomato cocktail', 270, 5, TRUE, FALSE),
('Pina Colada', 'Rum coconut cocktail', 320, 5, TRUE, TRUE),
('Mai Tai', 'Tropical rum cocktail', 310, 5, TRUE, FALSE);

-- Add more Soft Drinks
INSERT INTO menu_items (name, description, price, category_id, available, is_favorite) VALUES
('Pepsi', 'Cola soft drink', 40, 6, TRUE, FALSE),
('Fanta', 'Orange soft drink', 40, 6, TRUE, FALSE),
('7UP', 'Lemon soft drink', 40, 6, TRUE, FALSE),
('Thumbs Up', 'Indian cola', 40, 6, TRUE, FALSE),
('Limca', 'Lemon soft drink', 40, 6, TRUE, FALSE),
('Mountain Dew', 'Citrus soft drink', 40, 6, TRUE, FALSE),
('Mineral Water', 'Bottled water', 20, 6, TRUE, FALSE);

-- Add Starters
INSERT INTO menu_items (name, description, price, category_id, available, is_favorite) VALUES
('Veg Spring Rolls', 'Crispy vegetable rolls', 120, 7, TRUE, TRUE),
('Chicken Wings', 'Spicy chicken wings', 180, 7, TRUE, TRUE),
('Paneer Pakora', 'Cottage cheese fritters', 140, 7, TRUE, FALSE),
('Veg Manchurian', 'Indo-Chinese appetizer', 130, 7, TRUE, TRUE),
('Chicken 65', 'Spicy fried chicken', 190, 7, TRUE, TRUE),
('Fish Fingers', 'Crispy fish strips', 200, 7, TRUE, FALSE),
('Hara Bhara Kabab', 'Spinach potato patties', 110, 7, TRUE, FALSE),
('Aloo Tikki', 'Potato cutlets', 90, 7, TRUE, TRUE),
('Samosa', 'Fried pastry with filling', 40, 7, TRUE, TRUE),
('Onion Rings', 'Crispy fried onion rings', 100, 7, TRUE, FALSE),
('Corn Cheese Balls', 'Corn and cheese fritters', 130, 7, TRUE, FALSE),
('Mushroom Tikka', 'Grilled mushrooms', 160, 7, TRUE, FALSE);

-- Add more Indian dishes
INSERT INTO menu_items (name, description, price, category_id, available, is_favorite) VALUES
('Kadai Paneer', 'Cottage cheese in spicy gravy', 180, 3, TRUE, TRUE),
('Shahi Paneer', 'Paneer in rich creamy gravy', 190, 3, TRUE, FALSE),
('Malai Kofta', 'Cheese dumplings in gravy', 170, 3, TRUE, FALSE),
('Aloo Gobi', 'Potato and cauliflower curry', 140, 3, TRUE, FALSE),
('Bhindi Masala', 'Okra curry', 130, 3, TRUE, FALSE),
('Rajma', 'Red kidney beans curry', 150, 3, TRUE, TRUE),
('Chana Masala', 'Chickpea curry', 140, 3, TRUE, FALSE),
('Veg Kolhapuri', 'Spicy mixed vegetable curry', 160, 3, TRUE, FALSE),
('Chicken Tikka Masala', 'Grilled chicken in gravy', 260, 3, TRUE, TRUE),
('Chicken Curry', 'Traditional chicken curry', 240, 3, TRUE, FALSE),
('Mutton Rogan Josh', 'Kashmiri mutton curry', 320, 3, TRUE, FALSE),
('Fish Curry', 'Coastal style fish curry', 280, 3, TRUE, FALSE),
('Prawn Masala', 'Spicy prawn curry', 350, 3, TRUE, FALSE),
('Egg Curry', 'Boiled eggs in gravy', 120, 3, TRUE, FALSE);

-- Add Main Course items
INSERT INTO menu_items (name, description, price, category_id, available, is_favorite) VALUES
('Veg Biryani', 'Fragrant vegetable rice', 180, 8, TRUE, TRUE),
('Chicken Biryani', 'Aromatic chicken rice', 240, 8, TRUE, TRUE),
('Mutton Biryani', 'Spiced mutton rice', 300, 8, TRUE, TRUE),
('Egg Biryani', 'Egg flavored rice', 160, 8, TRUE, FALSE),
('Veg Pulao', 'Mildly spiced rice', 140, 8, TRUE, FALSE),
('Jeera Rice', 'Cumin flavored rice', 120, 8, TRUE, FALSE),
('Fried Rice', 'Indo-Chinese rice', 150, 8, TRUE, TRUE),
('Hakka Noodles', 'Stir fried noodles', 140, 8, TRUE, TRUE),
('Chowmein', 'Chinese style noodles', 130, 8, TRUE, FALSE),
('Pasta Alfredo', 'Creamy white pasta', 180, 8, TRUE, FALSE),
('Pasta Arrabiata', 'Spicy red pasta', 170, 8, TRUE, FALSE);

-- Add Desserts
INSERT INTO menu_items (name, description, price, category_id, available, is_favorite) VALUES
('Gulab Jamun', 'Sweet milk dumplings', 60, 9, TRUE, TRUE),
('Rasgulla', 'Spongy cheese balls in syrup', 70, 9, TRUE, TRUE),
('Rasmalai', 'Cheese patties in cream', 80, 9, TRUE, TRUE),
('Jalebi', 'Sweet crispy spirals', 50, 9, TRUE, FALSE),
('Ice Cream', 'Assorted flavors', 70, 9, TRUE, TRUE),
('Kulfi', 'Indian ice cream', 60, 9, TRUE, FALSE),
('Gajar Halwa', 'Carrot pudding', 90, 9, TRUE, FALSE),
('Kheer', 'Rice pudding', 70, 9, TRUE, FALSE),
('Brownie with Ice Cream', 'Chocolate brownie dessert', 120, 9, TRUE, TRUE),
('Tiramisu', 'Italian coffee dessert', 150, 9, TRUE, FALSE),
('Chocolate Lava Cake', 'Molten chocolate cake', 140, 9, TRUE, TRUE);

-- Add more Breads
INSERT INTO menu_items (name, description, price, category_id, available, is_favorite) VALUES
('Tandoori Roti', 'Clay oven flatbread', 35, 10, TRUE, FALSE),
('Missi Roti', 'Gram flour flatbread', 40, 10, TRUE, FALSE),
('Paratha', 'Layered flatbread', 45, 10, TRUE, TRUE),
('Aloo Paratha', 'Potato stuffed bread', 60, 10, TRUE, TRUE),
('Paneer Paratha', 'Cheese stuffed bread', 70, 10, TRUE, FALSE),
('Laccha Paratha', 'Multi-layered bread', 55, 10, TRUE, FALSE),
('Cheese Naan', 'Cheese stuffed naan', 80, 10, TRUE, TRUE),
('Kashmiri Naan', 'Sweet naan with dry fruits', 90, 10, TRUE, FALSE),
('Kulcha', 'Leavened flatbread', 50, 10, TRUE, FALSE),
('Bhatura', 'Fried puffed bread', 50, 10, TRUE, TRUE);
