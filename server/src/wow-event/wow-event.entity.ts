import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Length } from 'class-validator';
import { WSBaseEntity } from '../common/common.entity';

@Entity('WowEvent')
export class WowEventEntity extends WSBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', width: 11, nullable: false })
  creatorId: number;

  @Column({ width: 32, nullable: false })
  wclId: string;

  @Column({ default: '', length: 225 })
  @Length(0, 110)
  title: string;

  @Column({ type: 'int', width: 11, nullable: false })
  totalEquipmentIncome: number;

  @Column({ type: 'json', nullable: true })
  originWclData: any;
}
