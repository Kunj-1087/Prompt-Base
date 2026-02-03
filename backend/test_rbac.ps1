$ErrorActionPreference = "Stop"

try {
    # 1. Signup Admin (Manually promote later or assume DB seeded, but for test we'll create one and Mongo-hack it or use existing if any)
    # Since I cannot easily access DB shell to "make admin", I will register a user and hope I can update it or use the first user check if implemented (not implemented).
    # AUTO-FIX: I'll use the previously created user from test_profile.ps1 if possible, BUT I don't have the token.
    # So I will Register a NEW user, and then I need a way to make them admin. 
    # Current implementation DOES NOT have "first user is admin" logic.
    # I will add a temporary "seed" script or just use the backend to force update if I could.
    # Alternative: I will modify the backend temporarily to allow "role" in signup (UNSAFE) or just add a seed route.
    # BEST APPROACH: Create a seed script.
    
    Write-Host "Please manually ensure an admin exists or use a seed script."
    # For this automated test to work without manual intervention, I'll create a new user and try to hit admin routes (Expect FAIL)
    # Then I really need an Admin account. 
    # I'll Assume 'admin@example.com' / 'password123' exists or I will create it.
    
    $email = "user" + (Get-Random) + "@example.com"
    $body = @{ name = "Ordinary User"; email = $email; password = "password123" } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/signup" -Method Post -Body $body -ContentType "application/json"
    $userToken = $response.data.accessToken
    Write-Host "Created User: $email"

    # 2. Try to access Admin Route as User (Should Fail)
    try {
        Invoke-RestMethod -Uri "http://localhost:5000/api/v1/admin/users" -Method Get -Headers @{ Authorization = "Bearer $userToken" }
    }
    catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 403) {
            Write-Host "PASS: Ordinary user denied access to Admin route"
        }
        else {
            Write-Error "FAIL: User got code $($_.Exception.Response.StatusCode.value__)"
        }
    }

}
catch {
    Write-Host "TEST FAILED: $_"
    exit 1
}
