import { AggregateRoot } from '../domain/aggregate-root.base';

export interface Mapper<DomainEntity extends AggregateRoot<any>, DbRecord, Response = any> {
  toPersistence(entity: DomainEntity): DbRecord;

  toDomain(record: any): DomainEntity;

  toResponse?(entity: DomainEntity): Response;
}
