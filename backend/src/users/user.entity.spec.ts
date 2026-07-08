import { getMetadataArgsStorage } from 'typeorm';
import { User } from './user.entity';

describe('User entity', () => {
  it('uses a UUID primary key and a unique userCode', () => {
    const idColumn = getMetadataArgsStorage().columns.find(
      (column) => column.target === User && column.propertyName === 'id',
    );
    const userCodeColumn = getMetadataArgsStorage().columns.find(
      (column) => column.target === User && column.propertyName === 'userCode',
    );

    expect(idColumn).toBeDefined();
    expect(idColumn?.options?.primary).toBe(true);
    expect(idColumn?.options?.type).toBe('uuid');
    expect(userCodeColumn).toBeDefined();
    expect(userCodeColumn?.options?.unique).toBe(true);
    expect(userCodeColumn?.options?.nullable).toBe(true);
  });
});
