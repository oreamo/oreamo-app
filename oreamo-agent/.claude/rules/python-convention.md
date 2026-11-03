# Python Convention

```
Follow the rules when implementing Python classes.
```

### Avoid Anemic Class

An anemic class is an antipattern where Python classes contain only data (fields) and no behavior. Classes should own the behavior that operates on their data.

- Conversion between a type and its primitive representation → method on that type
- Validation of a value → method on that type or its factory
- State transitions → method on the class, not the service
- Derived values computed from fields → method or property on the class

**Example**
```python
# Anemic — logic leaks to the caller
if user.data_status is not None and user.data_status == DataStatus.ENABLED:
    ...
order.status = "CANCELLED"
order.updated_at = datetime.now()

# Rich — behavior lives on the class
if user.enabled:
    ...
order.cancel()
```
