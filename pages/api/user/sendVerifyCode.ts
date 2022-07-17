import {NextApiRequest,NextApiResponse } from 'next';
import {format} from "date-fns";
import md5 from 'md5'
import {encode} from 'js-base64'
import request from 'service/fetch'
import {withIronSessionApiRoute} from 'iron-session/next'
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
export default withIronSessionApiRoute(sendVerifyCode,ironOptions)

async function sendVerifyCode (req: NextApiRequest,res: NextApiResponse) {
    const session: ISession = req.session;
    const { to ='', templateId='1' } = req.body;
    const AccountId = '8a216da881ad97540181f5389d6a10b5';
    const AuthToken = 'a697744e00b6499c80e88b213d562a6e';
    const AppId = '8a216da881ad97540181f5389e5410bc';
    const NowDate = format(new Date(),'yyyyMMddHHmmss');
    const SigParameter = md5(`${AccountId}${AuthToken}${NowDate}`)
    const Authorization = encode(`${AccountId}:${NowDate}`)
    const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
    const expireMinute = '5';
    const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountId}/SMS/TemplateSMS?sig=${SigParameter}`

    console.log(to);
    console.log(SigParameter);
    console.log(Authorization);
    console.log(templateId);

    const response = await request.post(url,{
        to,
        templateId,
        appId: AppId,
        datas: [verifyCode,expireMinute],
    },
    {
        headers: {
            Authorization
        }
    })

    console.log(response)
    console.log(verifyCode)

    const  {statusCode, statusMsg, templateSMS} =  response as any;

    if (statusCode === '000000' ){
        session.verifyCode = verifyCode;
        await session.save();
        res.status(200).json({
            code: '000000',
            msg: statusMsg,
            data:{
                templateSMS
            }
        });
    } else { 
        res.status(200).json({
            code: statusCode,
            msg: statusMsg
        });
    }


} 