package com.khanathikana.config;

import com.khanathikana.entity.*;
import com.khanathikana.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TableRepository tableRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private MenuItemRepository menuItemRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setPasscode("1234");
            admin.setCardId("CARD001");
            admin.setRole("ADMIN");
            admin.setActive(true);
            userRepository.save(admin);
        }
        
        if (tableRepository.count() == 0) {
            for (int i = 1; i <= 20; i++) {
                RestaurantTable table = new RestaurantTable();
                table.setTableNumber("AC" + i);
                table.setSection("AC");
                table.setCapacity(4);
                table.setStatus("BLANK");
                tableRepository.save(table);
            }
            
            for (int i = 21; i <= 40; i++) {
                RestaurantTable table = new RestaurantTable();
                table.setTableNumber("G" + i);
                table.setSection("Garden");
                table.setCapacity(4);
                table.setStatus("BLANK");
                tableRepository.save(table);
            }
            
            for (int i = 41; i <= 50; i++) {
                RestaurantTable table = new RestaurantTable();
                table.setTableNumber("NA" + i);
                table.setSection("Non-AC");
                table.setCapacity(4);
                table.setStatus("BLANK");
                tableRepository.save(table);
            }
        }
        
        if (categoryRepository.count() == 0) {
            Category beverages = new Category(null, "Beverages", "Hot and cold beverages", true, 1);
            categoryRepository.save(beverages);
            
            Category favorites = new Category(null, "Favorite Items", "Customer favorites", true, 2);
            categoryRepository.save(favorites);
            
            Category indian = new Category(null, "Indian", "Indian cuisine", true, 3);
            categoryRepository.save(indian);
            
            Category mocktails = new Category(null, "Mocktails", "Non-alcoholic drinks", true, 4);
            categoryRepository.save(mocktails);
            
            Category cocktails = new Category(null, "Cocktails", "Alcoholic beverages", true, 5);
            categoryRepository.save(cocktails);
            
            Category softDrinks = new Category(null, "Soft Drinks", "Carbonated drinks", true, 6);
            categoryRepository.save(softDrinks);
            
            if (menuItemRepository.count() == 0) {
                menuItemRepository.save(new MenuItem(null, "Chaas", "Traditional buttermilk", 40.0, beverages, true, true, null));
                menuItemRepository.save(new MenuItem(null, "Chai", "Indian tea", 30.0, beverages, true, true, null));
                menuItemRepository.save(new MenuItem(null, "Coffee", "Hot coffee", 50.0, beverages, true, false, null));
                menuItemRepository.save(new MenuItem(null, "Limbu Paani", "Fresh lemonade", 35.0, beverages, true, true, null));
                menuItemRepository.save(new MenuItem(null, "Soda", "Plain soda", 25.0, softDrinks, true, false, null));
                menuItemRepository.save(new MenuItem(null, "Thandai", "Traditional Indian drink", 45.0, beverages, true, false, null));
                menuItemRepository.save(new MenuItem(null, "Virgin Pina Colada", "Tropical mocktail", 120.0, mocktails, true, true, null));
                menuItemRepository.save(new MenuItem(null, "Mango Lassi", "Sweet mango yogurt drink", 60.0, beverages, true, true, null));
                menuItemRepository.save(new MenuItem(null, "Masala Dosa", "South Indian crepe", 80.0, indian, true, true, null));
                menuItemRepository.save(new MenuItem(null, "Paneer Tikka", "Grilled cottage cheese", 150.0, indian, true, true, null));
                menuItemRepository.save(new MenuItem(null, "Butter Chicken", "Creamy chicken curry", 250.0, indian, true, false, null));
                menuItemRepository.save(new MenuItem(null, "Dal Makhani", "Black lentil curry", 180.0, indian, true, false, null));
                menuItemRepository.save(new MenuItem(null, "Biryani", "Fragrant rice dish", 220.0, indian, true, true, null));
                menuItemRepository.save(new MenuItem(null, "Naan", "Indian bread", 40.0, indian, true, false, null));
                menuItemRepository.save(new MenuItem(null, "Blue Lagoon", "Blue mocktail", 100.0, mocktails, true, false, null));
                menuItemRepository.save(new MenuItem(null, "Mojito", "Mint mocktail", 90.0, mocktails, true, false, null));
                menuItemRepository.save(new MenuItem(null, "Coca Cola", "Soft drink", 40.0, softDrinks, true, false, null));
                menuItemRepository.save(new MenuItem(null, "Sprite", "Lemon soft drink", 40.0, softDrinks, true, false, null));
            }
        }
    }
}
