import {Entity, Column, PrimaryGeneratedColumn,ManyToOne, JoinColumn} from "typeorm";
import {User,Article} from './index'

@Entity({name: 'comments'})
export class Comment {
    @PrimaryGeneratedColumn()
    readonly id!: number;

    @Column()
    content!: string;
    
    @Column()
    create_time!: Date

    @Column()
    update_time!: Date;


    @ManyToOne(() => User)
    @JoinColumn({name: 'user_id'})
    object!: User;

    @ManyToOne(() => Article, (article) => article.comments)
    @JoinColumn({name: 'article_id'})
    article!: Article;
}