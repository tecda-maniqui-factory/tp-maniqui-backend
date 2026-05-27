#!/bin/bash
# 🧪 Tecda Maniquí - Probador Automático Full Coverage v4.0 (SOLID/TS)
BASE_URL="http://localhost:8081"

echo "🧹 Reseteando Base de Datos..."
npx tsx reset_db_users.js

echo "🚀 Iniciando pruebas de cobertura total..."

# 1. Login y obtención de Token
echo -n "Autenticando admin_pablo... "
LOGIN_RESPONSE=$(curl -o /dev/null -s -w "%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin_pablo","password":"tecda2026"}')

# Realizamos login real para extraer token
LOGIN_REAL=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin_pablo","password":"tecda2026"}')

echo "DEBUG: Response: $LOGIN_REAL"

TOKEN=$(echo $LOGIN_REAL | grep -oP '(?<="token":")[^"]+')
if [ -z "$TOKEN" ]; then echo "❌ ERROR: No se pudo obtener el token."; exit 1; fi
AUTH_HEADER="Authorization: Bearer $TOKEN"
echo "✅ OK"

test_endpoint() {
    local method=$1; local path=$2; local expected=$3; local data=$4; local msg=$5
    echo -n "Testing $method $path ($msg)... "
    
    if [ "$method" == "GET" ]; then
        status=$(curl -o /dev/null -s -w "%{http_code}" -H "$AUTH_HEADER" "$BASE_URL$path")
    else
        status=$(curl -o /dev/null -s -w "%{http_code}" -X "$method" \
            -H "$AUTH_HEADER" \
            -H "Content-Type: application/json" \
            -d "$data" "$BASE_URL$path")
    fi

    if [ "$status" == "$expected" ]; then
        echo "✅ ($status)"
    else
        echo "❌ ERROR ($status vs $expected)"
    fi
}

# --- 1. AUTENTICACIÓN Y USUARIOS ---
test_endpoint "POST" "/auth/register" "201" '{"username":"ventas_ana_2", "password":"password123", "email":"ana2@tecda.com", "rol":"vendedor"}' "Registro nuevo usuario"

# --- 2. PRODUCCIÓN Y ENSAMBLAJE ---
test_endpoint "GET"  "/maniquies" "200" "" "Listar maniquíes"
test_endpoint "POST" "/maniquies/ensamblar" "201" '{"modelo_id": 1, "numero_serie": "SERIE-TS-001"}' "Ensamblar maniquí SOLID"
test_endpoint "GET"  "/maniquies/SERIE-TS-001" "200" "" "Obtener detalle por serie"

# --- 3. COMERCIAL (CLIENTES Y VENTAS) ---
test_endpoint "POST" "/clientes" "201" '{"nombre":"Cliente TS", "cuit_cuil":"20-99887766-5", "email":"ts@test.com"}' "Registrar cliente"
test_endpoint "GET"  "/clientes" "200" "" "Listar clientes"
test_endpoint "POST" "/ventas" "201" '{"cliente_id":1, "maniquies":[{"maniqui_id":1, "precio_final":15000}]}' "Registrar venta SOLID"
test_endpoint "GET"  "/ventas" "200" "" "Listar ventas"

# --- 4. SISTEMA Y SALUD ---
test_endpoint "GET"  "/sistema/modelos" "200" "" "Listar modelos"
test_endpoint "GET"  "/sistema/health" "200" "" "Salud del sistema"
test_endpoint "GET"  "/sistema/modelos/1/descuento?porcentaje=15" "200" "" "Cálculo Descuento UDF"

# --- 5. PRUEBAS NEGATIVAS ---
test_endpoint "POST" "/auth/login" "401" '{"username":"bad","password":"bad"}' "Login fallido"
test_endpoint "GET"  "/maniquies/NONEXISTENT" "404" "" "Maniquí no encontrado"

echo "🏁 Fin de pruebas de integración v4.0."
