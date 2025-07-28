# Vérifie que le dossier .git existe
if (-not (Test-Path ".git")) {
    Write-Host "❌ Ce dossier n'est pas un dépôt Git." -ForegroundColor Red
    exit 1
}

Write-Host "🔧 Démarrage de la réparation du dépôt Git..." -ForegroundColor Cyan

# 1. Supprimer les fichiers de verrouillage (.lock)
Write-Host "🧹 Suppression des fichiers .lock..." -ForegroundColor Yellow
Get-ChildItem -Path ".git" -Recurse -Filter "*.lock" | ForEach-Object {
    Remove-Item $_.FullName -Force
    Write-Host "Supprimé: $($_.FullName)"
}

# 2. Vérifier l'intégrité du dépôt
Write-Host "🔍 Vérification de l'intégrité du dépôt..." -ForegroundColor Yellow
git fsck --full

# 3. Nettoyer les références distantes
Write-Host "🌿 Prune des références distantes..." -ForegroundColor Yellow
git fetch --all --prune
git remote prune origin

# 4. Réparer les références locales corrompues
Write-Host "🧩 Réparation des références locales..." -ForegroundColor Yellow
$refs = git show-ref | ForEach-Object { ($_ -split '\s+')[1] }
foreach ($ref in $refs) {
    if ($ref -like "refs/remotes/*") {
        Write-Host "🔧 Suppression de la référence distante corrompue : $ref"
        git update-ref -d $ref
    }
}

# 5. Vérifier les conflits de noms (namespace collisions)
Write-Host "📛 Vérification des conflits de noms..." -ForegroundColor Yellow
$branches = git for-each-ref --format='%(refname)' refs/heads/
foreach ($branch in $branches) {
    if ($branch -match "/") {
        $parent = $branch -replace "/.*", ""
        $parentPath = ".git/refs/heads/$parent"
        if (Test-Path $parentPath) {
            Write-Host "⚠️ Conflit détecté entre branche '$branch' et fichier '$parent'" -ForegroundColor Red
            $newName = $branch -replace "/", "-"
            $branchName = $branch -replace "refs/heads/", ""
            git branch -m $branchName $newName
            Write-Host "✅ Branche renommée en : $newName" -ForegroundColor Green
        }
    }
}

# 6. Garbage collection
Write-Host "🗑️ Nettoyage du dépôt (git gc)..." -ForegroundColor Yellow
git gc --prune=now

Write-Host "✅ Réparation terminée. Vérifiez le statut avec : git status" -ForegroundColor Green
