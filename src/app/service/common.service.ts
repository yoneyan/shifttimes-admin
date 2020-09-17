import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private snackBar: MatSnackBar,
    public afs: AngularFirestore,
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


  getBase(): Promise<any> {
    const data = {};
    const base = this.afs.collection('base');
    return base.ref.get()
      .then((doc) => {
        doc.forEach(d => {
          data[d.id] = d.data();
        });
        return data;
      })
      .catch(error => this.openBar('Error: ' + error, 2000));
  }
}
