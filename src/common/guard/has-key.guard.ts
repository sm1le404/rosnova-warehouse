import { ImATeapotException, Injectable } from '@nestjs/common';

@Injectable()
export class HasKeyGuard {
  canActivate() {
    if (global.licenseAvailable) {
      return true;
    }
    return true;
    throw new ImATeapotException();
  }
}
