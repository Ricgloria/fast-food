import {UserPermission} from '../enum/user-permission.enum';

export interface User {
  id_user?: number;
  name: string;
  permission: UserPermission;
  cpf: string;
  phone: string;
  password?: string;
  address: string;
  status: number | boolean;
}

export interface Auth {
  user: User;
  token: string;
}
