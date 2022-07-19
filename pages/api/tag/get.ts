import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { AppDataSource } from 'db/index';
import { Tag } from 'db/entity/index';
// import { Brackets } from 'typeorm';

export default withIronSessionApiRoute(get, ironOptions);

async function get(req: NextApiRequest, res: NextApiResponse) {
    const session: ISession = req.session;
    const {userId = 0} = session;
    console.log(AppDataSource.isInitialized)


    const db = await AppDataSource.initialize();
    const tagRepo =  db.getRepository(Tag);




    const followTags =  await tagRepo.createQueryBuilder('tag').leftJoinAndSelect('tag.object','object').where(' object.id = :id', {id: userId}).getOne();

    // console.log(followTags)
    //     //             id: Number(userId)
    //     //         })
    // const followTags = await tagRepo.find({
    //     relations:['object'],
    //     where: {

    //     }
    //     // where: ((qb: any) => {
    //     //     qb.where('user_id = :id', {
    //     //         id: Number(userId)
    //     //     });
    //     // }),

    // })

    const allTags = await tagRepo.createQueryBuilder('tag').leftJoinAndSelect('tag.object','object').getMany();
    // find({
    //     relations:['object'],
    // })

    db.destroy();


    console.log(followTags)
    console.log(allTags)
    
        res.status(200).json({data:{
            followTags,
            allTags
        }, code: '000000',msg: ''})

} 