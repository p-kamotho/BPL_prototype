#!/usr/bin/env python3
"""
Test the complete authentication flow between frontend and backend.
This simulates what the frontend's fetch API does with credentials: 'include'
"""

import requests
import json
from typing import Any, Dict

BASE_URL = 'http://127.0.0.1:8000'

class MockBrowser:
    """Simulates a browser with cookie jar"""
    def __init__(self):
        self.session = requests.Session()
        # Configure to handle cookies like a browser
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:3000'  # Simulate cross-origin
        })
    
    def post(self, url: str, data: Dict[str, Any]) -> requests.Response:
        """POST request with credentials"""
        return self.session.post(f'{BASE_URL}{url}', json=data)
    
    def get(self, url: str) -> requests.Response:
        """GET request with credentials"""
        return self.session.get(f'{BASE_URL}{url}')

def test_auth_flow():
    """Test complete authentication and role-based dashboard flow"""
    browser = MockBrowser()
    
    print("=" * 70)
    print("TEST 1: Login Flow")
    print("=" * 70)
    
    # Step 1: Login
    login_response = browser.post('/api/auth/login', {
        'email': 'admin@badminton.ke',
        'password': 'admin123'
    })
    
    print(f"[Login] Status: {login_response.status_code}")
    if login_response.status_code == 200:
        data = login_response.json()
        print(f"[Login] Status: {data['status']}")
        print(f"[Login] User: {data['user']['email']}")
        print(f"[Login] Roles: {len(data['user']['roles'])} role(s)")
        
        # Show first role details
        if data['user']['roles']:
            role = data['user']['roles'][0]
            print(f"  - Role: {role['role_name']}")
            print(f"  - Status: {role['status']}")
            print(f"  - Permissions: {len(role['permissions'])} permission(s)")
            print(f"    First 5: {role['permissions'][:5]}")
    else:
        print(f"[Login] Error: {login_response.text}")
        return
    
    print()
    print("Cookies after login:")
    for cookie in browser.session.cookies:
        print(f"  - {cookie.name}: {cookie.value[:20]}...")
        print(f"    SameSite: {cookie._rest.get('SameSite', 'Not set')}")
    
    print()
    print("=" * 70)
    print("TEST 2: Session Persistence (GET /api/profile)")
    print("=" * 70)
    
    # Step 2: Check profile using same session
    profile_response = browser.get('/api/profile')
    print(f"[Profile] Status: {profile_response.status_code}")
    
    if profile_response.status_code == 200:
        data = profile_response.json()
        print(f"[Profile] Status: {data['status']}")
        if 'user' in data:
            print(f"[Profile] User email: {data['user']['email']}")
            print(f"[Profile] Roles: {len(data['user']['roles'])} role(s)")
    else:
        print(f"[Profile] Error: {profile_response.text}")
    
    print()
    print("=" * 70)
    print("TEST 3: Dashboard Endpoint")
    print("=" * 70)
    
    # Step 3: Check user dashboard
    dashboard_response = browser.get('/api/user/dashboard')
    print(f"[Dashboard] Status: {dashboard_response.status_code}")
    
    if dashboard_response.status_code == 200:
        data = dashboard_response.json()
        print(f"[Dashboard] Status: {data['status']}")
        if 'data' in data:
            print(f"[Dashboard] User ID: {data['data']['user_id']}")
            print(f"[Dashboard] Role: {data['data']['role']}")
    else:
        print(f"[Dashboard] Error: {dashboard_response.text}")
    
    print()
    print("=" * 70)
    print("TEST SUMMARY")
    print("=" * 70)
    
    # Summary
    login_ok = login_response.status_code == 200
    profile_ok = profile_response.status_code == 200
    dashboard_ok = dashboard_response.status_code == 200
    
    print(f"✓ Login: {'PASS' if login_ok else 'FAIL'}")
    print(f"✓ Profile Persistence: {'PASS' if profile_ok else 'FAIL'}")
    print(f"✓ Dashboard Access: {'PASS' if dashboard_ok else 'FAIL'}")
    
    if all([login_ok, profile_ok, dashboard_ok]):
        print()
        print("✅ ALL TESTS PASSED! Auth flow is working correctly.")
    else:
        print()
        print("❌ SOME TESTS FAILED! Check the errors above.")

if __name__ == '__main__':
    test_auth_flow()
