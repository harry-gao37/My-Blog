import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { setCookie } from 'utils/index';
import { AppDataSource } from 'db/index';
import { User, UserAuth } from 'db/entity/index';

export default withIronSessionApiRoute(login, ironOptions);

async function login(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const cookies = Cookie.fromApiRoute(req, res);
  const { phone = '', verify = '', identity_type = 'phone' } = req.body;
  // const db = await prepareConnection();
    const db = await AppDataSource.initialize();

  
  const userAuthRepo = db.getRepository(UserAuth);
  console.log(verify)
  console.log(session.verifyCode)

  if (String(session.verifyCode) === String(verify)) {
    // 验证码正确，在 user_auths 表中查找 identity_type 是否有记录
            const userAuth = await userAuthRepo.findOne({
            // select: ["identity_type", "identifier"],
            relations: ['object'],
            where: {
                identifier: "phone"
            }
        }
          );

          console.log(userAuth);

    if (userAuth) {
      // 已存在的用户
      const user = userAuth.object;
      const { id, nickname, avatar } = user;

      session.userId = id;
      session.nickname = nickname;
      session.avatar = avatar;

      await session.save();

      setCookie(cookies, { id, nickname, avatar });

      res?.status(200).json({
        code: '000000',
        msg: '登录成功',
        data: {
          userId: id,
          nickname,
          avatar,
        },
      });
    } else {
      // 新用户，自动注册
      const user = new User();
      user.nickname = `用户_${Math.floor(Math.random() * 10000)}`;
      user.avatar = '/public/avatar.jpg';
      user.job = '暂无';
      user.introduction = '暂无';

      const userAuth = new UserAuth();
      userAuth.identifier = phone;
      userAuth.identity_type = identity_type;
      userAuth.credential = session.verifyCode;
      userAuth.object = user;

      const resUserAuth = await userAuthRepo.save(userAuth);
      const {
        object: { id, nickname, avatar },
      } = resUserAuth;

      session.userId = id;
      session.nickname = nickname;
      session.avatar = avatar;

      await session.save();

      setCookie(cookies, { id, nickname, avatar });

      res?.status(200).json({
        code: '000000',
        msg: '登录成功',
        data: {
          userId: id,
          nickname,
          avatar,
        },
      });
    }
  } else {
    res?.status(200).json({ code: -1, msg: '验证码错误' });
  }
}








// import {NextApiRequest,NextApiResponse } from 'next';
// import {withIronSessionApiRoute} from 'iron-session/next'
// import { ironOptions } from 'config/index';
// import { prepareConnection } from 'db/index';
// import {users,userAuths} from 'db/entity/index'
// import {ISession} from 'pages/api/index'

// export default withIronSessionApiRoute(login,ironOptions)


// async function login (req: NextApiRequest,res: NextApiResponse) {

//     const session: ISession = req.session;

//     const {phone ='', verify ='', identity_type ='phone' } = req.body;
//     const db = await prepareConnection();
//     const userRepo = db.getRepository(users);
//     const userAuthRepo = db.getRepository(userAuths);


//     const user = await userRepo.find();
//     console.log(user)

//     if (String(session.verifyCode) === String(verify)){
        
//         //find data from database
//         const userAuth = await userAuthRepo.findOne({
//             select: ["identity_type", "identifier"],
//             relations: ['user'],
//             where: {
//                 identifier: "phone"
//             }
//         }
//           );


//     //if we find data     
//     if (userAuth){
//         //existed
//         const user = userAuth.object;
//         const {id, nickname, avatar}= user

//         session.userId = id;
//         session.nickname = nickname;
//         session.avatar = avatar;

//         await session.save();

//         res?.status(200).json({
//             code: 0,
//             msg: '登录成功',
//             data: {
//               userId: id,
//               nickname,
//               avatar,
//             },
//           });

//     } else {
//         //new user, register automatically
//         const user = new users();
//         user.nickname = `用户_${Math.floor(Math.random() * 10000)}`;
//         user.avatar = '/images/avatar.jpg';
//         user.job = '暂无' ;
//         user.introduction ='暂无' ;


//         const userauth = new userAuths();
//         userauth.identifier = phone;
//         userauth.identity_type = identity_type;
//         userauth.credential = session.verifyCode;
//         userauth.object = user;

//         const resUserAuth = await userAuthRepo.save(userauth);
//         const {object:{id, nickname,avatar}} = resUserAuth;

        
//         session.userId = id;
//         session.nickname = nickname;
//         session.avatar = avatar;

//         await session.save();

//         res?.status(200).json({code: 0, msg: '登陆成功', data:{
//             userId: id,
//             nickname,
//             avatar
//         }});


//     }
//     } else {
//         res?.status(200).json({code: -1, msg: '验证码错误'});
//     }

// }