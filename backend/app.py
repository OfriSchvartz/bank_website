from flask import Flask ,render_template , send_from_directory, abort , request
import os 
import json
from datetime import datetime

frontend_path = os.path.abspath('../frontend')
app = Flask(__name__, template_folder=frontend_path)

users = {
    "206978082": {
        "first_name" : "Ofri",
        "last_name" : "Schvartz",
        "date_of_birth" : "06/06/1999",
        "gender": "Male",
        "email": "ofrischvartz@gmail.com",
        "password" : "Aa!23!23",
        "phone" : "0526367408",
        "address": "Shaked 5, Magal",
        "zip" : "2244508",
        "balance" : 5000
        },
    "206978083": {
        "first_name" : "John",
        "last_name" : "Doe",
        "date_of_birth" : "01/01/1990",
        "gender" : "Male",
        "email" : "JohnDoe@gmail.com",
        "password" : "Ss!23123",
        "phone" : "0557958234",
        "address": "123 Main St, Springfield",
        "zip" : "1234567",
        "balance" : 5000
    },
}
transactions = {

}
@app.route('/page/<path:page_name>')
def get_page_name(page_name):
    if os.path.exists(f'{frontend_path}/templates/{page_name}.html'):
        return render_template(f'/templates/{page_name}.html')
    else:
        return abort(404)

@app.route('/')
def login_page():
    return render_template('/templates/login.html')

@app.route('/static/styles.css')
def get_styles():
    return send_from_directory(f'{frontend_path}/static', 'styles.css')

@app.route('/static/account.css')
def account_styles():
    return send_from_directory(f'{frontend_path}/static', 'account.css')

@app.route('/images/bank.jpg')
def get_bank_image():
    return send_from_directory(f'{frontend_path}/images', 'bank.jpg')

@app.route('/api/login', methods=['POST'])
def is_valid_user():
    global users

    data = request.json
    id = data.get("id")
    password = data.get("password")

    response = {
        "status": False,
        "text": ""
    }
    if id not in users:
        response["text"] = "ID isn't registerd"
    elif users[id]["password"] != password:
        response["text"] = "Password is incorrect"
    else:
        response["status"] = True
        response["text"] = "Valid User"
    return json.dumps(response)

@app.route('/api/register', methods=['POST'])
def register_user():
    global users

    data = request.json
    id = data.get("id")
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    date_of_birth = data.get("date_of_birth")
    gender = data.get("gender")
    email = data.get("email")
    password = data.get("password")
    phone_number = data.get("phone_number")
    address = data.get("address")
    zipcode = data.get("zipcode")

    response = {
        "status": False,
        "text": ""
    }
    if id in users:
        response["text"] = "ID already exists"
    else:
        response["status"] = True
        users[id] = {
            "first_name": first_name,
            "last_name": last_name,
            "date_of_birth": date_of_birth,
            "gender": gender,
            "email": email,
            "password": password,
            "phone_number": phone_number,
            "address": address,
            "zipcode": zipcode,
            "balance": 5000
        }
        response["text"] = "User registered successfully"
    return json.dumps(response)

@app.route('/api/withdraw', methods=['POST'])
def handle_withdraw():
    global users
    data = request.json

    id = data.get("id")
    amount = data.get("amount")
    description = data.get("description")
    response = {
        "status": False,
        "text": ""
    }
    if id not in users:
        response["text"] = "ID isn't registered"
    elif users[id]["balance"] < amount:
        response["text"] = f"Insufficient balance: you have only {users[id]['balance']} in your account"
    else:
        new_transaction = {
            "type": "withdraw",
            "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),

        }


app.run(debug=True)


