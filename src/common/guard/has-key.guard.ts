import { ImATeapotException, Injectable } from '@nestjs/common';
import { isDev } from '../utility';

@Injectable()
export class HasKeyGuard {
  canActivate() {
    if (global.licenseAvailable || isDev()) {
      return true;
    }
    throw new ImATeapotException();
  }
}
