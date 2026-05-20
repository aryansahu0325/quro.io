import sys
import os
import time

# Add the current directory to sys.path so we can import from backend
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

import httpx

BASE_URL = "http://localhost:8000"

def test_health_endpoint():
    print("\n--- [TEST 1: Health & Diagnostics Endpoint] ---")
    try:
        response = httpx.get(f"{BASE_URL}/api/health/")
        print(f"Status Code: {response.status_code}")
        print("Response JSON:")
        import json
        print(json.dumps(response.json(), indent=2))
        if response.status_code == 200:
            print("SUCCESS: Health check retrieved successfully!")
        elif response.status_code == 503:
            print("DEGRADED: System is partially unhealthy, returned 503 Service Unavailable")
        else:
            print(f"FAILED: Unexpected status code {response.status_code}")
    except Exception as e:
        print(f"Health check request FAILED: {e}")

def test_favicon_endpoint():
    print("\n--- [TEST 2: Favicon 204 Route] ---")
    try:
        response = httpx.get(f"{BASE_URL}/favicon.ico")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 204:
            print("SUCCESS: Favicon endpoint returned 204 No Content!")
        else:
            print(f"FAILED: Favicon endpoint returned {response.status_code}")
    except Exception as e:
        print(f"Favicon request FAILED: {e}")

def test_auth_register_405():
    print("\n--- [TEST 3: Custom 405 Method Not Allowed Handler] ---")
    try:
        response = httpx.get(f"{BASE_URL}/api/auth/register")
        print(f"Status Code: {response.status_code}")
        print("Response JSON:")
        import json
        print(json.dumps(response.json(), indent=2))
        
        data = response.json()
        if response.status_code == 405 and data.get("status") == "error":
            print("SUCCESS: Custom 405 handler returned structured industry-grade JSON response!")
        else:
            print(f"FAILED: Custom 405 handler check failed. Data: {data}")
    except Exception as e:
        print(f"Auth 405 check FAILED: {e}")

def test_cache_service_resilience():
    print("\n--- [TEST 4: Redis Fallback Cache Service Check] ---")
    try:
        from services.cache_service import cache_service
        print(f"Cache fallback status (use_fallback): {cache_service.use_fallback}")
        
        # Perform set/get operations to verify they complete cleanly
        test_key = f"resilience_test_key_{int(time.time())}"
        test_val = {"status": "ok", "source": "resilience_script"}
        
        print(f"Writing key '{test_key}' to cache...")
        cache_service.set(test_key, test_val, expire=60)
        
        print("Retrieving key from cache...")
        retrieved = cache_service.get(test_key)
        print(f"Retrieved Value: {retrieved}")
        
        if retrieved == test_val:
            print("SUCCESS: Fallback Cache set/get verified and works perfectly!")
        else:
            print(f"FAILED: Retrieved value does not match. Expected {test_val}, got {retrieved}")
            
        print("Cleaning up key...")
        cache_service.delete(test_key)
        print(f"Get after delete: {cache_service.get(test_key)}")
    except Exception as e:
        print(f"Cache service test FAILED: {e}")

if __name__ == "__main__":
    print("=" * 60)
    print("QURO AI PLATFORM - COMPREHENSIVE RESILIENCE & DIAGNOSTICS TESTS")
    print("=" * 60)
    
    # Wait a second for reloading to finish
    time.sleep(1.5)
    
    test_health_endpoint()
    test_favicon_endpoint()
    test_auth_register_405()
    test_cache_service_resilience()
    
    print("\n" + "=" * 60)
    print("TESTING COMPLETED!")
    print("=" * 60)
