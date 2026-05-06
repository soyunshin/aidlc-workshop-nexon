"""SSE service - manages event subscriptions and broadcasting."""

import asyncio
import json
from collections import defaultdict

import structlog

logger = structlog.get_logger()


class SSEService:
    """Service for managing Server-Sent Events connections."""

    def __init__(self):
        # store_id -> list of asyncio.Queue
        self._subscribers: dict[int, list[asyncio.Queue]] = defaultdict(list)

    def subscribe(self, store_id: int) -> asyncio.Queue:
        """Subscribe to events for a store. Returns a queue to read events from."""
        queue: asyncio.Queue = asyncio.Queue()
        self._subscribers[store_id].append(queue)
        logger.info("SSE client subscribed", store_id=store_id)
        return queue

    def unsubscribe(self, store_id: int, queue: asyncio.Queue) -> None:
        """Unsubscribe from events."""
        if queue in self._subscribers[store_id]:
            self._subscribers[store_id].remove(queue)
            logger.info("SSE client unsubscribed", store_id=store_id)

    async def publish(
        self, store_id: int, event_type: str, data: dict
    ) -> None:
        """Publish an event to all subscribers of a store."""
        message = {
            "event": event_type,
            "data": json.dumps(data, default=str),
        }
        subscribers = self._subscribers.get(store_id, [])
        for queue in subscribers:
            try:
                queue.put_nowait(message)
            except asyncio.QueueFull:
                logger.warning("SSE queue full, dropping event", store_id=store_id)


# Singleton instance
sse_service = SSEService()
