import userStore, {IUserStore} from './userStore';

//初始值收纳

export interface IStore {
    user: IUserStore;
  }
  
  export default function createStore(initialValue: any): () => IStore {
    return () => {
      return {
        user: { ...userStore(), ...initialValue?.user },
      };
    };
  }