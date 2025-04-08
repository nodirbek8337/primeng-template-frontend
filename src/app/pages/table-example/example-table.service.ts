import { Injectable } from '@angular/core';
import { DefaultService } from '../../shared/services/default.service';

@Injectable({
  providedIn: 'root'
})
export class ExampleTableService extends DefaultService {
  override formName = 'users';

  override getUrl(): string {
    return 'api/users';
  }
}
