import userStore, {IUserStore} from './userStore';

//allow manage multiple components

export interface IStore {
    user: IUserStore;
  }
  
  export default function createStore(initialValue: any): () => IStore {
    return () => {
      return {
        user: { ...userStore(), ...initialValue?.user },
        //here can collect other component info
      };
    };
  }