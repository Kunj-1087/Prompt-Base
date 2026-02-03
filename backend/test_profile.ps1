$ErrorActionPreference = "Stop"

try {
    # 1. Signup
    $email = "testuser" + (Get-Random) + "@example.com"
    $body = @{
        name = "Test User"
        email = $email
        password = "password123"
    } | ConvertTo-Json

    Write-Host "Registering $email..."
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/signup" -Method Post -Body $body -ContentType "application/json"
    $token = $response.data.accessToken
    Write-Host "Signup Successful. Token received."

    $headers = @{ Authorization = "Bearer $token" }

    # 2. Get Profile
    Write-Host "Fetching Profile..."
    $profile = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/users/me" -Method Get -Headers $headers
    if ($profile.success) { Write-Host "Get Profile Passed" } else { Write-Error "Get Profile Failed" }

    # 3. Update Profile
    Write-Host "Updating Profile..."
    $updateBody = @{
        bio = "Updated Bio from Script"
        phone = "1234567890"
        location = @{
            city = "Test City"
            country = "Test Country"
        }
    } | ConvertTo-Json
    $updated = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/users/me" -Method Put -Headers $headers -Body $updateBody -ContentType "application/json"
    
    if ($updated.data.profile.bio -eq "Updated Bio from Script") {
        Write-Host "Update Profile Passed (Bio checked)"
    } else {
         Write-Error "Update Profile Failed: Bio mismatch"
    }

    # 4. Update Avatar
    Write-Host "Updating Avatar..."
    $avatarBody = @{ avatarUrl = "https://example.com/avatar.png" } | ConvertTo-Json
    $avatar = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/users/me/avatar" -Method Patch -Headers $headers -Body $avatarBody -ContentType "application/json"
    
    if ($avatar.data.profile.avatarUrl -eq "https://example.com/avatar.png") {
        Write-Host "Update Avatar Passed"
    } else {
        Write-Error "Update Avatar Failed"
    }

    Write-Host "ALL TESTS PASSED"

} catch {
    Write-Host "TEST FAILED: $_"
    exit 1
}
