export interface Staff {
  id?: number;
  name: string;
  email: string;
  mobile: string;
  degree: string;
  skills: string;
  languages: string;
  father_name: string;
  mother_name: string;
  country: string;
  state: string;
  city: string;
  address: string;
  pincode: string;
  image: string;
}

export interface Project {
  id?: number;
  name: string;
  description: string;
  head_id: number;
  head_name?: string;
  completion_date: string;
  status: string;
  members?: Staff[];
}

export interface User {
  id: number;
  username: string;
}
