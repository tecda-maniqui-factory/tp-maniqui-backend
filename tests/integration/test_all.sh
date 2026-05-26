#!/bin/bash
# 🧪 Tecda Maniquí - Probador Automático Full Coverage v3.2
BASE_URL="http://localhost:8081"

echo "🧹 Reseteando Base de Datos..."
node reset_db_users.js

echo "🚀 Iniciando pruebas de cobertura total..."

# 1. Login y obtención de Token
echo -n "Autenticando admin_pablo... "
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin_pablo","password":"tecda2026"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -oP '(?<="token":")[^"]+')
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
        # Si es un error inesperado (500), podrías querer ver la respuesta, pero para CI basta el código
    fi
}

# --- 1. AUTENTICACIÓN Y USUARIOS ---
test_endpoint "POST" "/auth/register" "201" '{"username":"ventas_ana", "password":"password123", "email":"ana@tecda.com", "rol":"vendedor"}' "Registro nuevo usuario"
test_endpoint "POST" "/auth/login" "200" '{"username":"ventas_ana","password":"password123"}' "Login usuario nuevo"

# --- 2. PRODUCCIÓN Y ENSAMBLAJE ---
test_endpoint "GET"  "/maniquies" "200" "" "Listar maniquíes"
test_endpoint "POST" "/maniquies" "201" '{"modelo_id": 1, "numero_serie": "SERIE-TEST-001"}' "Ensamblar maniquí vía SP"
test_endpoint "GET"  "/maniquies/SERIE-TEST-001" "200" "" "Obtener detalle por serie"

# --- 3. INVENTARIO Y PIEZAS ---
test_endpoint "GET"  "/piezas" "200" "" "Listar todas las piezas"
test_endpoint "POST" "/piezas" "201" '{"tipo_parte_id":1,"modelo_id":1,"origen_id":1,"tono_acabado_id":1,"costo":150}' "Registrar pieza nueva"
test_endpoint "GET"  "/piezas?maniqui_id=null" "200" "" "Filtrar piezas libres"

# --- 4. COMERCIAL (CLIENTES Y VENTAS) ---
test_endpoint "POST" "/clientes" "201" '{"nombre":"Cliente Test", "cuit_cuil":"20-11223344-9", "email":"test@test.com"}' "Registrar cliente"
test_endpoint "GET"  "/clientes?activo=true" "200" "" "Listar clientes activos"
test_endpoint "POST" "/ventas" "201" '{"cliente_id":1, "maniquies":[{"maniqui_id":1, "precio_final":10000}]}' "Registrar venta"
test_endpoint "GET"  "/ventas" "200" "" "Listar ventas"

# --- 5. CATÁLOGOS Y SISTEMA ---
test_endpoint "GET"  "/modelos" "200" "" "Listar modelos técnicos"
test_endpoint "GET"  "/catalogos/sexos" "200" "" "Catálogo sexos"
test_endpoint "GET"  "/catalogos/tipos-parte" "200" "" "Catálogo tipos parte"
test_endpoint "GET"  "/sistema/health" "200" "" "Salud del sistema"
test_endpoint "GET"  "/modelos/1/descuento?porcentaje=20" "200" "" "Cálculo UDF Descuento"

# --- 6. ANALÍTICA (VISTAS SQL) ---
test_endpoint "GET"  "/reportes/rentabilidad" "200" "" "Vista Rentabilidad"
test_endpoint "GET"  "/reportes/stock-critico" "200" "" "Vista Stock Crítico"

# --- 7. PRUEBAS NEGATIVAS (VALIDACIONES) ---
echo "🧨 Pruebas de error y validación..."
test_endpoint "POST" "/auth/login" "401" '{"username":"admin","password":"xyz"}' "Login fallido"
test_endpoint "POST" "/clientes" "400" '{"nombre":"A", "cuit_cuil":"123"}' "Validación CUIT fallida"
test_endpoint "POST" "/maniquies" "409" '{"modelo_id": 1, "numero_serie": "SERIE-TEST-001"}' "Serie duplicada"

echo "🏁 Fin de pruebas de cobertura total v3.2."
