#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: ./generate-client.sh <docUrl> <projectName>"
  exit 1
fi

DOC_URL="$1"
PROJECT_NAME="$2"
NPM_NAME="$(echo "${PROJECT_NAME}" | tr '[:upper:]' '[:lower:]' | tr '_' '-')"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
OUT_DIR="${ROOT_DIR}/${PROJECT_NAME}"

echo "Generating client from ${DOC_URL} into ${OUT_DIR}"

if [ -d "${OUT_DIR}" ]; then
  echo "Removing existing output folder: ${OUT_DIR}"
  rm -rf "${OUT_DIR}" || true

  if [ -d "${OUT_DIR}" ] && command -v powershell >/dev/null 2>&1; then
    powershell -NoProfile -Command "if (Test-Path '${OUT_DIR}') { Remove-Item -Recurse -Force '${OUT_DIR}' }"
  fi
fi

cd "${SCRIPT_DIR}"

npx @openapitools/openapi-generator-cli generate \
  -g typescript-axios \
  -i "${DOC_URL}" \
  -o "${OUT_DIR}" \
  --additional-properties=supportsES6=true,withSeparateModelsAndApi=true,apiPackage=api,modelPackage=models,npmName=${NPM_NAME},npmVersion=1.0.0 \
  --type-mappings DateTime=Date

cd "${OUT_DIR}"

if [ -f "package.json" ]; then
  npm install
  npm run build
else
  echo "Skipping npm install/build because package.json was not generated."
fi

echo "Client generation completed: ${OUT_DIR}"
