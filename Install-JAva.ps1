# En-tête : forcer l'encodage UTF-8 dans PowerShell
$OutputEncoding = [Console]::OutputEncoding = [Text.UTF8Encoding]::new()

function Write-Info {
    param($msg)
    Write-Host "[INFO] $msg" -ForegroundColor Cyan
}
function Write-Success {
    param($msg)
    Write-Host "[OK] $msg" -ForegroundColor Green
}
function Write-ErrorLine {
    param($msg)
    Write-Host "[ERREUR] $msg" -ForegroundColor Red
}

# Étape 1 : Vérifier Scoop
if (!(Get-Command scoop -ErrorAction SilentlyContinue)) {
    Write-Info "Scoop n'est pas installé. Installation en cours..."

    try {
        Invoke-Expression (Invoke-RestMethod get.scoop.sh)
        Write-Success "Scoop installé avec succès."
    } catch {
        Write-ErrorLine "Erreur lors de l'installation de Scoop. Arrêt du script."
        exit 1
    }
} else {
    Write-Success "Scoop est déjà installé."
}

# Étape 2 : Ajouter le bucket 'java' si nécessaire
$scoopBuckets = scoop bucket list
if ($scoopBuckets -notmatch "java") {
    Write-Info "Ajout du bucket 'java'..."
    scoop bucket add java
    Write-Success "Bucket 'java' ajouté."
} else {
    Write-Success "Bucket 'java' déjà présent."
}

# Étape 3 : Installer Java 17 (temurin17)
if (-not (scoop list | Select-String 'temurin17')) {
    Write-Info "Installation de Java 17 (Temurin)..."
    scoop install temurin17
    Write-Success "Java 17 installé."
} else {
    Write-Success "Java 17 est déjà installé."
}

# Étape 4 : Détecter l'emplacement de Java 17 installé par Scoop
$temurinPath = "$env:USERPROFILE\scoop\apps\scoop\current"

if (-not (Test-Path "$temurinPath\bin\java.exe")) {
    Write-ErrorLine "Java 17 n’a pas été trouvé dans le dossier attendu : $temurinPath"
    exit 1
}

# Étape 5 : Configurer JAVA_HOME et mettre à jour le PATH utilisateur
Write-Info "Mise à jour des variables d’environnement..."

# Supprimer les anciennes versions de Java du PATH
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
$newPath = ($currentPath -split ';') | Where-Object {
    $_ -notmatch "java" -and $_ -ne ""
}

# Ajouter le nouveau Java 17
$newPath += "$temurinPath\bin"
$newPathStr = ($newPath -join ';')

# Appliquer
[Environment]::SetEnvironmentVariable("JAVA_HOME", $temurinPath, "User")
[Environment]::SetEnvironmentVariable("Path", $newPathStr, "User")

Write-Success "JAVA_HOME défini sur : $temurinPath"
Write-Success "Le PATH utilisateur a été mis à jour."

# Étape 6 : Mise à jour dans cette session PowerShell
$env:JAVA_HOME = $temurinPath
$env:Path = "$temurinPath\bin;" + $env:Path

Write-Host ""
Write-Success "Java est prêt à l'emploi dans cette session :"
java -version
