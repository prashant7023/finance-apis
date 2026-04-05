#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOC_URL="${1:-http://localhost:3000/docs-json}"
PROJECT_NAME="${2:-client}"

"${SCRIPT_DIR}/generate-client.sh" "${DOC_URL}" "${PROJECT_NAME}"
