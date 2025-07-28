# Aurora Bank Website

A full-stack banking web application built with Flask and SQLite.

## Features

User registration and authentication
Account dashboard with real-time balance
Money transfers between accounts
Deposit and withdrawal operations
Transaction history

## Tech Stack

Backend: Python, Flask, SQLite
Frontend: HTML, CSS, JavaScript
Database: SQLite with transaction support
Containerization: Docker, Docker Compose

## Project Structure
├── backend/
│   ├── app.py              # Flask application
│   ├── db_handler.py       # Database operations
│   ├── test_db.py          # Database testing
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── templates/          # HTML pages
│   └── static/            # CSS and JS files
├── Dockerfile
├── docker-compose.yml
└── README.md


## Quick Start

### Run from Docker Hub (Recommended)
docker run -p 5000:5000 ofris99/aurora-bank:latest
Access: http://localhost:5000

### Build Locally with Docker Compose

git clone https://github.com/OfriSchvartz/bank_website.git
cd bank_website
docker-compose up --build


### Manual Setup

git clone https://github.com/OfriSchvartz/bank_website.git
cd bank_website
pip install -r backend/requirements.txt
python backend/app.py

Access: http://127.0.0.1:5000

## Demo

Create an account through the registration page or use existing demo data.

