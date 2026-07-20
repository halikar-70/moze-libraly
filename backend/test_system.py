import json
import urllib.request
import urllib.error
import time

BASE_URL = "http://127.0.0.1:8000"

def make_request(path, method="GET", data=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    req_data = None
    if data:
        req_data = json.dumps(data).encode("utf-8")
        
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            return response.status, json.loads(res_body) if res_body else None
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            err_json = json.loads(err_body)
        except Exception:
            err_json = err_body
        return e.code, err_json

def run_tests():
    print("--- Starting Automated System Verification Tests ---")
    time.sleep(2)  # Wait for server to ensure it is listening
    
    # Test 1: Get Catalog Books
    print("Test 1: Fetching books catalog...")
    status, books = make_request("/api/books")
    assert status == 200, f"Failed: {status}"
    assert len(books) > 0, "No books returned by seeder"
    print(f"Success! Found {len(books)} books in catalog.")

    # Test 2: Student Registration
    print("\nTest 2: Registering a test student...")
    test_student = {
        "full_name": "Test User",
        "prn_number": f"PRNTEST{int(time.time())}",
        "roll_number": "CO4099",
        "department_id": 1,
        "year": "BE",
        "division": "A",
        "email": f"test.student_{int(time.time())}@moze.edu.in",
        "mobile_number": "9999988888",
        "password": "testpassword123"
      }
    status, student_out = make_request("/api/auth/register/student", method="POST", data=test_student)
    assert status == 200, f"Student registration failed: {student_out}"
    print(f"Success! Registered student: {student_out['full_name']} (PRN: {student_out['prn_number']})")

    # Test 3: Student Login
    print("\nTest 3: Logging in test student...")
    login_payload = {
        "email": test_student["email"],
        "password": test_student["password"],
        "role": "student"
    }
    status, token_out = make_request("/api/auth/login", method="POST", data=login_payload)
    assert status == 200, f"Login failed: {token_out}"
    token = token_out["access_token"]
    assert token is not None, "No access token returned"
    print("Success! Logged in, retrieved JWT token.")

    # Test 4: Book Search Suggestions
    print("\nTest 4: Requesting search suggestions...")
    status, suggestions = make_request("/api/books/suggestions?q=C")
    assert status == 200, f"Suggestions failed: {suggestions}"
    print(f"Success! Got suggestions: {suggestions}")

    # Test 5: Fetch Profile
    print("\nTest 5: Fetching logged-in profile details...")
    status, me_profile = make_request("/api/auth/me", token=token)
    assert status == 200, f"Me query failed: {me_profile}"
    assert me_profile["prn_number"] == test_student["prn_number"], "Profile PRN mismatch"
    print(f"Success! Retrieved profile: Name: {me_profile['full_name']}, Credit Score: {me_profile['credit_score']}")

    # Test 6: Reserve a Book
    print("\nTest 6: Requesting book reservation...")
    target_book_id = books[0]["id"]
    status, resv_out = make_request(f"/api/books/{target_book_id}/reserve", method="POST", token=token)
    assert status == 200, f"Reservation failed: {resv_out}"
    assert resv_out["status"] == "Pending", "Reservation status should be Pending"
    print(f"Success! Reserved book '{books[0]['title']}'. Reservation ID: {resv_out['id']}.")

    # Test 7: Fetch Student Borrow Records (Check if reservation shows up)
    print("\nTest 7: Retrieving student borrow records...")
    status, records = make_request("/api/borrow/student-records", token=token)
    assert status == 200, f"Borrow records fetch failed: {records}"
    assert len(records["reservations"]) == 1, "Reservation log missing"
    print(f"Success! Active reservations found: {len(records['reservations'])}")

    # Test 8: Student Requests Return and Librarian Approves Return
    print("\nTest 8: Testing Student Return Request & Librarian Approval...")
    
    # 8.1 Log in as Rahul Sharma (Student)
    login_rahul = {
        "email": "rahul.sharma@moze.edu.in",
        "password": "password123",
        "role": "student"
    }
    status, token_rahul = make_request("/api/auth/login", method="POST", data=login_rahul)
    assert status == 200, f"Rahul login failed: {token_rahul}"
    rahul_token = token_rahul["access_token"]
    
    # 8.2 Get Rahul's active borrows
    status, rahul_records = make_request("/api/borrow/student-records", token=rahul_token)
    assert status == 200, f"Failed to get Rahul's records: {rahul_records}"
    active_borrows = rahul_records["active_borrows"]
    assert len(active_borrows) > 0, "Rahul has no active borrows to test return"
    target_borrow = active_borrows[0]
    borrow_id = target_borrow["id"]
    print(f"Rahul has active borrow ID: {borrow_id} for book: {target_borrow['book']['title']}")
    
    # 8.3 Request return
    status, req_return_out = make_request(f"/api/borrow/{borrow_id}/request-return", method="POST", token=rahul_token)
    assert status == 200, f"Return request failed: {req_return_out}"
    assert req_return_out["status"] == "Return Pending", f"Expected Return Pending status, got {req_return_out['status']}"
    print(f"Success! Status transitioned to 'Return Pending'.")
    
    # 8.4 Log in as Librarian
    login_lib = {
        "email": "librarian@moze.edu.in",
        "password": "password123",
        "role": "librarian"
    }
    status, token_lib = make_request("/api/auth/login", method="POST", data=login_lib)
    assert status == 200, f"Librarian login failed: {token_lib}"
    lib_token = token_lib["access_token"]
    
    # 8.5 Approve Return
    status, return_out = make_request(f"/api/borrow/return?borrow_id={borrow_id}&return_status=Returned", method="POST", token=lib_token)
    assert status == 200, f"Librarian approval failed: {return_out}"
    assert return_out["status"] == "Returned", f"Expected status 'Returned', got {return_out['status']}"
    print(f"Success! Librarian approved return. Record status is 'Returned'.")

    print("\n--- ALL Automated Tests Passed Successfully! ---")

if __name__ == "__main__":
    run_tests()
