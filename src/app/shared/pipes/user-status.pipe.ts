import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userStatus'
})
export class UserStatusPipe implements PipeTransform {
  transform(status: boolean): string {
    return status ? 'Ativo' : 'Desativado';
  }
}
