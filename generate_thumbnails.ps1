$ErrorActionPreference = "Continue"
$ProgressPreference = "SilentlyContinue"

$toolsDir = "C:\falconzboy\tools"
$cwebpExe = "$toolsDir\libwebp-1.4.0-windows-x64\bin\cwebp.exe"

$editedSrc = "C:\falconzboy\web_edited_webp"
$editedThumb = "C:\falconzboy\web_edited_webp_thumb"
$uneditedSrc = "C:\falconzboy\web_unedited_webp"
$uneditedThumb = "C:\falconzboy\web_unedited_webp_thumb"

New-Item -ItemType Directory -Force -Path $editedThumb | Out-Null
New-Item -ItemType Directory -Force -Path $uneditedThumb | Out-Null

function Generate-Thumbs($srcFolder, $dstFolder) {
    $files = Get-ChildItem -Path $srcFolder -Filter "*.webp"
    $total = $files.Count
    $i = 0
    foreach ($file in $files) {
        $i++
        $outFile = Join-Path $dstFolder $file.Name
        # Resize to 720px width/height maintaining aspect ratio, quality 75
        Start-Process -FilePath $cwebpExe -ArgumentList "-q 75 -m 4 -mt -resize 720 0 `"$($file.FullName)`" -o `"$outFile`"" -NoNewWindow -Wait
    }
}

Write-Host "Generating Edited Thumbnails..."
Generate-Thumbs $editedSrc $editedThumb

Write-Host "Generating Unedited Thumbnails..."
Generate-Thumbs $uneditedSrc $uneditedThumb

$thumbBytes = (Get-ChildItem -Path $editedThumb, $uneditedThumb -File | Measure-Object -Property Length -Sum).Sum
$thumbMB = [math]::Round($thumbBytes / 1MB, 2)
$avgKB = [math]::Round(($thumbBytes / (Get-ChildItem -Path $editedThumb, $uneditedThumb -File).Count) / 1KB, 1)

Write-Host "Thumbnails Generated Successfully!"
Write-Host "Total Thumbnails Size: $thumbMB MB"
Write-Host "Average Size per Photo: $avgKB KB"
