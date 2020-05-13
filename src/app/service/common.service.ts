import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private snackBar: MatSnackBar,
  ) {
  }

  private register = {result: false, uid: ''};

  public openBar(message: string, time: number) {
    this.snackBar.open(message, 'done', {
      duration: time,
    });
  }

  public pushUserRegister(data: any) {
    this.register = data;
  }

  public getUserRegister(): any {
    return this.register;
  }
}
