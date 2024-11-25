import { Table, Column, Model, DataType, Default, PrimaryKey } from 'sequelize-typescript';
import { PaymentStatus } from '../types';


@Table({
  tableName: 'payments',
  modelName: 'Payment',
  timestamps:true,
})

export class Payment extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  amount!: number;

  @Column({
    type: DataType.STRING(3),
    allowNull: false,
  })
  currency!: string;


  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  reference!: string;

  @Default('pending')
  @Column({
    type: DataType.ENUM('pending', 'completed', 'failed'),
    allowNull: false,
  })
  status!: PaymentStatus;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  created_at!: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updated_at!: Date;
}
