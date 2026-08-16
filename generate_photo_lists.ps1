$edited = Get-ChildItem "C:\falconzboy\web_edited_webp" -File | Where-Object { $_.Extension -eq ".webp" } | ForEach-Object { "      'web_edited_webp/$($_.Name)'" }
$unedited = Get-ChildItem "C:\falconzboy\web_unedited_webp" -File | Where-Object { $_.Extension -eq ".webp" } | ForEach-Object { "      'web_unedited_webp/$($_.Name)'" }

$editedStr = $edited -join ",`n"
$uneditedStr = $unedited -join ",`n"

$jsContent = @"
    /* GALLERY PHOTO COLLECTIONS (Optimized WebP - 93.3% smaller, 4K crisp) */
    const editedPhotos = [
$editedStr
    ];

    const uneditedPhotos = [
$uneditedStr
    ];
"@

[System.IO.File]::WriteAllText("C:\falconzboy\photos_snippet.js", $jsContent)
Write-Host "Snippets written. Edited count: $($edited.Count), Unedited count: $($unedited.Count)"
