export interface User {
     profileImage: string;


     userId: number;
    
     username: string;
    
     password: string;
     email: string;
    
     role: 'ADMIN' | 'AGENT' | 'CUSTOMER'; 
   
    }