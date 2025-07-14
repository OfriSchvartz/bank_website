import os
import db_handler

# Delete the old database file
if os.path.exists('bank_website.db'):
    os.remove('bank_website.db')
    print("Old database deleted")

# Create new database
db_handler.init_database()

# Test insertion again
result = db_handler.insert_user(
    "999999999", "Test", "User", "1990-01-01",
    "Male", "test@example.com", "Password123!",  # Note: "Male" with capital M
    "0551234567", "Test Address", "12345", 5000
)

print(f"Test insertion result: {result}")