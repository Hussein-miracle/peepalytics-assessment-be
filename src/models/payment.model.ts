import { InferAttributes, InferCreationAttributes} from 'sequelize';
import { Table, Column, Model, DataType, Default, PrimaryKey } from 'sequelize-typescript';
import { PaymentStatus } from '../types';


@Table({
  tableName: 'payments',
})

export class Payment extends Model<InferAttributes<Payment>,InferCreationAttributes<Payment>> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  amount!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  currency!: string;

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
