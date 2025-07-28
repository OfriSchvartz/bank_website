from flask import Flask, render_template, send_from_directory, abort, request, jsonify
import os
import json
import db_handler

frontend_path = os.path.abspath('../frontend')
app = Flask(__name__, template_folder=frontend_path)


# Initialize database on startup
db_handler.init_database()

transactions = {

}



# Page Routes
@app.route('/')
def login_page():
    return render_template('/templates/login.html')


@app.route('/page/login')
def login_redirect():
    return render_template('/templates/login.html')


@app.route('/page/account')
def account_page():
    return render_template('/templates/account.html')


@app.route('/page/register')
def register_page():
    return render_template('/templates/register.html')


@app.route('/page/transfer')
def transfer_page():
    return render_template('/templates/transfer.html')


@app.route('/page/confirmation')
def confirmation_page():
    return render_template('/templates/confirmation.html')


@app.route('/page/recover')
def recover_page():
    return render_template('/templates/recover.html')


# Generic page handler for any additional pages
@app.route('/page/<path:page_name>')
def get_page_name(page_name):
    valid_pages = ['login', 'account', 'register', 'transfer', 'confirmation', 'recover']
    if page_name in valid_pages and os.path.exists(f'{frontend_path}/templates/{page_name}.html'):
        return render_template(f'/templates/{page_name}.html')
    else:
        return abort(404)


# Static File Routes
@app.route('/static/modern-styles.css')
def modern_styles():
    response = send_from_directory(f'{frontend_path}/static', 'modern-styles.css')
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response


@app.route('/static/login.js')
def login_js():
    return send_from_directory(f'{frontend_path}/static', 'login.js')


@app.route('/static/account.js')
def account_js():
    return send_from_directory(f'{frontend_path}/static', 'account.js')


@app.route('/static/register.js')
def register_js():
    return send_from_directory(f'{frontend_path}/static', 'register.js')


@app.route('/static/transfer.js')
def transfer_js():
    return send_from_directory(f'{frontend_path}/static', 'transfer.js')


@app.route('/static/confirmation.js')
def confirmation_js():
    return send_from_directory(f'{frontend_path}/static', 'confirmation.js')


@app.route('/static/recover.js')
def recover_js():
    return send_from_directory(f'{frontend_path}/static', 'recover.js')


# Generic static file handler for any additional assets
@app.route('/static/<path:filename>')
def static_files(filename):
    try:
        return send_from_directory(f'{frontend_path}/static', filename)
    except:
        return abort(404)


# Images (if needed in the future)
@app.route('/images/<path:filename>')
def get_images(filename):
    try:
        return send_from_directory(f'{frontend_path}/images', filename)
    except:
        return abort(404)


# API Routes
@app.route('/api/login', methods=['POST'])
def api_login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": False, "text": "Invalid request data"})

        id = data.get("id")
        password = data.get("password")

        if not id or not password:
            return jsonify({"status": False, "text": "ID and password are required"})

        response = {
            "status": False,
            "text": ""
        }

        response["status"] = db_handler.check_user_credentials(id, password)
        if not response["status"]:
            response["text"] = "Please fill the correct credentials"

        return jsonify(response)
    except Exception as e:
        return jsonify({"status": False, "text": "Login failed. Please try again."})


@app.route('/api/register', methods=['POST'])
def api_register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": False, "text": "Invalid request data"})

        # Extract and validate required fields
        required_fields = ['id', 'first_name', 'last_name', 'date_of_birth', 'gender',
                           'email', 'password', 'phone_number', 'address', 'zipcode']

        for field in required_fields:
            if not data.get(field):
                return jsonify({"status": False, "text": f"{field.replace('_', ' ').title()} is required"})

        response = {
            "status": False,
            "text": ""
        }

        response["status"] = db_handler.insert_user(
            data.get("id"), data.get("first_name"), data.get("last_name"),
            data.get("date_of_birth"), data.get("gender"), data.get("email"),
            data.get("password"), data.get("phone_number"), data.get("address"),
            data.get("zipcode"), 5000
        )

        if not response["status"]:
            response["text"] = "ID already exists"

        return jsonify(response)
    except Exception as e:
        return jsonify({"status": False, "text": "Registration failed. Please try again."})


