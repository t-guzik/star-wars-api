import type { EntityBase } from '../domain/entity.base';

export interface Mapper<DomainEntity extends EntityBase<any>, DbRecord, Response = any> {
  toPersistence(entity: DomainEntity): DbRecord;

  toDomain(record: any): DomainEntity;

  toResponse?(entity: DomainEntity): Response;
}
