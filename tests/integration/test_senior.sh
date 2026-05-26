#!/bin/bash
# 🧪 Tecda Maniquí - Full Coverage Final Verification v2.1
BASE_URL="http://localhost:8081"
TOKEN="eyJhbGciOiJIUzI1NiIsInR..."

# Colores
G='\033[0;32m'; R='\033[0;31m'; B='\033[0;34m'; NC='\033[0m'

run_test() {
    local method=$1; local path=$2; local expect=$3; local title=$4; local prefer=$5
    echo -n -e "${B}TEST:${NC} $title... "
    local headers="-H 'Content-Type: application/json' -H 'Authorization: Bearer $TOKEN'"
    [ -n "$prefer" ] && headers="$headers -H 'Prefer: code=$prefer'"
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

echo -e "🚀 Iniciando Verificación Senior v2.1...\n"

# Éxitos Base
run_test "POST" "/auth/login" "200" "Auth: Login Gerente"
run_test "GET" "/reportes/produccion" "200" "Analítica: Vista de Producción"

# Flujo de Ventas
run_test "POST" "/clientes" "201" "Ventas: Registro Cliente"
run_test "POST" "/ventas" "201" "Ventas: Registro Venta Exitosa"

# Seguridad y Roles
run_test "POST" "/maniquies" "403" "Seguridad: Bloqueo Rol Vendedor en Producción" "403"
run_test "GET" "/maniquies" "401" "Seguridad: Token Requerido" "401"

# Negocio (SQL Constraints)
run_test "PUT" "/piezas/PZ-1/ensamblar" "409" "Motor DB: Trigger Anti-Frankenstein" "409"
run_test "POST" "/maniquies" "409" "Motor DB: SP Fallo por Stock Insuficiente" "409"

echo -e "\n🏁 Auditoría Senior finalizada."
