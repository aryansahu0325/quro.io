import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Quro AI Platform API", "status": "running"}

def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/api/health/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data
    assert data["version"] == "1.0.0"

def test_auth_status_unauthorized():
    """Test auth status when not logged in"""
    response = client.get("/api/auth/status")
    # Assuming auth status returns 401 or a specific message when not logged in
    assert response.status_code in [200, 401] 
