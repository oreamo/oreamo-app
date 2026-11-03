---
paths:
  - "app/**"
---

# Architecture Convention

The codebase is organized by **domain** (feature) folders. Each domain folder holds its own
router, service, schemas, and models as separate files, prefixed with the domain name. There is
no class-based service/repository layer — everything is a module-level function.

---

### Layers

| Layer       | File               | Responsibility                                                          |
|-------------|--------------------|---------------------------------------------------------------------------|
| **Router**  | `{domain}_router.py`  | HTTP boundary: parse request, invoke service, map result to response. |
| **Service** | `{domain}_service.py` | Business logic, query assembly, and DB/external-resource access.      |
| **Schema**  | `{domain}_schema.py` | Pydantic request/response and filter models.                          |
| **Model**   | `{domain}_model.py`  | SQLAlchemy ORM entities.                                               |

There is no separate repository layer. The service file owns both business logic and the
DB queries it needs — splitting DB access into its own file/class is unnecessary at this
project's scale (see `fastapi/full-stack-fastapi-template`'s `crud.py` and `Netflix/dispatch`'s
`service.py`, both function-based with no repository layer).

### Functions, not classes

- No `class FooService` / `class FooRepository` with constructor-injected dependencies.
- Dependencies (`db: AsyncSession`, `redis: Redis`, etc.) are received as plain function
  parameters, starting at the router and passed down explicitly to the service.
- Classes are still fine for data shapes (Pydantic schemas, SQLAlchemy models) — this rule is
  about behavior, not data.

### Dependency Direction

- Router may call its own domain's service (router -> service).
- A service may call another domain's service directly (e.g. `session_service` calls
  `user_service.get_user`) — there being no repository layer, there's nothing to protect
  against cross-domain reach-in.
- Services must not depend on the router layer (no `Request`/`Response`/HTTP types inside
  services).

### Folder Layout

**`app/`** — root package. **`{domain}/`** — one feature; repeat the file set per domain.

```
app/
├── {domain}/
│   ├── {domain}_router.py
│   ├── {domain}_service.py
│   ├── {domain}_schema.py
│   └── {domain}_model.py
├── common/         # cross-domain features, same file set as a domain
└── core/           # shared infra: config, db session, redis, s3, security, middleware
```

Folder and file names are singular (`user`, `user_model.py`), matching the convention used in
`fastapi/full-stack-fastapi-template` and `Netflix/dispatch`.

### Function Naming

- **Router**: prefix with the HTTP method — `get_`, `post_`, `put_`, `patch_`, `delete_`.
- **Service**: prefix with the CRUD intent — `get_`, `save_`, `update_`, `delete_`.
- **But**: when a prefix (HTTP method or CRUD intent) can't express what the function actually
  does — a domain-specific action rather than plain CRUD — skip the prefix and name the
  function after its purpose instead. Examples: `login`, `logout`, `refresh_session`, `operate_roles`, `download_file`.

### Function Signatures

- All parameters are keyword-only (`*,` before the first parameter). Callers pass every
  argument by name, so declaration order never has to match call-site order — functionally
  the same experience as calling with a single options object.
- `db` (and other infra resources like `redis`) is declared **last** among the parameters,
  even though callers pass it by name. Domain/business parameters (filters, request bodies)
  come first.

```python
async def get_common_codes(
    *, common_codes_search: CommonCodesSearch, db: AsyncSession
) -> PageResponse[CommonCode]: ...
```

### Function Order

- Public functions come first, in the order a caller would reach for them.
- Private helpers (`_`-prefixed) come last, below the public functions that use them.

### Reference

- [fastapi/full-stack-fastapi-template](https://github.com/fastapi/full-stack-fastapi-template) — Official FastAPI Template
- [Netflix/dispatch](https://github.com/Netflix/dispatch) — FastAPI Production Codebase
