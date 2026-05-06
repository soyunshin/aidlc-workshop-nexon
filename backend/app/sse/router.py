"""SSE router - Server-Sent Events endpoint."""

import asyncio

from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse

from app.core.dependencies import TokenPayload, get_current_admin
from app.sse.service import sse_service

router = APIRouter(tags=["sse"])


@router.get("/api/admin/sse/orders")
async def sse_order_stream(
    request: Request,
    current_admin: TokenPayload = Depends(get_current_admin),
) -> StreamingResponse:
    """SSE endpoint for real-time order updates (admin)."""

    async def event_generator():
        queue = sse_service.subscribe(current_admin.store_id)
        try:
            while True:
                # Check if client disconnected
                if await request.is_disconnected():
                    break

                try:
                    message = await asyncio.wait_for(queue.get(), timeout=30.0)
                    yield f"event: {message['event']}\ndata: {message['data']}\n\n"
                except asyncio.TimeoutError:
                    # Send keepalive comment
                    yield ": keepalive\n\n"
        finally:
            sse_service.unsubscribe(current_admin.store_id, queue)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
