# Aurora Bank Website

A full-stack banking web application built with Flask and SQLite.

## Features

- User registration and authentication
- Account dashboard with real-time balance
- Money transfers between accounts
- Deposit and withdrawal operations
- Transaction history

## Tech Stack

- **Backend:** Python, Flask, SQLite
- **Frontend:** HTML, CSS, JavaScript
- **Database:** SQLite with transaction support

- **Containerization:** Docker, Docker Compose

## Project Structure

```
├── backend/
│   ├── app.py              # Flask application
│   ├── db_handler.py       # Database operations
│   └── test_db.py          # Database testing
├── frontend/
│   ├── templates/          # HTML pages
│   └── static/            # CSS and JS files
└── README.md
```

## Setup


### Using Docker (Recommended)
```bash
git clone https://github.com/OfriSchvartz/bank_website.git
cd bank_website
docker-compose up --build
```
Access: `http://localhost:5000`

### Manual Setup
1. Clone the repository
2. Install Flask: `pip install flask`
3. Run: `python backend/app.py`
4. Access: `http://127.0.0.1:5000`

## Demo

Create an account through the registration page or use existing demo data.
=======
1. Clone the repository
2. Install Flask: `pip install flask`
3. Run: `python backend/app.py`
4. Access: `http://127.0.0.1:5000`

## Demo

Create an account through the registration page or use existing demo data.
