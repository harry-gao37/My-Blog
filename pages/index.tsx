import {AppDataSource} from 'db/index'
import {Article,Tag} from 'db/entity';
import {IArticle} from 'pages/api/index'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react';
import request from 'service/fetch';
import styles from './index.module.scss';
import {Divider} from 'antd';
import classnames from 'classnames'

//dynamic import: only imported when needed a seperate chunk
const DynamicComponent = dynamic(()=> import('components/ListItem'));


interface IProps{
  articles: IArticle[];
  tags: ITag[];
}

interface ITag {
  id: number;
  title: string;
}



//SSR packaging props
export async function getServerSideProps() {

  const db = await AppDataSource.initialize();
  const articleRepo =  db.getRepository(Article);
  const tagRepo = db.getRepository(Tag);

  const articles = await articleRepo.find({
    relations: ['object','tags'],
  });

  const tags = await tagRepo.find({
    relations: ['object'],
  })


  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || [],
      tags: JSON.parse(JSON.stringify(tags)) || [],

    }
  }
}

const Home = (props: IProps) =>{
  const {articles, tags} = props;
  const [selectTag,setSelectTag] = useState(0);
  const [showAricles, setShowAricles] = useState([...articles]);


  //when tag is clicked
  const handleSelectTag = (event: any) => {
    const { tagid } = event?.target?.dataset || {};
    setSelectTag(Number(tagid));
  };

  //when changing tag, articles will cahnge
  useEffect(() => {
    selectTag &&
      request.get(`/api/article/get?tag_id=${selectTag}`).then((res: any) => {
        if (res?.code === '000000') {
          setShowAricles(res?.data);
        }
      });
  }, [selectTag]);


  return (
    <div>
    <div className={styles.tags} onClick={handleSelectTag}>
      {tags?.map((tag) => (
        <div
          key={tag?.id}
          data-tagid={tag?.id}
          className={classnames(
            styles.tag,
            selectTag === tag?.id ? styles['active'] : ''
          )}
        >
          {tag?.title}
        </div>
      ))}   
    </div>
    <div className="content-layout">
      {showAricles?.map((article) => (
        <>
          {/* <ListItem article={article} /> */} 
          <DynamicComponent article={article} />
          <Divider />
        </>
      ))}
    </div>
  </div>

  )
}



export default Home;