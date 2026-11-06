import asyncio

import bcrypt


async def hash_password(password: str) -> str:
    # BCrypt format ($2a$, strength 10)
    salt = bcrypt.gensalt(rounds=10, prefix=b"2a")
    hashed = await asyncio.to_thread(bcrypt.hashpw, password.encode(), salt)
    return hashed.decode()


async def verify_password(password: str, hashed_password: str) -> bool:
    return await asyncio.to_thread(
        bcrypt.checkpw, password.encode(), hashed_password.encode()
    )
