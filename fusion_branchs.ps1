# Assure-toi d'être dans le dossier du projet

param(
    [string]$ProjectPath = "C:\Users\Jerix\Devs\ville_connectee",
    [string]$MainBranch = "main",
    [string[]]$IgnoreBranches = @("master")
)

Set-Location $ProjectPath

# Récupère les dernières infos du dépôt
git fetch --all

# Bascule sur la branche principale
git checkout $MainBranch

# Liste toutes les branches distantes sauf la branche principale et celles à ignorer
$branches = git branch -r | Where-Object {
    $_ -notmatch "origin/$MainBranch" -and ($IgnoreBranches -notcontains ($_ -replace 'origin/', ''))
}

foreach ($branch in $branches) {
    $branchName = $branch.Trim() -replace 'origin/', ''
    Write-Host "Fusion de la branche '$branchName' dans '$MainBranch'..."
    git merge "origin/$branchName"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "⚠️ Conflit détecté lors de la fusion de '$branchName'. Résous-le manuellement."
        break
    }
}

# Pousse les changements sur GitHub
git push origin $MainBranch
