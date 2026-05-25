#!/bin/bash

# 🧪 Tecda Maniquí - Probador Automático (CURL Edition)
BASE_URL="http://localhost:8081"

echo "🚀 Iniciando pruebas rápidas de API..."
echo "---------------------------------------"

# Función para probar un endpoint
test_endpoint() {
    local method=$1
    local path=$2
    local expected=$3
    local data=$4
    
    echo -n "Testing $method $path... "
    
    # Ejecuta curl capturando solo el código de estado HTTP
    if [ "$method" == "GET" ]; then
        status=$(curl -o /dev/null -s -w "%{http_code}" "$BASE_URL$path")
    else
        status=$(curl -o /dev/null -s -w "%{http_code}" -X "$method" \
             -H "Content-Type: application/json" \
             -d "$data" "$BASE_URL$path")
    fi

    if [ "$status" == "$expected" ]; then
        echo "✅ (HTTP $status)"
    else
        echo "❌ ERROR (Esperaba $expected, recibí $status)"
    fi
}

# --- LISTA DE PRUEBAS ---

# 1. Producción
test_endpoint "GET"  "/maniquies" "200"
test_endpoint "POST" "/maniquies" "201" '{"modelo_id": 1, "numero_serie": "MQ-TEST-1"}'

# 2. Inventario
test_endpoint "GET"  "/piezas" "200"
test_endpoint "POST" "/piezas" "201" '{"tipo_parte_id": 1, "modelo_id": 1, "origen_id": 1, "tono_acabado_id": 1}'

# 3. Modelos y Cálculos
test_endpoint "GET"  "/modelos" "200"
test_endpoint "GET"  "/modelos/2/descuento?porcentaje=15" "200"

# 4. Reportes
test_endpoint "GET"  "/reportes/produccion" "200"

echo "---------------------------------------"
echo "🏁 Pruebas completadas."
