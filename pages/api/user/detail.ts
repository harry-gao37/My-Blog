import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { AppDataSource } from 'db/index';
import { User  } from 'db/entity/index';
import {EXCEPTION_USER} from 'pages/api/config/codes'

export default withIronSessionApiRoute(detail, ironOptions);

async function detail(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { userId } = session;
  
  // const db = await prepareConnection();
  const db = await AppDataSource.initialize();
  const userRepo = db.getRepository(User);


 const user = await userRepo.findOne({
 where: {
     id: Number(userId)
        }
    });

if (user){
    res?.status(200).json({
        code: 0,
        msg: '登录成功',
        data: {
          userInfo: user,
      }});
    } else {
        res?.status(200).json({
            ...EXCEPTION_USER.NOT_FOUND
          });
    }


}




