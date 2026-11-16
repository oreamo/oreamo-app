import math

from pydantic import BaseModel
from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.schema import PageResponse, Pagination


async def paginate[S: BaseModel](
    *, query: Select, pagination: Pagination, schema: type[S], db: AsyncSession
) -> PageResponse[S]:
    # Same as PageHelper: page info is only filled when both page number and size are positive
    if not pagination.is_pageable():
        result = await db.execute(query)
        items = [schema.model_validate(entity) for entity in result.scalars().all()]
        return PageResponse(page_num=0, page_size=0, pages=0, total=0, items=items)

    page_num = pagination.page_num or 0
    page_size = pagination.page_size or 0

    count_query = select(func.count()).select_from(query.order_by(None).subquery())
    total = await db.scalar(count_query) or 0

    result = await db.execute(query.limit(page_size).offset((page_num - 1) * page_size))
    items = [schema.model_validate(entity) for entity in result.scalars().all()]
    return PageResponse(
        page_num=page_num,
        page_size=page_size,
        pages=math.ceil(total / page_size),
        total=total,
        items=items,
    )
