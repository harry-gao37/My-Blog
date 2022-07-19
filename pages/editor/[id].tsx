import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { ChangeEvent, useState,useEffect } from "react";
import {Input,Button, message,Select} from 'antd'
import styles from './index.module.scss';
import request from 'service/fetch'
import {observer} from 'mobx-react-lite'
// import {useStore} from 'store/index'
import { useRouter } from "next/router"
import {AppDataSource} from 'db/index'
import {Article} from 'db/entity';
import { IArticle } from 'pages/api';



interface IProps {
  article: IArticle
}

export async function getServerSideProps({params}: any) {

    const articleId = params.id;
    const db = await AppDataSource.initialize();
    const articleRepo =  db.getRepository(Article)
    
    const article = await articleRepo.findOne({
      relations: ['object'],
      where: {
        id: articleId
      }
    });
  
    return {
      props: {
        article: JSON.parse(JSON.stringify(article)) ,
      }
    }
  }

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);


const ModifyEditor = ({ article }: IProps) =>{
  
  // const store = useStore();
  // const {userId} = store.user.userInfo;
  // const {tags} = article;
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '')
  const {push,query} = useRouter();
  const articleId = Number(query?.id);
  const [allTags, setAllTags] = useState([])//Tags
  const [TagIds, setTagIds] = useState([])

  useEffect(()=>{
    request.get('api/tag/get').then((res: any)=>{
      if (res?.code === '000000' ){
        setAllTags(res?.data?.allTags || [])
      }
    })
  },[])

  const handlePublish = () =>{
    if(!title){
      message.warning('请输入文章标题');
      return;
    }else{
      request.post('/api/article/update',
      {
        id: articleId,
        title,
        content,
        TagIds
      }).then((res: any) => {
        if (res?.code === '000000'){ 
          articleId ? push(`/article/${articleId}`) : push('/');
          message.success('更新成功');
        }else{
          message.error(res?.msg || '更新失败');
        }
      })
      
    }

  }
  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) =>{
    setTitle(event?.target?.value);
  }
  const handleContentChange = (content: any) =>{
    setContent(content);
  }

  const handleSelectTag =(value: [])=>{
    setTagIds(value)
  }

  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input className={styles.title} placeholder="请输入文章标题" value={title} onChange={handleTitleChange}/>
        <Select className={styles.tag} mode="multiple" allowClear placeholder="请选择标签" onChange={handleSelectTag}>
          {
          allTags?.map((tag: any) => 
            <Select.Option key={tag?.id} value={tag?.id}>{tag?.title}</Select.Option>
          )
        }</Select> 
        <Button className={styles.button} type='primary' onClick={handlePublish}>发布</Button>
      </div>
      <MDEditor value={content} height={1080} onChange={handleContentChange} />
    </div>
  );
};


(ModifyEditor as any).layout = null;

export default observer(ModifyEditor);