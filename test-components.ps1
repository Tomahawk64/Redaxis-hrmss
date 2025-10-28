#!/usr/bin/env pwsh
# Component Validation Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Attendance & Leaves Components" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if files exist
Write-Host "Test 1: Checking if component files exist..." -ForegroundColor Yellow
$attendanceExists = Test-Path "src/components/Attendance.jsx"
$leavesExists = Test-Path "src/components/Leaves.jsx"
$apiExists = Test-Path "src/services/api.js"

if ($attendanceExists) {
    Write-Host "✓ Attendance.jsx exists" -ForegroundColor Green
} else {
    Write-Host "✗ Attendance.jsx NOT FOUND" -ForegroundColor Red
}

if ($leavesExists) {
    Write-Host "✓ Leaves.jsx exists" -ForegroundColor Green
} else {
    Write-Host "✗ Leaves.jsx NOT FOUND" -ForegroundColor Red
}

if ($apiExists) {
    Write-Host "✓ api.js exists" -ForegroundColor Green
} else {
    Write-Host "✗ api.js NOT FOUND" -ForegroundColor Red
}

Write-Host ""

# Test 2: Check imports in Leaves.jsx
Write-Host "Test 2: Checking Leaves.jsx imports..." -ForegroundColor Yellow
$leavesContent = Get-Content "src/components/Leaves.jsx" -Raw
if ($leavesContent -match "import.*leaveAPI.*from.*services/api") {
    Write-Host "✓ leaveAPI is imported from api.js" -ForegroundColor Green
} else {
    Write-Host "✗ leaveAPI import NOT FOUND or incorrect" -ForegroundColor Red
}

if ($leavesContent -match "const leaveAPI = \{") {
    Write-Host "✗ WARNING: Duplicate leaveAPI definition found!" -ForegroundColor Red
} else {
    Write-Host "✓ No duplicate leaveAPI definition" -ForegroundColor Green
}

Write-Host ""

# Test 3: Check API exports
Write-Host "Test 3: Checking api.js exports..." -ForegroundColor Yellow
$apiContent = Get-Content "src/services/api.js" -Raw
if ($apiContent -match "export const leaveAPI") {
    Write-Host "✓ leaveAPI is exported" -ForegroundColor Green
} else {
    Write-Host "✗ leaveAPI export NOT FOUND" -ForegroundColor Red
}

if ($apiContent -match "delete:.*\(id\)") {
    Write-Host "✓ delete method exists in leaveAPI" -ForegroundColor Green
} else {
    Write-Host "✗ delete method NOT FOUND in leaveAPI" -ForegroundColor Red
}

if ($apiContent -match "updateStatus:.*\(id, status, remarks\)") {
    Write-Host "✓ updateStatus has correct signature" -ForegroundColor Green
} else {
    Write-Host "✗ updateStatus signature is incorrect" -ForegroundColor Red
}

Write-Host ""

# Test 4: Lint check
Write-Host "Test 4: Running ESLint..." -ForegroundColor Yellow
Write-Host "Checking Attendance.jsx..." -ForegroundColor Cyan
npx eslint src/components/Attendance.jsx 2>&1 | Select-String "error"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ No errors in Attendance.jsx" -ForegroundColor Green
} else {
    Write-Host "! Some warnings/errors found (check above)" -ForegroundColor Yellow
}

Write-Host "Checking Leaves.jsx..." -ForegroundColor Cyan
npx eslint src/components/Leaves.jsx 2>&1 | Select-String "error"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ No errors in Leaves.jsx" -ForegroundColor Green
} else {
    Write-Host "! Some warnings/errors found (check above)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Validation Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Run: npm run dev" -ForegroundColor White
Write-Host "2. Open browser and navigate to http://localhost:5173" -ForegroundColor White
Write-Host "3. Login to the application" -ForegroundColor White
Write-Host "4. Navigate to /attendance and /leaves pages" -ForegroundColor White
Write-Host "5. Check browser console for any errors (F12)" -ForegroundColor White