@app.route('/api/withdraw', methods=['POST'])
def api_withdraw():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": False, "text": "Invalid request data"})

        id = data.get("id")
        amount = data.get("amount")
        description = data.get("description", "Withdrawal")

        if not id or not amount:
            return jsonify({"status": False, "text": "ID and amount are required"})

        if amount <= 0:
            return jsonify({"status": False, "text": "Amount must be greater than 0"})

        response = {
            "status": False,
            "text": "",
            "balance": 0,
            "transactions": []
        }

        # Perform withdrawal
        success, message, new_balance = db_handler.withdraw_money(id, amount, description)

        response["status"] = success
        response["text"] = message
        response["balance"] = new_balance

        if success:
            # Get updated transactions
            transactions = db_handler.get_user_transactions(id, 4)
            response["transactions"] = transactions

        return jsonify(response)
    except Exception as e:
        return jsonify({"status": False, "text": "Withdrawal failed. Please try again."})


@app.route('/api/deposit', methods=['POST'])
def api_deposit():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": False, "text": "Invalid request data"})

        id = data.get("id")
        amount = data.get("amount")
        description = data.get("description", "Deposit")

        if not id or not amount:
            return jsonify({"status": False, "text": "ID and amount are required"})

        if amount <= 0:
            return jsonify({"status": False, "text": "Amount must be greater than 0"})

        response = {
            "status": False,
            "text": "",
            "balance": 0,
            "transactions": []
        }

        # Get current user
        user = db_handler.get_user_by_id(id)

        if not user:
            response["text"] = "User ID not found"
        else:
            # Update balance
            new_balance = user["balance"] + amount

            if db_handler.update_user_balance(id, new_balance):
                # Insert transaction
                if db_handler.insert_transaction(id, "Deposit", description, amount):
                    response["status"] = True
                    response["balance"] = new_balance
                    response["text"] = "Deposit successful"

                    # Get updated transactions
                    transactions = db_handler.get_user_transactions(id, 4)
                    response["transactions"] = transactions
                else:
                    response["text"] = "Failed to record transaction"
            else:
                response["text"] = "Failed to update balance"

        return jsonify(response)
    except Exception as e:
        return jsonify({"status": False, "text": "Deposit failed. Please try again."})


@app.route('/api/get_user_data', methods=['POST'])
def api_get_user_data():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": False, "text": "Invalid request data"})

        id = data.get("id")
        if not id:
            return jsonify({"status": False, "text": "User ID is required"})

        response = {
            "status": False,
            "text": "",
            "balance": 0,
            "transactions": [],
            "user_name": ""
        }

        # Get user data from database
        user = db_handler.get_user_by_id(id)

        if not user:
            response["text"] = "ID isn't registered"
        else:
            response["status"] = True
            response["balance"] = user["balance"]
            response["user_name"] = f"{user['first_name']} {user['last_name']}"

            # Get user transactions
            transactions = db_handler.get_user_transactions(id, 4)
            response["transactions"] = transactions

        return jsonify(response)
    except Exception as e:
        return jsonify({"status": False, "text": "Failed to load user data. Please try again."})


@app.route('/api/transfer', methods=['POST'])
def api_transfer():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": False, "text": "Invalid request data"})

        recipient_name = data.get("recipient_name")
        from_id = data.get("from_id")
        to_id = data.get("to_id")
        amount = data.get("amount")
        description = data.get("description", "Transfer")

        # Validate required fields
        if not all([recipient_name, from_id, to_id, amount]):
            return jsonify({"status": False, "text": "All transfer fields are required"})

        if amount <= 0:
            return jsonify({"status": False, "text": "Amount must be greater than 0"})

        response = {
            "status": False,
            "text": ""
        }

        # Check if both users exist
        from_user = db_handler.get_user_by_id(from_id)
        to_user = db_handler.get_user_by_id(to_id)

        if not from_user:
            response["text"] = "Sender ID isn't registered"
        elif not to_user:
            response["text"] = "Recipient ID isn't registered"
        elif f'{to_user["first_name"]} {to_user["last_name"]}' != recipient_name:
            response["text"] = "The person name isn't found."
        elif from_id == to_id:
            response["text"] = "You can't transfer to yourself"
        else:
            # Perform transfer
            success, message = db_handler.transfer_money(from_id, to_id, amount, description)
            response["status"] = success
            response["text"] = message

        return jsonify(response)
    except Exception as e:
        return jsonify({"status": False, "text": "Transfer failed. Please try again."})


# Error Handlers
@app.errorhandler(404)
def not_found_error(error):
    return render_template('/templates/login.html'), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({"status": False, "text": "Internal server error"}), 500


if __name__ == '__main__':
    app.run(debug=True)