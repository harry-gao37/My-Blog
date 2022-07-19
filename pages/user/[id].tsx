import React from 'react'
import { Button, Avatar, Divider } from 'antd';
import {observer} from 'mobx-react-lite'
import styles from './index.module.scss'
import {CodeOutlined,FireOutlined,FundViewOutlined} from '@ant-design/icons';
import { AppDataSource } from 'db'
import {User, Article} from 'db/entity'
import ListItem from 'components/ListItem';
import Link from 'next/link'


//static page:
// export async function getStaticPaths(){
//   const db = await AppDataSource.initialize();
//   const userRepo = db.getRepository(User)
//   const users = await userRepo.find();
//   const userIds = users?.map(user =>({params: { id: String(user?.id)}}))

//   return {
//     paths: userIds,
//     fallback: 'blocking'
//   }
// }

// export async function getStaticProps({params}: {params: any}) {
//   const userId = params?.id;
//   const db = await AppDataSource.initialize();
//   const userRepo =  db.getRepository(User) ;
//    const articleRepo =  db.getRepository(Article)

  
//   const user = await userRepo.findOne({
//     where: {
//       id: Number(userId)
//     }
//   });

//   const articles = await articleRepo.find({
//     where:{
//       object: {
//         id: Number(userId)
//       }
//     },
//     relations:['object', 'tags']
//   })


//   return {
//     props: {
//       userInfo: JSON.parse(JSON.stringify(user)),
//       article: JSON.parse(JSON.stringify(articles)) || [],
//     }
//   }
// }



export async function getServerSideProps({params}: {params: any}) {

  const userId = params?.id;
  const db = await AppDataSource.initialize();
  const userRepo =  db.getRepository(User) ;
   const articleRepo =  db.getRepository(Article)

  
  const user = await userRepo.findOne({
    where: {
      id: Number(userId)
    }
  });

  const articles = await articleRepo.find({
    where:{
      object: {
        id: Number(userId)
      }
    },
    relations:['object', 'tags']
  })


  return {
    props: {
      userInfo: JSON.parse(JSON.stringify(user)),
      article: JSON.parse(JSON.stringify(articles)) || [],
    }
  }
}





//using client side render
const UserDetail = (props: any) =>{
  const {userInfo = {}, article = [] } = props;
  const viewsCount = article?.reduce((prev: any,next: any) => prev + next?.views, 0)

  return (
    <div className={styles.userDetail}>
      <div className={styles.left}>
        <div className={styles.userInfo}>
          <Avatar className={styles.avatar} src={userInfo?.avatar} size={90} />
          <div>
            <div className={styles.nickname}>{userInfo?.nickname}</div>
            <div className={styles.desc}>
              <CodeOutlined /> {userInfo?.job}
            </div>
            <div className={styles.desc}>
              <FireOutlined /> {userInfo?.introduce}
            </div>
          </div>
          <Link href="/user/profile">
            <Button>编辑个人资料</Button>
          </Link>
        </div>
        <Divider />
        <div className={styles.article}>
          {article?.map((article: any) => (
            <div key={article?.id}>
              <ListItem article={article} />
              <Divider />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.achievement}>
          <div className={styles.header}>个人成就</div>
          <div className={styles.number}>
            <div className={styles.wrapper}>
              <FundViewOutlined />
              <span>共创作 {article?.length} 篇文章</span>
            </div>
            <div className={styles.wrapper}>
              <FundViewOutlined />
              <span>文章被阅读 {viewsCount} 次</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default observer(UserDetail);