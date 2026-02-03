$ErrorActionPreference = "Stop"

try {
    # 1. Login
    $body = @{ email = "test@example.com"; password = "password123" } | ConvertTo-Json
    # Note: If test@example.com doesn't exist, this might fail unless seeded.
    # We'll try to use admin if test doesn't exist or just rely on manual verification if seed logic is missing.
    # Assuming "admin@example.com" exists from previous steps.
    $body = @{ email = "admin@example.com"; password = "password123" } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" -Method Post -Body $body -ContentType "application/json"
    $token = $response.data.accessToken
    Write-Host "Login Successful"

    $headers = @{ Authorization = "Bearer $token" }

    # 2. Get Sessions
    Write-Host "Fetching Sessions..."
    $sessions = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/settings/sessions" -Method Get -Headers $headers
    if ($sessions.data.sessions.Count -ge 1) {
        Write-Host "PASS: Sessions retrieved"
    }
    else {
        Write-Error "FAIL: No sessions returned"
    }

    # 3. Update Notifications
    Write-Host "Updating Notifications..."
    $notifyBody = @{ email = $false; frequency = "weekly" } | ConvertTo-Json
    $notifyRes = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/settings/notifications" -Method Patch -Body $notifyBody -Headers $headers -ContentType "application/json"
    if ($notifyRes.data.notifications.frequency -eq "weekly") {
        Write-Host "PASS: Notifications updated"
    }
    else {
        Write-Error "FAIL: Notification update mismatch"
    }

    # 4. Export Data
    Write-Host "Exporting Data..."
    $export = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/settings/export-data" -Method Post -Headers $headers
    if ($export.data.user -and $export.data.profile) {
        Write-Host "PASS: Data export structure valid"
    }
    else {
        Write-Error "FAIL: Data export missing fields"
    }

    Write-Host "ALL SETTINGS TESTS PASSED"

}
catch {
    Write-Host "TEST FAILED: $_"
    exit 1
}
