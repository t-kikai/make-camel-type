export interface Output {
  name: string;
  age: number;
  email: string;
  address: {
    city: string;
    zipcode: string;
  };
  hobbies: string[];
  friends: Array<{
    name: string;
    age: number;
    email: string;
  }>;
}
