Write-Host "1. Build React app"
npm run build

Write-Host "2. Copy build to Capacitor"
npx cap copy

Write-Host "3. Sync Capacitor"
npx cap sync

Write-Host "4. Build APK via Gradle"
Set-Location android

./gradlew.bat assembleDebug
Set-Location ..
Write-Host "APK build complete"
Write-Host "APK disponible dans: android/app/build/outputs/apk/debug/"
# Write-Host "5. Open Android Studio"
# ./android-studio.bat
# Write-Host "6. Open Android Emulator"
