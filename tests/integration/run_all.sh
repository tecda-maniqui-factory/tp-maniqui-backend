#!/bin/bash
# =============================================================================
# 🏆 TECDA MANIQUÍ - MODULAR TEST ORCHESTRATOR (v2.5 - Final Release)
# =============================================================================

BASE_URL="http://localhost:8081"
TOKEN="any-mock-token"

# --- COLORES ---
G='\033[0;32m'; R='\033[0;31m'; B='\033[0;34m'; Y='\033[1;33m'; NC='\033[0m'
PASSED=0; FAILED=0

test_endpoint() {
    local method=$1; local path=$2; local expect=$3; local title=$4; local data=$5
    echo -n -e "${B}RUN:${NC} $title... "
    local headers=("-H" "Content-Type: application/json")
    [[ "$path" != "/sistema/"* ]] && headers+=("-H" "Authorization: Bearer $TOKEN")

    if [[ -n "$data" ]]; then
        status=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "${headers[@]}" -d "$data" "$BASE_URL$path")
    else
        status=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "${headers[@]}" "$BASE_URL$path")
    fi

    if [ "$status" == "$expect" ]; then
        echo -e "${G}PASSED ($status)${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${R}FAILED (Expect $expect, Got $status)${NC}"
        FAILED=$((FAILED + 1))
    fi
}

# --- MODULOS v2.5 ---
mod_core() {
    echo -e "\n${Y}--- MODULO: COMPRAS & LEGAL ---${NC}"
    test_endpoint "POST" "/proveedores" "201" "Compras: Registro Proveedor" '{"nombre":"Prov Test", "codigo":"PT1", "tipo":"Proveedor Externo"}'
    test_endpoint "GET" "/ventas/1/factura" "200" "Legal: Generación de Factura"
}

mod_sys() {
    echo -e "\n${Y}--- MODULO: DEVOPS & SALUD ---${NC}"
    test_endpoint "GET" "/sistema/health" "200" "DevOps: Health Check"
    test_endpoint "GET" "/sistema/info" "200" "DevOps: System Info"
}

# --- EJECUCIÓN ---
echo -e "${Y}🚀 Ejecutando Certificación Final v2.5...${NC}"
mod_core
mod_sys

echo -e "\n${Y}====================================================${NC}"
echo -e "${G}ÉXITOS: $PASSED${NC} | ${R}FALLOS: $FAILED${NC}"
[[ $FAILED -eq 0 ]] && echo -e "${G}PROYECTO 100% CERTIFICADO ✅${NC}" || exit 1
