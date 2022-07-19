import '../styles/globals.css'
import Layout from 'components/layout'
import {StoreProvider} from 'store/index'
import { NextPage } from 'next';
import ErrorBoundary from 'components/ErrorBoundary'


interface IProps{
  initialValue: Record<any,any>;
  Component: NextPage;
  pageProps: any;
}

// web metrics
export function reportWebVitals(metric: any){

  if (metric.label === 'web-vital'){
    console.log('metric', metric); 
  }

  switch(metric.name){
    case 'FCP':
      console.log('FCP', metric);
      break;
    case 'LCP':
      console.log('LCP', metric);
      break;
   case 'CLS':
      console.log('CLS', metric);
      break;
   case 'FID':
      console.log('FID', metric);
      break;
   case 'TTFB':
      console.log('TTFB', metric);
      break;
   default:
      break;      
  }

  const body = JSON.stringify(metric);
  const url = 'https://xxxx.com';

  //showing the score
  if (navigator.sendBeacon){
    navigator.sendBeacon(url,body);
  } else{
    fetch(url,{body,method: 'POST', keepalive: true})
  }
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
    <ErrorBoundary>
      <StoreProvider initialValue={initialValue}>
        {renderLayout()}
      </StoreProvider>
    </ErrorBoundary>
  )
}
// acquire remote front end data, set initila value
MyApp.getInitialProps = async ({ctx} :{ctx : any}) =>{
  const {id, nickname, avatar} = ctx?.req?.cookie || {};

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
