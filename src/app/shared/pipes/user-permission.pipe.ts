import {Pipe, PipeTransform} from '@angular/core';
import {UserPermission} from '../enum/user-permission.enum';

@Pipe({
  name: 'userPermissionPipe'
})
export class UserPermissionPipe implements PipeTransform {

  userPermission = UserPermission;

  transform(permission: string): string {
    switch (permission) {
      case this.userPermission.master:
        return 'Proprietário';
      case this.userPermission.admin:
        return 'Gerente';
      case this.userPermission.collaborator:
        return 'Funcionário';
      default:
        return '';
    }
  }
}
