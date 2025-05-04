export interface User {
     _id?: string;       // MongoDB uses _id
     firstName: string;
     lastName: string;
     email: string;
     password?: string;  // Optional since we might not always have it
     phoneNumber: string;
     gender: string;
     city: string;
     role: string;
     profileImage?: string;
     // Remove username if not used in your backend
   }