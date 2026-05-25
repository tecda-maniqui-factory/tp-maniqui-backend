#!/bin/bash
# 🧪 Tecda Maniquí - Full Coverage Final Verification
BASE_URL="http://localhost:8081"
TOKEN="eyJhbGciOiJIUzI1NiIsInR..."

# Colores
G='\033[0;32m'
R='\033[0;31m'
B='\033[0;34m'
NC='\033[0m'

run_test() {
    local method=$1; local path=$2; local expect=$3; local title=$4; local prefer=$5
    echo -n -e "${B}TEST:${NC} $title... "
    
    # Construcción limpia del comando curl
    local headers="-H 'Content-Type: application/json' -H 'Authorization: Bearer $TOKEN'"
    [ -n "$prefer" ] && headers="$headers -H 'Prefer: code=$prefer'"
    
    # Para POST, enviamos un body genérico si no hay datos
    local data="-d '{}'"
    [[ "$method" == "GET" ]] && data=""

    local full_cmd="curl -s -o /dev/null -w '%{http_code}' -X $method $headers $data '$BASE_URL$path'"
    status=$(eval "$full_cmd")

    if [ "$status" == "$expect" ]; then
        echo -e "${G}PASSED ($status)${NC}"
    else
        echo -e "${R}FAILED (Expected $expect, Got $status)${NC}"
    fi
}

echo -e "🚀 Iniciando Verificación de Escenarios Totales...\n"

# Éxitos
run_test "GET" "/maniquies" "200" "Éxito: Listar Maniquíes"
run_test "POST" "/auth/login" "200" "Éxito: Login"

# Seguridad
run_test "GET" "/maniquies" "401" "Seguridad: Token Inválido" "401"
run_test "POST" "/maniquies" "403" "Seguridad: Rol Insuficiente" "403"

# Recurso
run_test "GET" "/maniquies/123" "404" "Recurso: No Encontrado" "404"

# Negocio (SQL)
run_test "PUT" "/piezas/PZ-1/ensamblar" "409" "Negocio: Fallo de Trigger" "409"
run_test "POST" "/maniquies" "409" "Negocio: Fallo de Stored Procedure" "409"

echo -e "\n🏁 Auditoría finalizada."
