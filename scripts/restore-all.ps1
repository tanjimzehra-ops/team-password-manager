$files = @(
    "mera.json",
    "kiraa.json",
    "levur.json",
    "cpf_jigsaw.json",
    "illawarra_energy_storage.json",
    "central_highlands_council.json",
    "council_2.json",
    "relationships_australia_tas.json"
)

foreach ($file in $files) {
    Write-Host "Seeding $file..."
    $json = Get-Content -Raw "data/$file"
    # Remove newlines and escape quotes for the argument
    $compactJson = $json -replace '`r','' -replace '`n','' -replace '"','\"'
    $arg = '{"jsonData": "' + $compactJson + '"}'
    # We use --args with the compact JSON. 
    # Pass the argument directly. We need to be careful with escaping.
    npx convex run --url https://hidden-fish-6.convex.cloud seed:seedSystemPublic --args $arg
}
Remove-Item "temp_arg.json"
