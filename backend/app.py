from flask import Flask ,render_template , send_from_directory, abort
import os

frontend_path = os.path.abspath('../frontend')
app = Flask(__name__, template_folder=frontend_path)

users = {
    "206978082": {
        "first_name" : "Ofri",
        "last_name" : "Schvartz",
        "date_of_birth" : "06/06/1999",
        "gender": "Male",
        "email": "ofrischvartz@gmail.com",
        "password" :  "Aa!23!23",
        "phone" : "0526367408",
        "address": "Shaked 5, Magal",
        "zip" : "2244508"
}
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

@app.route('/login')
def is_valid_user(user_id, user_password):
    global users
    if user_id not in users:
        return False
    if users[user_id]["password"] != user_password:
        return False
    return True


app.run(debug=True)


