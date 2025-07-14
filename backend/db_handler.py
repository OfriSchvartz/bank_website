import sqlite3
from datetime import datetime


def get_connection():
    """Get a new database connection"""
    return sqlite3.connect('bank_website.db')


def init_database():
    """Initialize the database with required tables"""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Create users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                date_of_birth TEXT NOT NULL,
                gender TEXT NOT NULL,
                email TEXT NOT NULL,
                password TEXT NOT NULL,
                phone_number TEXT NOT NULL,
                address TEXT NOT NULL,
                zipcode TEXT NOT NULL,
                balance REAL DEFAULT 5000.0
            )
        ''')

        # Create transactions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                type TEXT NOT NULL,
                date TEXT NOT NULL,
                description TEXT,
                amount REAL NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')

        conn.commit()
        print("Database initialized successfully.")

    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        conn.close()


def insert_user(id, first_name, last_name, date_of_birth,
                gender, email, password, phone_number, address,
                zipcode, balance):
    """Insert a new user into the database"""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        print(f"DEBUG: Attempting to insert user with ID: '{id}'")
        print(f"DEBUG: User data: {first_name}, {last_name}, {email}")

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
        print(f"DEBUG: User {first_name} {last_name} inserted successfully.")

        # Verify insertion
        cursor.execute('SELECT COUNT(*) FROM users WHERE id = ?', (id,))
        count = cursor.fetchone()[0]
        print(f"DEBUG: User count with ID {id}: {count}")

        return True
    except sqlite3.IntegrityError as e:
        print(f"DEBUG: IntegrityError - User with ID {id} already exists: {e}")
        return False
    except Exception as e:
        print(f"DEBUG: Error inserting user: {e}")
        print(f"DEBUG: Error type: {type(e)}")
        return False
    finally:
        conn.close()


def check_user_credentials(user_id, password):
    """Check if user credentials are valid"""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        print(f"DEBUG: Checking login for ID: '{user_id}', Password: '{password}'")

        # First, let's see what users exist
        cursor.execute('SELECT id, password FROM users')
        all_users = cursor.fetchall()
        print(f"DEBUG: All users in database: {all_users}")

        # Now check the specific login
        cursor.execute('''
            SELECT * FROM users
            WHERE id = ? AND password = ?
        ''', (user_id, password))
        user = cursor.fetchone()
        print(f"DEBUG: Login result: {user is not None}")

        if user:
            print(f"DEBUG: Login successful for user: {user[1]} {user[2]}")
        else:
            print(f"DEBUG: No matching user found")

        return user is not None
    except Exception as e:
        print(f"Error checking credentials: {e}")
        return False
    finally:
        conn.close()


def get_user_by_id(user_id):
    """Get user data by ID"""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
        user = cursor.fetchone()
        if user:
            # Convert to dictionary format matching your current code
            columns = ['id', 'first_name', 'last_name', 'date_of_birth', 'gender',
                       'email', 'password', 'phone_number', 'address', 'zipcode', 'balance']
            return dict(zip(columns, user))
        return None
    except Exception as e:
        print(f"Error getting user: {e}")
        return None
    finally:
        conn.close()


def update_user_balance(user_id, new_balance):
    """Update user's balance"""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('UPDATE users SET balance = ? WHERE id = ?', (new_balance, user_id))
        conn.commit()
        return cursor.rowcount > 0
    except Exception as e:
        print(f"Error updating balance: {e}")
        return False
    finally:
        conn.close()


def insert_transaction(user_id, transaction_type, description, amount):
    """Insert a new transaction"""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        date_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute('''
            INSERT INTO transactions (user_id, type, date, description, amount)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, transaction_type, date_str, description, amount))
        conn.commit()
        return True
    except Exception as e:
        print(f"Error inserting transaction: {e}")
        return False
    finally:
        conn.close()


def get_user_transactions(user_id, limit=4):
    """Get recent transactions for a user"""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('''
            SELECT type, date, description, amount 
            FROM transactions 
            WHERE user_id = ? 
            ORDER BY id DESC 
            LIMIT ?
        ''', (user_id, limit))

        transactions = []
        for row in cursor.fetchall():
            transactions.append({
                "type": row[0],
                "date": row[1],
                "description": row[2],
                "amount": row[3]
            })
        return transactions
    except Exception as e:
        print(f"Error getting transactions: {e}")
        return []
    finally:
        conn.close()


def transfer_money(from_id, to_id, amount, description):
    """Transfer money between two users"""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Start transaction
        cursor.execute('BEGIN TRANSACTION')

        # Check if both users exist and get their current balances
        cursor.execute('SELECT balance FROM users WHERE id = ?', (from_id,))
        from_user = cursor.fetchone()
        if not from_user:
            return False, "Sender ID not found"

        cursor.execute('SELECT balance FROM users WHERE id = ?', (to_id,))
        to_user = cursor.fetchone()
        if not to_user:
            return False, "Recipient ID not found"

        from_balance = from_user[0]
        to_balance = to_user[0]

        # Check if sender has sufficient balance
        if from_balance < amount:
            return False, f"Insufficient balance: you have only {from_balance} in your account"

        # Update balances
        new_from_balance = from_balance - amount
        new_to_balance = to_balance + amount

        cursor.execute('UPDATE users SET balance = ? WHERE id = ?', (new_from_balance, from_id))
        cursor.execute('UPDATE users SET balance = ? WHERE id = ?', (new_to_balance, to_id))

        # Insert transactions for both users
        date_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        cursor.execute('''
            INSERT INTO transactions (user_id, type, date, description, amount)
            VALUES (?, ?, ?, ?, ?)
        ''', (from_id, "Transfer", date_str, f"Transfer to {to_id}: {description}", -amount))

        cursor.execute('''
            INSERT INTO transactions (user_id, type, date, description, amount)
            VALUES (?, ?, ?, ?, ?)
        ''', (to_id, "Transfer", date_str, f"Transfer from {from_id}: {description}", amount))

        # Commit transaction
        conn.commit()
        return True, "Transfer successful"

    except Exception as e:
        # Rollback on error
        conn.rollback()
        print(f"Error during transfer: {e}")
        return False, f"Transfer failed: {e}"
    finally:
        conn.close()


def withdraw_money(user_id, amount, description):
    """Withdraw money from user's account"""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Start transaction
        cursor.execute('BEGIN TRANSACTION')

        # Get current balance
        cursor.execute('SELECT balance FROM users WHERE id = ?', (user_id,))
        user = cursor.fetchone()
        if not user:
            return False, "User ID not found", 0

        current_balance = user[0]

        # Check if user has sufficient balance
        if current_balance < amount:
            return False, f"Insufficient balance: you have only {current_balance} in your account", current_balance

        # Update balance
        new_balance = current_balance - amount
        cursor.execute('UPDATE users SET balance = ? WHERE id = ?', (new_balance, user_id))

        # Insert transaction
        date_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute('''
            INSERT INTO transactions (user_id, type, date, description, amount)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, "Withdraw", date_str, description, -amount))

        # Commit transaction
        conn.commit()
        return True, "Withdrawal successful", new_balance

    except Exception as e:
        # Rollback on error
        conn.rollback()
        print(f"Error during withdrawal: {e}")
        return False, f"Withdrawal failed: {e}", 0
    finally:
        conn.close()


# Initialize database when module is imported
if __name__ == "__main__":
    init_database()
