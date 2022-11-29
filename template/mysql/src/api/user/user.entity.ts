import { Exclude } from 'class-transformer';
import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	public id!: number;

	//   @Index()
	@Column({ type: 'varchar', length: 120, unique: true })
	public username: string;

	//   @Index()
	@Column({ type: 'varchar', length: 120, unique: true })
	public email!: string;

	@Exclude()
	@Column({ type: 'varchar', length: 120 })
	public password!: string;

	@Column({ type: 'varchar', length: 200, nullable: true })
	public profilePic: string;

	// @Exclude()
	@Index()
	@CreateDateColumn()
	public createdAt!: Date;

	@Exclude()
	@UpdateDateColumn()
	public updatedAt: Date;

	@Exclude()
	@Column({ type: 'boolean', default: false })
	public isEmailConfirmed: boolean;

	@Index()
	@Column({ type: 'boolean', default: true })
	public isActive: boolean;

	@Column({ type: 'int', nullable: true })
	public deactivatedBy: number;

	public roles: string[];
}
