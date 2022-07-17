import '../styles/globals.css'
import Layout from 'components/layout'
import {StoreProvider} from 'store/index'
import { NextPage } from 'next';


interface IProps{
  initialValue: Record<any,any>;
  Component: NextPage;
  pageProps: any;
}


function MyApp({initialValue, Component, pageProps }: IProps) {

  const renderLayout = () =>{
    if ((Component as any).layout === null){
      return  <Component {...pageProps} />

    }else {
      return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
      )
    }

  }

  return (
    <StoreProvider initialValue={initialValue}>
      {renderLayout()}
    </StoreProvider>

  )
}

MyApp.getInitialProps = async ({ctx} :{ctx : any}) =>{
  const {id,nickname, avatar} = ctx?.req?.cookie || {};

  return {
    initialValue: {
      user:{
        userInfo:{
          id,
          nickname,
          avatar
        }
      }
    }
  }
};

export default MyApp
