import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventPayloads } from './event-types.interface';

@Injectable()
export class TypedEventEmitter {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emitAsync<K extends keyof EventPayloads>(
    event: K,
    payload: EventPayloads[K],
  ): Promise<any> {
    return this.eventEmitter.emitAsync(event, payload);
  }
}
