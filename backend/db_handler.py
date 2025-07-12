import sqlite3


conn = sqlite3.connect('bank_website.db')
cursor = conn.cursor()

def insert_user(id, first_name, last_name, date_of_birth,
                gender, email, password, phone_number, address,
                zipcode, balance):
    try:
        cursor.execute('''
                  INSERT INTO users (
                      id, first_name, last_name, date_of_birth, gender, email,
                      password, phone_number, address, zipcode, balance
                  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              ''', (
            id, first_name, last_name, date_of_birth, gender,
            email, password, phone_number, address, zipcode, balance
        ))

        conn.commit()
        print(f"User {first_name} {last_name} inserted successfully.")
        return True
    except Exception as e:
        print(f"Error inserting user: {e}")
    return False

def check_user_credentials(user_id, password):
    try:
        cursor.execute('''
            SELECT * FROM users
            WHERE user_id = ? AND password = ?
        ''', (user_id, password))

        user = cursor.fetchone()
        if user is None:
            return False
        else:
            return True
    except Exception as e:
        print(f"Error checking credentials: {e}")
        return False

conn.commit()
conn.close()

