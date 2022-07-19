import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { AppDataSource } from 'db/index';
import { Article, User, Tag } from 'db/entity/index';
import {EXCEPTION_ARTICLE}from 'pages/api/config/codes'

export default withIronSessionApiRoute(redirect, ironOptions);

async function redirect(req: NextApiRequest, res: NextApiResponse) {
    const session: ISession = req.session;
    const { title= '', content= '',tagIds=[]} = req.body;
    const db = await AppDataSource.initialize();
    const userRepo =  db.getRepository(User);
    const articleRepo =  db.getRepository(Article);
    const tagRepo =  db.getRepository(Tag);


    const user = await userRepo.findOne({
        where:{
            id: session.userId,
        }
    })



    const selectedTag: any[] = [];

    tagIds.map(async (tagId: number) =>{
        selectedTag?.concat(await tagRepo.createQueryBuilder("tag").where('id: :tagid'),{tagid: tagId})
    })


    const article = new Article();
    article.title = title;
    article.content = content;
    article.create_time = new Date();
    article.update_time = new Date();
    article.is_delete = 0;
    article.views = 0;

    if (user){
        article.object = user;
    }
    if (selectedTag){
        
        const newTags = selectedTag?.map(tag =>{
            tag.article_count = tag?.article_count + 1;
            return tag;
        })
        article.tags = newTags;


    }


    const resArticle = await articleRepo.save(article);

    console.log(user);
    console.log(article);

    if(resArticle){
        res.status(200).json({data:resArticle, code: '000000',msg: '发布成功'})
    }else {
        res.status(200).json({...EXCEPTION_ARTICLE.PUBLISH_FAILED});
    }
} 