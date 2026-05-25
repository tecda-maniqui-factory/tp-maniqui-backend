#!/bin/bash
# 🧪 Tecda Maniquí - Probador Automático Full Coverage
BASE_URL="http://localhost:8081"

test_endpoint() {
    local method=$1; local path=$2; local expected=$3; local data=$4
    echo -n "Testing $method $path... "
    if [ "$method" == "GET" ]; then
        status=$(curl -o /dev/null -s -w "%{http_code}" "$BASE_URL$path")
    else
        status=$(curl -o /dev/null -s -w "%{http_code}" -X "$method" -H "Content-Type: application/json" -d "$data" "$BASE_URL$path")
    fi
    [ "$status" == "$expected" ] && echo "✅ ($status)" || echo "❌ ERROR ($status vs $expected)"
}

echo "🚀 Iniciando pruebas de cobertura total..."
test_endpoint "GET"  "/maniquies" "200"
test_endpoint "POST" "/maniquies" "201" '{"modelo_id": 1, "numero_serie": "T"}'
test_endpoint "POST" "/piezas" "201" '{"tipo_parte_id":1,"modelo_id":1,"origen_id":1,"tono_acabado_id":1}'
test_endpoint "GET"  "/clientes" "200"
test_endpoint "POST" "/clientes" "201" '{"nombre":"Test","cuit_cuil":"1"}'
test_endpoint "POST" "/ventas" "201" '{"cliente_id":1,"maniquies_ids":[1]}'
test_endpoint "GET"  "/reportes/produccion" "200"
echo "🏁 Fin de pruebas."
