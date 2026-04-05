param(
  [string]$DocUrl = 'http://localhost:3000/docs-json',
  [string]$ProjectName = 'client'
)

$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

& (Join-Path $scriptDir 'generate-client.ps1') -DocUrl $DocUrl -ProjectName $ProjectName
