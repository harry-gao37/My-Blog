import {Entity, Column, PrimaryGeneratedColumn,ManyToOne, JoinColumn, OneToMany, ManyToMany} from "typeorm";
import {User,Comment,Tag} from './index'

@Entity({name: 'articles'})
export class Article {
    @PrimaryGeneratedColumn()
    readonly id!: number;

    @Column()
    title!: string;
    
    @Column()
    content!: string;
     
    @Column()
    views!: number;

    @Column()
    create_time!: Date

    @Column()
    update_time!: Date;

    @Column()
    is_delete!: number;

    @ManyToOne(() => User)
    @JoinColumn({name: 'user_id'})
    object!: User;


    @ManyToMany(() => Tag, (tag)=> tag.articles,{
        cascade: true
    })
    tags!: Tag[]

    @OneToMany(() => Comment, (comment) => comment.article)
    comments!: Comment[]

}