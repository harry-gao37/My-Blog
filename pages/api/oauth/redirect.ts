import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { setCookie } from 'utils/index';
import { AppDataSource } from 'db/index';
import { User, UserAuth } from 'db/entity/index';
import request from 'service/fetch'

export default withIronSessionApiRoute(redirect, ironOptions);

async function redirect(req: NextApiRequest, res: NextApiResponse) {
    const session: ISession = req.session;

    const {code} = req?.query || {};

    const githubClientID = '1f81ce3cdaf419b5a847';
    const githubSecret = '6a025afff2ee21c12915d093d7b2a4865c0ec9a7';

    const url = `https://github.com/login/oauth/access_token?client_id=${githubClientID}&client_secret=${githubSecret}&code=${code}`;

    //2. Get access code from github
    const result = await request.post(
        url,
        {},
        {
            headers:{
                accept:'application/json',
            },
        }
    );

    const {access_token} = result as any;

    //3.passing access code from server to acquire user info including access_token
    const githubUserInfo = await request.get('https://api.github.com/user',{
        headers:{
            accept: 'application/json',
            Authorization: `token ${access_token}`
        } 
    })


    const cookies = Cookie.fromApiRoute(req, res);
    const db = await AppDataSource.initialize();

    //4.updating database
    const userAuth = await db.getRepository(UserAuth).findOne({
        // select: ["identity_type", "identifier"],
        relations: ['object'],
        where: {
            identifier: "github"
        }
    });

    if (userAuth){
        //if exist, update credential

        const user = userAuth.object;

        const {id,nickname, avatar} = user;
        userAuth.credential = access_token;
        
        session.userId = id;
        session.nickname = nickname;
        session.avatar = avatar;

        await session.save();
        setCookie(cookies, {id,nickname,avatar});
  
        res.writeHead(302,{
            Location:'/'
        });

    } else{
        //create new user
        const {login = '', avatar_url = ''} = githubUserInfo as any;
        const user = new User();
        user.nickname = login;
        user.avatar = avatar_url;
        
        const userAuth = new UserAuth();
        userAuth.identity_type = 'github';
        userAuth.identifier = githubClientID;
        userAuth.credential = access_token;
        userAuth.object = user;

        const userAuthRepo = db.getRepository(UserAuth);
        const resUserAuth = await userAuthRepo.save(userAuth);


        const {id,nickname, avatar} = resUserAuth?.object || {};

        session.userId = id;
        session.nickname = nickname;
        session.avatar = avatar;

        await session.save();
        setCookie(cookies, {id,nickname,avatar});
    
        res.status(200).json({
            code:0,
            msg:'登陆成功',
            data:{
                userId: id,
                nickname,
                avatar
            }
        })


    }


}