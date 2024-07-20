FROM python:3.10

# Working directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY . .

# Expose API to specific port
EXPOSE 8000

# Init the app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
