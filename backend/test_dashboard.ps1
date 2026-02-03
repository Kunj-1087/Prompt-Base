$ErrorActionPreference = "Stop"

try {
    # 1. Login to get token (using admin seeded earlier)
    $body = @{ email = "admin@example.com"; password = "password123" } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" -Method Post -Body $body -ContentType "application/json"
    $token = $response.data.accessToken
    Write-Host "Login Successful"

    $headers = @{ Authorization = "Bearer $token" }

    # 2. Get Stats
    Write-Host "Fetching Stats..."
    $stats = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/dashboard/stats" -Method Get -Headers $headers
    
    if ($stats.data.totalItems -ge 3) {
        Write-Host "PASS: Items count verified ($($stats.data.totalItems))"
    }
    else {
        Write-Error "FAIL: Items count mismatch"
    }

    # 3. Get Activity
    Write-Host "Fetching Activity..."
    $activity = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/dashboard/activity" -Method Get -Headers $headers
    
    if ($activity.data.activities.Count -ge 3) {
        Write-Host "PASS: Activity count verified"
    }
    else {
        Write-Error "FAIL: Activity count mismatch"
    }

    # 4. Get Summary
    Write-Host "Fetching Summary..."
    $summary = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/dashboard/summary" -Method Get -Headers $headers
    
    if ($summary.data.stats.activeItems -ge 1) {
        Write-Host "PASS: Summary verified"
    }
    else {
        Write-Error "FAIL: Summary mismatch"
    }
    
    Write-Host "ALL DASHBOARD TESTS PASSED"

}
catch {
    Write-Host "TEST FAILED: $_"
    exit 1
}
