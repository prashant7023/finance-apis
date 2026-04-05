param(
  [Parameter(Mandatory = $true)][string]$DocUrl,
  [Parameter(Mandatory = $true)][string]$ProjectName
)

$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = (Resolve-Path (Join-Path $scriptDir '..')).Path
$outDir = Join-Path $rootDir $ProjectName
$npmName = $ProjectName.ToLower().Replace('_', '-')

Write-Host "Generating client from $DocUrl into $outDir"

if (Test-Path $outDir) {
  Remove-Item -Recurse -Force $outDir
}

Push-Location $scriptDir

npx @openapitools/openapi-generator-cli generate `
  -g typescript-axios `
  -i $DocUrl `
  -o $outDir `
  --additional-properties "supportsES6=true,withSeparateModelsAndApi=true,apiPackage=api,modelPackage=models,npmName=$npmName,npmVersion=1.0.0" `
  --type-mappings "DateTime=Date"

if ($LASTEXITCODE -ne 0) {
  throw "OpenAPI generation failed with exit code $LASTEXITCODE"
}

Pop-Location
Push-Location $outDir

if (Test-Path (Join-Path $outDir 'package.json')) {
  npm install
  npm run build

  if ($LASTEXITCODE -ne 0) {
    throw "Generated client build failed with exit code $LASTEXITCODE"
  }
}
else {
  Write-Host "Skipping npm install/build because package.json was not generated."
}

Pop-Location

Write-Host "Client generation completed: $outDir"
