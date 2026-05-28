# Graph Report - .  (2026-05-27)

## Corpus Check
- 157 files · ~65,257 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 173 nodes · 269 edges · 24 communities detected
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Controller Constructors|Controller Constructors]]
- [[_COMMUNITY_Commercial Business Logic|Commercial Business Logic]]
- [[_COMMUNITY_Auth & User Management|Auth & User Management]]
- [[_COMMUNITY_Domain Entities|Domain Entities]]
- [[_COMMUNITY_Express Middlewares|Express Middlewares]]
- [[_COMMUNITY_System Persistence|System Persistence]]
- [[_COMMUNITY_System Services|System Services]]
- [[_COMMUNITY_Commercial Services|Commercial Services]]
- [[_COMMUNITY_Validation Rules|Validation Rules]]
- [[_COMMUNITY_Production Persistence|Production Persistence]]
- [[_COMMUNITY_User Persistence|User Persistence]]
- [[_COMMUNITY_Production Services|Production Services]]
- [[_COMMUNITY_API Core & Config|API Core & Config]]
- [[_COMMUNITY_Client Persistence|Client Persistence]]
- [[_COMMUNITY_Sales Persistence|Sales Persistence]]
- [[_COMMUNITY_Auth Services|Auth Services]]
- [[_COMMUNITY_Middleware Testing|Middleware Testing]]
- [[_COMMUNITY_Core Types & Interfaces|Core Types & Interfaces]]
- [[_COMMUNITY_Architecture & README|Architecture & README]]
- [[_COMMUNITY_Package Management|Package Management]]
- [[_COMMUNITY_Custom Error Handling|Custom Error Handling]]
- [[_COMMUNITY_System Service Interfaces|System Service Interfaces]]
- [[_COMMUNITY_Error Middleware Logic|Error Middleware Logic]]
- [[_COMMUNITY_Async Helper|Async Helper]]

## God Nodes (most connected - your core abstractions)
1. `Sequelize Instance` - 12 edges
2. `conectarDB()` - 8 edges
3. `SistemaService` - 8 edges
4. `ComercialService` - 8 edges
5. `SistemaRepository` - 7 edges
6. `ProduccionService` - 6 edges
7. `Maniqui Model` - 6 edges
8. `asyncHandler()` - 5 edges
9. `verifyToken()` - 5 edges
10. `ManiquiRepository` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Testing Strategy` --references--> `resetDB()`  [EXTRACTED]
  tests/README.md → reset_db_users.js
- `Tecda Maniquí Backend API` --describes--> `Composition Root`  [INFERRED]
  README.md → src/container.ts
- `Express Application` --uses--> `Tecda Maniquí API Specification`  [EXTRACTED]
  src/app.ts → openapi.yaml
- `resetDB()` --calls--> `conectarDB()`  [INFERRED]
  reset_db_users.js → src/db.ts
- `reformarDB()` --calls--> `conectarDB()`  [INFERRED]
  run_db_reform.js → src/db.ts

## Communities (26 total, 15 thin omitted)

### Community 0 - "Controller Constructors"
Cohesion: 0.14
Nodes (11): AuthController, ComercialController, ProduccionController, SistemaController, asyncHandler(), Cliente, DetalleVenta, Maniqui (+3 more)

### Community 1 - "Commercial Business Logic"
Cohesion: 0.16
Nodes (20): ClienteRepository, ComercialController, ComercialRoutes, ComercialService, Sequelize Instance, ManiquiRepository, Cliente Model, DetalleVenta Model (+12 more)

### Community 2 - "Auth & User Management"
Cohesion: 0.19
Nodes (12): AuthController, AuthRoutes, AuthService, conectarDB, Usuario, Usuario Model, resetDB(), reformarDB() (+4 more)

### Community 3 - "Domain Entities"
Cohesion: 0.18
Nodes (12): ICliente, IDetalleVenta, IManiqui, IModelo, IPieza, IVenta, IClienteRepository, IManiquiRepository (+4 more)

### Community 4 - "Express Middlewares"
Cohesion: 0.36
Nodes (4): esGerente(), esVendedor(), verifyToken(), errorHandler()

### Community 8 - "Validation Rules"
Cohesion: 0.33
Nodes (6): reglasCliente, reglasLogin, reglasManiqui, reglasRegistro, reglasVenta, validarRequest

### Community 12 - "API Core & Config"
Cohesion: 0.4
Nodes (5): Express Application, Environment Configuration, Server Entry Point, Pino Logger, Tecda Maniquí API Specification

### Community 16 - "Middleware Testing"
Cohesion: 0.5
Nodes (3): esGerente, esVendedor, verifyToken

### Community 17 - "Core Types & Interfaces"
Cohesion: 0.67
Nodes (3): IUsuario, IUsuarioRepository, IAuthService

## Knowledge Gaps
- **25 isolated node(s):** `Pieza`, `Tecda Maniquí Backend API`, `Tecda Maniquí API Specification`, `PNPM Workspace Config`, `Testing Strategy` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Sequelize Instance` connect `Commercial Business Logic` to `Auth & User Management`, `API Core & Config`?**
  _High betweenness centrality (0.162) - this node is a cross-community bridge._
- **Why does `conectarDB` connect `Auth & User Management` to `Commercial Business Logic`, `API Core & Config`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `conectarDB()` (e.g. with `resetDB()` and `reformarDB()`) actually correct?**
  _`conectarDB()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Pieza`, `Tecda Maniquí Backend API`, `Tecda Maniquí API Specification` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Controller Constructors` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._