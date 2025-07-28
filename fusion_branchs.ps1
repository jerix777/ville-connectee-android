# Assure-toi d'être dans le dossier du projet
Set-Location "chemin\vers\ville-connectee-android"

# Récupère les dernières infos du dépôt
git fetch --all

# Bascule sur la branche principale
git checkout main

# Liste toutes les branches distantes sauf 'main'
$branches = git branch -r | Where-Object { $_ -notmatch 'origin/main' }

foreach ($branch in $branches) {
    $branchName = $branch.Trim() -replace 'origin/', ''
    Write-Host "Fusion de la branche '$branchName' dans 'main'..."
    git merge "origin/$branchName"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "⚠️ Conflit détecté lors de la fusion de '$branchName'. Résous-le manuellement."
        break
    }
}

# Pousse les changements sur GitHub
git push origin main
