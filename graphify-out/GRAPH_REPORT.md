# Graph Report - tp-maniqui-backend  (2026-05-28)

## Corpus Check
- 166 files · ~82,516 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 189 nodes · 356 edges · 17 communities detected
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]

## God Nodes (most connected - your core abstractions)
1. `constructor()` - 10 edges
2. `add()` - 10 edges
3. `ProduccionService` - 9 edges
4. `conectarDB()` - 8 edges
5. `SistemaService` - 8 edges
6. `ComercialService` - 8 edges
7. `Re()` - 7 edges
8. `AppError` - 7 edges
9. `SistemaRepository` - 7 edges
10. `Maniqui` - 6 edges

## Surprising Connections (you probably didn't know these)
- `resetDB()` --calls--> `conectarDB()`  [INFERRED]
  reset_db_users.js → src/db.ts
- `reformarDB()` --calls--> `conectarDB()`  [INFERRED]
  run_db_reform.js → src/db.ts
- `crearAdminInicial()` --calls--> `conectarDB()`  [INFERRED]
  setup_admin.js → src/db.ts

## Communities (28 total, 9 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.15
Nodes (7): AuthController, ComercialController, ProduccionController, SistemaController, asyncHandler(), AuthService, AppError

### Community 1 - "Community 1"
Cohesion: 0.18
Nodes (11): Cliente, DetalleVenta, Maniqui, Modelo, Pieza, Usuario, Venta, resetDB() (+3 more)

### Community 2 - "Community 2"
Cohesion: 0.14
Nodes (8): Ae(), at(), Ce(), He(), it(), Pe(), Te(), xe()

### Community 3 - "Community 3"
Cohesion: 0.18
Nodes (15): add(), Be(), De(), _e(), Ee(), Fe(), ft(), ht() (+7 more)

### Community 4 - "Community 4"
Cohesion: 0.3
Nodes (4): esGerente(), esVendedor(), verifyToken(), errorHandler()

### Community 5 - "Community 5"
Cohesion: 0.31
Nodes (9): constructor(), ensureFocusedElementVisible(), filterChanged(), fromLocalStorage(), getItem(), listenForCodeCopies(), scrollToHash(), showPage() (+1 more)

### Community 6 - "Community 6"
Cohesion: 0.33
Nodes (7): handleValueChange(), onDocumentPointerDown(), onPointerUp(), setActive(), setItem(), setLocalStorage(), toggle()

### Community 12 - "Community 12"
Cohesion: 0.4
Nodes (5): createComponents(), ensureActivePageVisible(), Ne(), Re(), rt()

## Knowledge Gaps
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SistemaService` connect `Community 7` to `Community 0`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `ComercialService` connect `Community 9` to `Community 0`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `SistemaRepository` connect `Community 10` to `Community 1`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `conectarDB()` (e.g. with `resetDB()` and `reformarDB()`) actually correct?**
  _`conectarDB()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._