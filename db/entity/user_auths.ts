import {Entity, Column, PrimaryGeneratedColumn,ManyToOne, JoinColumn} from "typeorm";
import {User} from './users';


@Entity({name: 'user_auths'})
export class UserAuth {
    @PrimaryGeneratedColumn()
    readonly id!: number;

    @Column()
    user_id!: number;
    
    @Column()
    identity_type!: string;
    
    @Column()
    identifier!: string;

    @Column()
    credential!:string;

    @ManyToOne(() => User,{
        cascade: true,
    })

    @JoinColumn({name: 'user_id'})
    object!: User
}