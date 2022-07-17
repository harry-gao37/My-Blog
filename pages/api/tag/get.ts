import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { AppDataSource } from 'db/index';
import { Tag } from 'db/entity/index';

export default withIronSessionApiRoute(get, ironOptions);

async function get(req: NextApiRequest, res: NextApiResponse) {
    const session: ISession = req.session;
    const {userId = 0} = session;
    const db = await AppDataSource.initialize();
    const tagRepo =  db.getRepository(Tag);

    const followTags = await tagRepo.find({
        relations:['object'],
        where: (qb: any) => {
            qb.where('user_id = :id', {
                id: Number(userId)
            });
        },
        // {
        //     id: session.userId,
        // }
    })

    const allTags = await tagRepo.find({
        relations:['object'],
    })


        res.status(200).json({data:{
            followTags,
            allTags
        }, code: '000000',msg: ''})

} 