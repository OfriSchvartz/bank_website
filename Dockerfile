FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt . 
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./backend
COPY frontend/ ./frontend
RUN mkdir -p /app/backend
EXPOSE 5000
ENV FLASK_APP=backend/app.py
ENV FLASK_ENV=production
WORKDIR /app/backend
CMD ["python", "app.py"]
