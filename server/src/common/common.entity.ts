import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export class WSBaseEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  removedAt: Date;
}
