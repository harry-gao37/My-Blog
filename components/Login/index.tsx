import { ChangeEvent, useState } from 'react';
import { message } from 'antd';
import { observer } from 'mobx-react-lite';
import request from 'service/fetch';
import { useStore } from 'store/index';
import CountDown from 'components/CountDown';
import styles from './index.module.scss';


interface IProps {
  isShow: boolean;
  onClose: Function;
}

const Login = (props: IProps) => {
  const store = useStore();
  const { isShow = false, onClose } = props;
  const [isShowVerifyCode, setIsShowVerifyCode] = useState(false);
  const [form, setForm] = useState({
    phone: '',
    verify: '',
  });

  const handleClose = () => {
    onClose && onClose();
  };

  const handleGetVerifyCode = () => {
    if (!form?.phone) {
      message.warning('请输入手机号');
      return;
    }

    request
      .post('/api/user/sendVerifyCode', {
        to: form?.phone,
        templateId: 1,
      })
      .then((res: any) => {
        if (res?.code === '000000') {
          setIsShowVerifyCode(true);
        } else {
          message.error(res?.msg || '未知错误');
        }
      });
  };

  const handleLogin = () => {
    console.log(form.verify);
    request
      .post('/api/user/login', {
        ...form,
        identity_type: 'phone',
      })
      .then((res: any) => {
        if (res?.code === 0) {
          // 登录成功
          store.user.setUserInfo(res?.data);
          onClose && onClose();
        } else {
          message.error(res?.msg || '未知错误');
        }
      });
  };

  // client-id：1f81ce3cdaf419b5a847
  // client-secret：6a025afff2ee21c12915d093d7b2a4865c0ec9a7
  //GitHub OAuth: 1. Get access_code request by acquiring user authorization
  const handleOAuthGithub = () => {
    const githubClientid = '1f81ce3cdaf419b5a847';
    const redirectUri = 'http://localhost:3000/api/oauth/redirect';
    window.open(
      `https://github.com/login/oauth/authorize?client_id=${githubClientid}&redirect_uri=${redirectUri}`
    );
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleCountDownEnd = () => {
    setIsShowVerifyCode(false);
  };

  return isShow ? (
    <div className={styles.loginArea}>
      <div className={styles.loginBox}>
        <div className={styles.loginTitle}>
          <div>手机号登录</div>
          <div className={styles.close} onClick={handleClose}>
            x
          </div>
        </div>
        <input
          name="phone"
          type="text"
          placeholder="请输入手机号"
          value={form.phone}
          onChange={handleFormChange}
        />
        <div className={styles.verifyCodeArea}>
          <input
            name="verify"
            type="text"
            placeholder="请输入验证码"
            value={form.verify}
            onChange={handleFormChange}
          />
          <span className={styles.verifyCode} onClick={handleGetVerifyCode}>
            {isShowVerifyCode ? (
              <CountDown time={10} onEnd={handleCountDownEnd} />
            ) : (
              '获取验证码'
            )}
          </span>
        </div>
        <div className={styles.loginBtn} onClick={handleLogin}>
          登录
        </div>
        <div className={styles.otherLogin} onClick={handleOAuthGithub}>
          使用 Github 登录
        </div>
        <div className={styles.loginPrivacy}>
          注册登录即表示同意
          <a
            href="https://moco.imooc.com/privacy.html"
            target="_blank"
            rel="noreferrer"
          >
            隐私政策
          </a>
        </div>
      </div>
    </div>
  ) : null;
};


//浏览器响应式
export default observer(Login);






// import styles from "./index.module.scss"
// import {ChangeEvent, useState} from 'react'
// import CountDown from "components/CountDown"
// import {message} from 'antd'
// import request from 'service/fetch'

// interface IProps {
//     isShow: boolean;
//     onClose: Function;
// }

// const Login = (props: IProps) =>{
//     const {isShow = false, onClose} = props; //从props取值，默认值

//     const [form, setForm] = useState(
//     {   
//         phone: '',
//         verify: ''
//     }
//     );

//     const [isShowVerifyCode, setIsShowVerifyCode] = useState(false);

//     const handleClose =()=>{
//         onClose && onClose();
//     }

//     const handleGetVerfyCode=()=>{
//         if ( !form?.phone){
//             message.warning("请输入手机号");
//             return;
//         }

//         request.post('api/user/sendVerifyCode',{
//             to: form?.phone,
//             templateId: 1
//         }).then((res: any) => {
//             if (res?.code === 0){
//                 setIsShowVerifyCode(true);
//             } else {
//                 message.error(res?.msg || '未知错误');
//             }
//         });
//     }

//     const handleLogin=()=>{
//         request.post('/api/user/login',{
//             ...form,
//             identity_type: 'phone',
//         // }).then((res:any) =>{
//         //     if (res?.code === 0){
//         //         onClose && onClose();
//         //     } else {
//         //         message.error(res?.msg || "未知错误");
//         //     }
//         })

//     }
//     const handleOAuthGithub=()=>{

//     }

//     const handleCountDownEnd = ()=>{
//         setIsShowVerifyCode(false);
//     }



//     const handleFormChange =(e: ChangeEvent<HTMLInputElement>)=>{
//         const {name,value} = e.target;
//         setForm(
//         {         
//             ...form,
//             [name]: value
//         }
//         )
//     }

//     return isShow ? 
//     (<div className={styles.loginArea}>
//         <div className={styles.loginBox}>
//             <div className={styles.loginTitle}>
//                 <div>手机号登陆</div> 
//                 <div className={styles.close} onClick={handleClose}>x</div>
//             </div>
//             <input name='phone' type='text'  placeholder="请输入手机号" value={form.phone} onChange={handleFormChange}/>
//             <div className={styles.verifyCodeArea}>
//                 <input name='verify' type='text'  placeholder="请输入验证码" value={form.verify} onChange={handleFormChange}/>
//                 <span className={styles.verifyCode} onClick={handleGetVerfyCode}>
//                     {isShowVerifyCode ? <CountDown time={10} onEnd={handleCountDownEnd} /> : "获取验证码"}
//                 </span>
//             </div>
//             <div className={styles.loginBtn} onClick={handleLogin}>登陆</div>
//             <div className={styles.otherLogin} onClick={handleOAuthGithub}>使用 Github 登陆</div>
//             <div className={styles.loginPrivacy}>
//                 注册登陆即表示同意
//                 <a href="" rel="noreferrer" target="_blank">隐私政策</a>
//             </div>
//         </div>
//     </div>
//     )
//     : null ;
    

// }

// export default Login;