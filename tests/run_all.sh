#!/bin/bash
# =============================================================================
# 🏆 TECDA MANIQUÍ - MODULAR TEST ORCHESTRATOR (v2.0)
# =============================================================================

BASE_URL="http://localhost:8081"
TOKEN="any-mock-token"

# --- COLORES ---
G='\033[0;32m'; R='\033[0;31m'; B='\033[0;34m'; Y='\033[1;33m'; NC='\033[0m'
PASSED=0; FAILED=0

test_endpoint() {
    local method=$1; local path=$2; local expect=$3; local title=$4; local data=$5; local prefer=$6
    echo -n -e "${B}RUN:${NC} $title... "
    local headers=("-H" "Content-Type: application/json")
    [[ "$path" != "/auth/login"* ]] && headers+=("-H" "Authorization: Bearer $TOKEN")
    [[ -n "$prefer" ]] && headers+=("-H" "Prefer: code=$prefer")

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

# --- MODULOS ---
mod_auth() {
    echo -e "\n${Y}--- MODULO: AUTHENTICATION ---${NC}"
    test_endpoint "POST" "/auth/login" "200" "Login exitoso" '{"username":"admin_pablo","password":"tecda2026"}'
    test_endpoint "POST" "/auth/login" "401" "Login fallido" '{"username":"bad","password":"bad"}' "401"
}

mod_prod() {
    echo -e "\n${Y}--- MODULO: PRODUCCIÓN ---${NC}"
    test_endpoint "GET"  "/maniquies" "200" "Listar maniquíes"
    test_endpoint "POST" "/maniquies" "201" "Ensamblar unidad" '{"modelo_id":1, "numero_serie":"MQ-001"}'
    test_endpoint "GET"  "/maniquies/MQ-001" "200" "Detalle de unidad"
}

mod_inv() {
    echo -e "\n${Y}--- MODULO: INVENTARIO ---${NC}"
    test_endpoint "POST" "/piezas" "201" "Registrar pieza" '{"tipo_parte_id":1, "modelo_id":1, "origen_id":1, "tono_acabado_id":1}'
    test_endpoint "PUT"  "/piezas/PZ-1/ensamblar" "409" "Validar Anti-Frankenstein" '{"maniqui_id":99}' "409"
}

mod_ana() {
    echo -e "\n${Y}--- MODULO: ANALÍTICA ---${NC}"
    test_endpoint "GET" "/modelos/1/descuento?porcentaje=10" "200" "Calcular descuento"
    test_endpoint "GET" "/reportes/produccion" "200" "Dashboard de costos"
}

# --- LOGICA DE SELECCION ---
MODULE=${1:-all} # Si no hay argumento, ejecuta 'all'

echo -e "${Y}🚀 Iniciando Suite Modular (Target: $MODULE)...${NC}"

case $MODULE in
    auth) mod_auth ;;
    prod) mod_prod ;;
    inv)  mod_inv ;;
    ana)  mod_ana ;;
    all)
        mod_auth
        mod_prod
        mod_inv
        mod_ana
        ;;
    *)
        echo -e "${R}Error: Módulo '$MODULE' no reconocido.${NC}"
        echo "Uso: $0 [auth|prod|inv|ana|all]"
        exit 1
        ;;
esac

echo -e "\n${Y}====================================================${NC}"
echo -e "${G}ÉXITOS: $PASSED${NC} | ${R}FALLOS: $FAILED${NC}"
[[ $FAILED -eq 0 ]] && echo -e "${G}VALIDACIÓN EXITOSA 🚀${NC}" || exit 1
