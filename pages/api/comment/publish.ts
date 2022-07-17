import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { AppDataSource } from 'db/index';
import { Article, User, Comment } from 'db/entity/index';
import {EXCEPTION_ARTICLE}from 'pages/api/config/codes'

export default withIronSessionApiRoute(publish, ironOptions);

async function publish(req: NextApiRequest, res: NextApiResponse) {

    const session: ISession = req.session;
    const { articleId = 0,  content= ''} = req.body;
    const db = await AppDataSource.initialize();
    const userRepo =  db.getRepository(User);
    const articleRepo =  db.getRepository(Article);
    const commentRepo = db.getRepository(Comment);

    const user = await userRepo.findOne({
        where:{
            id: session.userId,
        }
    })

    const articleFetched = await articleRepo.findOne({
        where:{
            id: articleId,
        }
    })


    const comment = new Comment();
    comment.content = content;
    comment.create_time = new Date();
    comment.update_time = new Date();

    if (user){
        comment.object = user;
    }

    //To Check
    if (user){
       comment.article = articleFetched as Article;
    }


    const resComment = await commentRepo.save(comment);


    if(resComment){
        res.status(200).json({data: resComment, code: '000000',msg: '发表成功'})
    }else {
        res.status(200).json({...EXCEPTION_ARTICLE.PUBLISH_FAILED});
    }
} 