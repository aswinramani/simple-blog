import { Injectable } from '@nestjs/common';
import { ProfileNames } from './interfaces';

@Injectable()
export class UtilsService {
  capitalize(str: string): string {
    return !str ? '' : str.charAt(0).toUpperCase() + str.slice(1);
  }

  capitalizeProfileName(profile: ProfileNames): string {
    let name = '';
    if (profile["givenName"]) {
      name += this.capitalize(profile["givenName"])
    }
    if (profile["familyName"]) {
      name += ' ' + this.capitalize(profile["familyName"])
    }
    return name;
  }

  formatDate(date: Date): string {
    return date.toISOString();
  }

}
