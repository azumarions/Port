export interface File extends Blob {
    readonly lastModified: number;
    readonly name: string;
  }
  /*authSlice.ts*/
  export interface PROPS_AUTHEN {
    email: string;
    password: string;
  }
  
  export interface PROPS_PROFILE {
    id: number;
    name: string;
    statusMessage: string;
    description: string;
    img: File | null;
  }
  
  export interface PROPS_NAME {
    name: string;
  }
  