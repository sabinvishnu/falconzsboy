$ErrorActionPreference = "Continue"
$ProgressPreference = "SilentlyContinue"

$toolsDir = "C:\falconzboy\tools"
$cwebpExe = "$toolsDir\libwebp-1.4.0-windows-x64\bin\cwebp.exe"

$editedSrc = "C:\falconzboy\web editod"
$editedDst = "C:\falconzboy\web_edited_webp"
$uneditedSrc = "C:\falconzboy\web unedited"
$uneditedDst = "C:\falconzboy\web_unedited_webp"

New-Item -ItemType Directory -Force -Path $editedDst | Out-Null
New-Item -ItemType Directory -Force -Path $uneditedDst | Out-Null

function Convert-Folder($srcFolder, $dstFolder) {
    $files = Get-ChildItem -Path $srcFolder -File | Where-Object { 
        $_.Extension -match '\.(jpe?g|png|webp)$' -and -not $_.Name.StartsWith('.trashed')
    }
    $total = $files.Count
    $i = 0
    foreach ($file in $files) {
        $i++
        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
        $outName = "$baseName.webp"
        $outFile = Join-Path $dstFolder $outName
        
        Write-Host "[$i/$total] Converting $($file.Name)..."
        # Run cwebp with 85% quality, multithreaded
        $p = Start-Process -FilePath $cwebpExe -ArgumentList "-q 85 -m 6 -mt -resize 2560 0 `"$($file.FullName)`" -o `"$outFile`"" -NoNewWindow -Wait -PassThru
        
        if (-not (Test-Path $outFile) -or (Get-Item $outFile).Length -eq 0) {
            Start-Process -FilePath $cwebpExe -ArgumentList "-q 85 -m 6 -mt `"$($file.FullName)`" -o `"$outFile`"" -NoNewWindow -Wait
        }
    }
}

Write-Host "--- Converting Edited Photos ---"
Convert-Folder $editedSrc $editedDst

Write-Host "--- Converting Unedited Photos ---"
Convert-Folder $uneditedSrc $uneditedDst

$origBytes = (Get-ChildItem -Path $editedSrc, $uneditedSrc -File | Measure-Object -Property Length -Sum).Sum
$newBytes = (Get-ChildItem -Path $editedDst, $uneditedDst -File | Measure-Object -Property Length -Sum).Sum
$origMB = [math]::Round($origBytes / 1MB, 2)
$newMB = [math]::Round($newBytes / 1MB, 2)
$savedPct = [math]::Round((1 - ($newBytes / $origBytes)) * 100, 1)

Write-Host "================================"
Write-Host "COMPRESSION COMPLETE!"
Write-Host "Original Size: $origMB MB"
Write-Host "Compressed WebP Size: $newMB MB"
Write-Host "Saved: $savedPct %"
Write-Host "================================"
