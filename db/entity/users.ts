import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name: 'users'})
export class User { //BaseEntity for creating time and auto id 
    @PrimaryGeneratedColumn()
    readonly id!: number;

    @Column()
    nickname!: string;
    
    @Column()
    avatar!: string;
    
    @Column()
    job!: string;

    @Column()
    introduction!:string;
}