# build.ps1 — Script principal pour automatiser le build APK Capacitor

param (
    [ValidateSet("debug", "release")]
    [string]$BuildType = "debug",
    
    [switch]$Silent
)

# 📦 Configuration centralisée
$config = @{
    KeystorePath      = "android/keystore/my-release-key.jks"
    KeyAlias          = "my-key-alias"
    APKOutputDir      = "android/app/build/outputs/apk/$BuildType"
    BuildToolsVersion = "34.0.0"
    DistDir           = "dist"
    LogFile           = "build.log"
}

# 📝 Journalisation
function Write-Log {
    param ([string]$message)
    Add-Content -Path $config.LogFile -Value "$(Get-Date -Format 'u') - $message"
}

# ✅ Étapes avec gestion d'erreur
function Invoke-Step($description, $command) {
    Write-Host "`n➡️ $description"
    Write-Log "START: $description"
    try {
        & $command
        if ($LASTEXITCODE -ne 0) {
            throw "Erreur lors de l'exécution: $command"
        }
        Write-Log "SUCCESS: $description"
    }
    catch {
        Write-Host "❌ $description a échoué."
        Write-Host "🛑 Détail: $_"
        Write-Log "FAIL: $description - $_"
        exit 1
    }
}

# 🔐 Création du keystore si absent
function New-Keystore {
    param (
        [string]$keystorePath,
        [string]$keyAlias
    )

    $keystoreDir = Split-Path $keystorePath
    if (-not (Test-Path $keystoreDir)) {
        Write-Host "📁 Création du dossier keystore : $keystoreDir"
        New-Item -ItemType Directory -Path $keystoreDir | Out-Null
    }

    if ($Silent) {
        throw "Mode silencieux activé, mais aucun keystore existant. Fournir un keystore préconfiguré."
    }

    Write-Host "`n🔐 Keystore introuvable. Création interactive..."
    $storePassword = Read-Host "👉 Mot de passe du keystore" -AsSecureString
    $keyPassword   = Read-Host "👉 Mot de passe de la clé" -AsSecureString
    $dname = "CN=$(Read-Host 'Nom commun'), OU=$(Read-Host 'Unité'), O=$(Read-Host 'Organisation'), L=$(Read-Host 'Ville'), ST=$(Read-Host 'Région'), C=$(Read-Host 'Pays')"

    $plainStorePassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($storePassword))
    $plainKeyPassword   = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($keyPassword))

    $keytoolCmd = "keytool -genkeypair -v -keystore `"$keystorePath`" -storepass `"$plainStorePassword`" -keypass `"$plainKeyPassword`" -keyalg RSA -keysize 2048 -validity 10000 -alias `"$keyAlias`" -dname `"$dname`""
    Invoke-Expression $keytoolCmd

    return @{
        StorePassword = $storePassword
        KeyPassword   = $keyPassword
    }
}

# 📦 Signature et versioning de l'APK
function Set-APK {
    param (
        [string]$keystorePath,
        [string]$keyAlias,
        [SecureString]$keystorePassword,
        [SecureString]$keyPassword
    )

    $apkPath = "$($config.APKOutputDir)/app-$BuildType.apk"
    if (-not (Test-Path $apkPath)) {
        Write-Host "❌ APK non trouvé à $apkPath"
        exit 1
    }

    Write-Host "`n🔐 Signature de l'APK..."
    $plainKeystorePassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($keystorePassword))
    $plainKeyPassword      = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($keyPassword))

    $jarsignerCmd = "jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore `"$keystorePath`" -storepass `"$plainKeystorePassword`" -keypass `"$plainKeyPassword`" `"$apkPath`" `"$keyAlias`""
    Invoke-Expression $jarsignerCmd

    # 🔢 Versioning
    $baseName = "app-signed-$BuildType"
    $existing = Get-ChildItem -Path $config.APKOutputDir -Filter "$baseName-v*.apk" | ForEach-Object {
        if ($_ -match "$baseName-v(\d+)\.apk") { [int]$matches[1] }
    } | Sort-Object -Descending

    $nextVersion = if ($existing.Count -gt 0) { $existing[0] + 1 } else { 1 }
    $versionedApkPath = "$($config.APKOutputDir)/$baseName-v$nextVersion.apk"

    # 📐 zipalign
    $zipalignPath = "$env:ANDROID_HOME\build-tools\$($config.BuildToolsVersion)\zipalign.exe"
    if (-not (Test-Path $zipalignPath)) {
        Write-Host "❌ zipalign introuvable. Vérifie ton SDK Android."
        exit 1
    }

    & "$zipalignPath" -v 4 "$apkPath" "$versionedApkPath"
    Write-Host "✅ APK signé et aligné : $versionedApkPath"
    Write-Log "APK final : $versionedApkPath"

    # 📁 Export vers dist/
    if (-not (Test-Path $config.DistDir)) {
        New-Item -ItemType Directory -Path $config.DistDir | Out-Null
    }
    Copy-Item $versionedApkPath -Destination $config.DistDir
    Write-Host "📁 APK copié dans $($config.DistDir)"
}

# 🔍 Vérification des dépendances
Invoke-Step "Vérification Node.js" { node -v }
Invoke-Step "Vérification npm" { npm -v }
Invoke-Step "Installation des dépendances" { if (-not (Test-Path "node_modules")) { npm install } }
Invoke-Step "Installation Capacitor" { if (-not (npm list --depth=0 | Select-String "@capacitor/core")) { npm install @capacitor/core @capacitor/cli } }
Invoke-Step "Ajout Android" { if (-not (Test-Path "android")) { npx cap add android } }
Invoke-Step "Vérification gradlew.bat" { if (-not (Test-Path "android\gradlew.bat")) { throw "gradlew.bat introuvable" } }
Invoke-Step "Vérification Java" { java -version }
Invoke-Step "Vérification ANDROID_HOME" { if (-not $env:ANDROID_HOME) { throw "ANDROID_HOME non défini" } }

# 🏗️ Build
Invoke-Step "Build React app" { npm run build }
Invoke-Step "Copie Capacitor" { npx cap copy }
Invoke-Step "Sync Capacitor" { npx cap sync }

# 🧱 Compilation APK
Set-Location android
Invoke-Step "Compilation APK ($BuildType)" { ./gradlew.bat "assemble$($BuildType.Substring(0,1).ToUpper())$($BuildType.Substring(1))" }
Set-Location ..

# 🔐 Signature
$keystorePath = $config.KeystorePath
$keyAlias = $config.KeyAlias

if (-not (Test-Path $keystorePath)) {
    $creds = New-Keystore -keystorePath $keystorePath -keyAlias $keyAlias
    $keystorePassword = $creds.StorePassword
    $keyPassword = $creds.KeyPassword
} else {
    if ($Silent) {
        throw "Mode silencieux activé, mais aucun mot de passe fourni. Utilise des variables d'environnement."
    }
    $keystorePassword = Read-Host "🔐 Mot de passe du keystore" -AsSecureString
    $keyPassword = Read-Host "🔐 Mot de passe de la clé" -AsSecureString
}

Set-APK -keystorePath $keystorePath -keyAlias $keyAlias -keystorePassword $keystorePassword -keyPassword $keyPassword