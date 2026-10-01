import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// сущность
// она описывает какие таблицы должны быть созданы в базе данных (БД)
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  // id должен быть number
  id!: number;

  @Column({ unique: true })
  login!: string;

  @Column()
  password!: string;

  @Column({ type: 'varchar', nullable: true })
  refreshToken!: string | null;
}
