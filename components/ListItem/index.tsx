import Link from 'next/link'
import {IArticle} from 'pages/api/index'
import styles from './index.module.scss'
import {EyeOutlined} from '@ant-design/icons'
import {Avatar} from 'antd'
import {formatDistanceToNow} from 'date-fns'
import {markdownToTxt} from 'markdown-to-txt'
interface IProps {
    article: IArticle;
}


const ListItem = (props: IProps) =>{

    const {article} = props;
    const {object} = article;
    return (
        <Link href={`/article/${article.id}`}>
            <div className={styles.container}>
                <div className={styles.article}>
                    <div className={styles.userInfo}>
                        <span className={styles.name}>{object?.nickname}</span>
                        <span className={styles.date}>{formatDistanceToNow(new Date(article?.update_time))}</span>
                    </div>
                    <h4 className={styles.title}>{article?.title}</h4>
                    <p className={styles.content}>{markdownToTxt(article?.content)}</p>
                    <div className={styles.statistics}>
                        <EyeOutlined/>
                        <span className={styles.item}>{article?.views}</span>
                    </div>
                </div>
                <Avatar src={object.avatar} size={48}/>
            </div>
        </Link>
    )
}

export default ListItem;