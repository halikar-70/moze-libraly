import json
import urllib.request
import urllib.error
import time
import os

BASE_URL = "http://127.0.0.1:8000"

def make_request(path, method="GET", data=None, token=None, headers_override=None):
    url = f"{BASE_URL}{path}"
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
        
    req_data = None
    if headers_override is not None:
        headers.update(headers_override)
        req_data = data
    elif data:
        headers["Content-Type"] = "application/json"
        req_data = json.dumps(data).encode("utf-8")
        
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read()
            if path.endswith(".pdf"):
                return response.status, res_body
            return response.status, json.loads(res_body.decode("utf-8")) if res_body else None
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            err_json = json.loads(err_body)
        except Exception:
            err_json = err_body
        return e.code, err_json

def encode_multipart_formdata(fields, file_field_name, file_name, file_content):
    boundary = b'Boundary-%d' % int(time.time())
    body = []
    
    for name, value in fields.items():
        body.append(b'--' + boundary)
        body.append(('Content-Disposition: form-data; name="%s"' % name).encode('utf-8'))
        body.append(b'')
        body.append(str(value).encode('utf-8'))
        
    body.append(b'--' + boundary)
    body.append(('Content-Disposition: form-data; name="%s"; filename="%s"' % (file_field_name, file_name)).encode('utf-8'))
    body.append(b'Content-Type: application/pdf')
    body.append(b'')
    body.append(file_content)
    
    body.append(b'--' + boundary + b'--')
    body.append(b'')
    
    content_type = 'multipart/form-data; boundary=%s' % boundary.decode('utf-8')
    return content_type, b'\r\n'.join(body)

def run_tests():
    print("--- Starting Study Materials Verification Tests ---")
    
    # 1. Login as Librarian
    login_payload = {
        "email": "librarian@moze.edu.in",
        "password": "password123",
        "role": "librarian"
    }
    status, token_out = make_request("/api/auth/login", method="POST", data=login_payload)
    assert status == 200, f"Librarian login failed: {token_out}"
    token = token_out["access_token"]
    print("Success! Librarian logged in.")

    # Create dummy pdf
    pdf_content = b"%PDF-1.4 dummy pdf content"
    fields = {
        "title": "Unit 1 Stack Notes",
        "academic_year": "Second Year (SE)",
        "department_id": 2, # Computer
        "subject": "Data Structures",
        "unit": "Unit 1"
    }
    
    content_type, body = encode_multipart_formdata(fields, "file", "test_notes.pdf", pdf_content)
    
    # 2. Upload study material
    print("Uploading study material...")
    status, material_out = make_request(
        "/api/study-materials", 
        method="POST", 
        data=body, 
        token=token,
        headers_override={"Content-Type": content_type}
    )
    assert status == 200, f"Upload failed: {material_out}"
    material_id = material_out["id"]
    file_path = material_out["file_path"]
    print(f"Success! Uploaded material: {material_out['title']} (ID: {material_id})")
    
    # 3. Retrieve study materials
    print("Fetching study materials...")
    status, materials_list = make_request("/api/study-materials?academic_year=Second%20Year%20(SE)&department_id=2")
    assert status == 200, f"Fetch failed: {materials_list}"
    assert len(materials_list) > 0, "No materials returned"
    print(f"Success! Found {len(materials_list)} study materials.")
    
    # 4. View PDF file (Serving test)
    print("Verifying file download...")
    status, file_content = make_request(file_path)
    assert status == 200, f"File fetch failed: {status}"
    assert file_content == pdf_content, f"Content mismatch: expected {pdf_content}, got {file_content}"
    print(f"Success! Served PDF matches expected content.")
    
    # 5. Delete study material
    print("Deleting study material...")
    status, delete_out = make_request(f"/api/study-materials/{material_id}", method="DELETE", token=token)
    assert status == 200, f"Delete failed: {delete_out}"
    print("Success! Material deleted.")
    
    # Verify file is deleted on disk
    relative_path = file_path.lstrip("/")
    assert not os.path.exists(relative_path), "File still exists on disk after deletion"
    print("Success! File removed from disk.")
    
    print("\n--- ALL Study Materials Tests Passed Successfully! ---")

if __name__ == "__main__":
    run_tests()
