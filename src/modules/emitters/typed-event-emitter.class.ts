import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventPayloads } from './event-types.interface';

@Injectable()
export class TypedEventEmitter {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emit<K extends keyof EventPayloads>(
    event: K,
    payload: EventPayloads[K],
  ): boolean {
    return this.eventEmitter.emit(event, payload);
  }
}
