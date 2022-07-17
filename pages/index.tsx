import {AppDataSource} from 'db/index'
import {Article} from 'db/entity';
import ListItem from 'components/ListItem'
import {IArticle} from 'pages/api/index'

import {Divider} from 'antd';
// interface IArticle {

// }

interface IProps{
  articles: IArticle[]
}

export async function getServerSideProps() {

  const db = await AppDataSource.initialize();
  const articleRepo =  db.getRepository(Article)
  
  
  
  const articles = await articleRepo.find({
    relations: ['object'],
  });


  console.log(articles);

  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || [],
    }
  }
}

const Home = (props: IProps) =>{
  const {articles} = props;
  
  console.log(articles);

  return (
    <div className='content-layout'>
      <div>{articles?.map(article => (
        <>
        <ListItem article ={article}/>
        <Divider/>
        </>
      ))}</div>
    </div>
  )
}



export default Home;