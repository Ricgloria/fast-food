import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userStatus'
})
export class UserStatusPipe implements PipeTransform {
  transform(status: number | boolean | undefined): string {
    return status ? 'Ativo' : 'Desativado';
  }
}
