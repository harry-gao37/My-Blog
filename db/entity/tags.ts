import {Entity, Column, PrimaryGeneratedColumn,ManyToMany, JoinTable} from "typeorm";
import {User,Article} from './index'

@Entity({name: 'tags'})
export class Tag {
    @PrimaryGeneratedColumn()
    readonly id!: number;

    @Column()
    title!: string;
    
    @Column()
    icon!: string;
     
    @Column()
    follow_count!: number;


    @Column()
    article_count!: number;

    @ManyToMany(() => User, {
        cascade: true
    })
    @JoinTable({
        name: 'tags_users_rel',
        joinColumn:{
            name: 'tag_id'
        },
        inverseJoinColumn:{
            name: 'user_id'
        }
        })
    object!: User[];


    @ManyToMany(() => Article,(article)=>article.tags)
    @JoinTable({
        name: 'tags_articles_rel',
        joinColumn:{
            name: 'tag_id'
        },
        inverseJoinColumn:{
            name: 'article_id'
        }
        })
    articles!: Article[]

}