import {AppDataSource} from 'db/index'
import {Article} from 'db/entity';
import {IArticle} from 'pages/api/index'
import styles from './index.module.scss'
import {Avatar, Input,Button, message,Divider} from 'antd'
import {observer} from 'mobx-react-lite'
import {useStore} from 'store/index'
import Link from 'next/link'
import MarkDown from 'markdown-to-jsx'
import {format} from 'date-fns'
import { useState } from 'react';
import request from 'service/fetch'


interface IProps {
  article: IArticle;
}


export async function getServerSideProps({params}: any) {


    const articleId = params.id;
    console.log(AppDataSource.isInitialized)
    const db = await AppDataSource.initialize();
    const articleRepo =  db.getRepository(Article)

    
    // isInitialized
    
    
    const article = await articleRepo.findOne({//,'comments','comments.object'
      relations: ['object','comments','comments.object'],
      where: {
        id: articleId
      },
      order: {
        update_time: 'ASC'
      }

    });


    if (article){
      article.views = article?.views + 1;
      await articleRepo.save(article);
    }
  
  
    console.log(article);
  
    return {
      props: {
        article: JSON.parse(JSON.stringify(article)) || [],
      }
    }
  }

  const ArticleDetail = (props: IProps) =>{
    const {article} = props;
    const {object: {nickname,avatar,id}, comments} = article;
    const store = useStore(); 
    const loginUserInfo = store?.user?.userInfo;

    const [inputVal, setInputVal] = useState('');
    const [newcomments, setNewComments] = useState(comments || []);


  const handleComment =() =>{
      request.post('/api/comment/publish',
      {
        articleId: article?.id,
        content: inputVal,
      }).then((res: any) =>{
        if (res?.code === '000000'){
          message.success('发表成功');
          // comments 是IComment类型
          const newComments = [
            {
              id: Math.random(),
              create_time:new Date(),
              update_time: new Date(),
              content: inputVal,
              object: {
                avatar: loginUserInfo?.avatar,
                nickname: loginUserInfo?.nickname,
              }
            }
          ].concat([...(newcomments as any)])
          setNewComments(newComments)
          setInputVal('')
        } else{ 
          message.error('发表失败')
        }
      })
    }

    return (
    <div>
      <div className='content-layout'>
        <h2 className={styles.title}>{article?.title}</h2>
        <div className={styles.user}>
          <Avatar src={avatar} size={50}/>
          <div className={styles.info}>
            <div className={styles.name}>{nickname}</div>
            <div>{format(new Date(article?.update_time),'yyyy-MM-dd hh:mm:ss')}</div>
            <div>阅读{article?.views}</div>
            {
              Number(loginUserInfo?.userId) === Number(id) && (
                <Link href={`/editor/${article?.id}`}>编辑组件</Link>
              )
            }
          </div>
        </div>
        <MarkDown className={styles.markdown}>{article?.content}</MarkDown>
      </div> 
      <div className={styles.divider}></div> 
      <div className='content-layout'>
        <div className={styles.comment}>
          <h3>评论</h3>
          {
            loginUserInfo?.userId && (
              <div className={styles.enter}>
                <Avatar src={avatar} size={40}/>
                <div className={styles.content}>
                  <Input.TextArea placeholder='请输入评论' rows={4} value={inputVal} onChange={(event) => setInputVal(event?.target?.value)} />
                  <Button type='primary' onClick={handleComment}>发表评论</Button>
                </div>
              </div>
            )
          }
          <Divider/>
          <div className={styles.display}>
            {
              comments?.map((comment: any) => (
                <div className={styles.wrapper} key={comment?.id}>
                  <Avatar src={comment?.user?.avatar} size={40}/>
                  <div className={styles.info}>
                    <div className={styles.name}>
                      <div>{comment?.user?.nickname}</div>
                      <div className={styles.date}>
                        {format(new Date(comment?.update_time),'yyyy-MM-dd hh:mm:ss')}
                      </div>
                    </div>
                    <div className={styles.content}>{comment?.content}</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div> 
    </div>
    )
  }

  export default observer(ArticleDetail);