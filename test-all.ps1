Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "/// INITIATING DEEP SYSTEM DIAGNOSTICS ///" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan

# STEP 1: Backend Verification
Write-Host ">> [1/4] EXECUTING BACKEND INTEGRATION & UNIT TESTS..." -ForegroundColor Yellow
cd pulse
mvn clean verify
$BACKEND_STATUS = $LASTEXITCODE
cd ..

# STEP 2: Frontend Linting
Write-Host ">> [2/4] ANALYZING FRONTEND SYNTAX (LINTING)..." -ForegroundColor Yellow
cd pulse-ui
npm run lint
$LINT_STATUS = $LASTEXITCODE

# STEP 3: Frontend Unit Tests
Write-Host ">> [3/4] EXECUTING FRONTEND COMPONENT TESTS..." -ForegroundColor Yellow
npm run test -- --run
$TEST_STATUS = $LASTEXITCODE

# STEP 4: Frontend Production Build
Write-Host ">> [4/4] VERIFYING PRODUCTION BUILD COMPILATION..." -ForegroundColor Yellow
npm run build
$BUILD_STATUS = $LASTEXITCODE
cd ..

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "/// DIAGNOSTIC REPORT ///" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan

if (($BACKEND_STATUS -eq 0) -and ($LINT_STATUS -eq 0) -and ($TEST_STATUS -eq 0) -and ($BUILD_STATUS -eq 0)) {
    Write-Host "[SUCCESS] ALL SYSTEMS NOMINAL. MATRIX IS STABLE." -ForegroundColor Green
    exit 0
} else {
    Write-Host "[FATAL] SYSTEM INTEGRITY COMPROMISED. REVIEW FAILURES:" -ForegroundColor Red
    if ($BACKEND_STATUS -ne 0) { Write-Host "  [X] Backend tests or compilation failed." -ForegroundColor Red }
    if ($LINT_STATUS -ne 0) { Write-Host "  [X] Frontend linting failed (Check for unused imports)." -ForegroundColor Red }
    if ($TEST_STATUS -ne 0) { Write-Host "  [X] Frontend Vitest suite failed." -ForegroundColor Red }
    if ($BUILD_STATUS -ne 0) { Write-Host "  [X] Frontend Vite production build failed." -ForegroundColor Red }
    exit 1
}