import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    var diff_ms = Date.now() - new Date(value).getTime();
    var age_dt = new Date(diff_ms);
    const age = Math.abs(age_dt.getUTCFullYear() - 1970);
    return age;
  }

}
