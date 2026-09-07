"use client";

import { useEffect, useCallback, useRef } from 'react';
import { wsClient } from '@/lib/websocket';

type WSEventType = 'new_alert' | 'new_event' | 'camera_status_changed' | 'evidence_created' | 'blockchain_updated';

export function useWebSocket(event: WSEventType, callback: (data: Record<string, unknown>) => void) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const handler = (msg: { data: Record<string, unknown> }) => {
      callbackRef.current(msg.data);
    };

    wsClient.on(event, handler);
    wsClient.connect();

    return () => {
      wsClient.off(event, handler);
    };
  }, [event]);
}
