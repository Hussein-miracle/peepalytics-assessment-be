import { InferAttributes, InferCreationAttributes } from "sequelize";
import { Column, CreatedAt, DataType, Model, PrimaryKey, Table, Unique, UpdatedAt } from "sequelize-typescript";


@Table({
  tableName: 'customers',
  modelName: 'Customer',
  timestamps:true,
})

class Customer extends Model{
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;


  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Unique
  @Column({
    type:DataType.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  })
  email!:string;


  @CreatedAt
  @Column({
    type: DataType.DATE,
  })
  created_at!: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
  })
  updated_at!: Date;
}


export default Customer;