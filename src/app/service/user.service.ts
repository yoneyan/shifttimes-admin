import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {merge} from 'rxjs';
import {CommonService} from './common.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private commonService: CommonService,
  ) {
  }

  createUser({d, email, pass}: {
    d: { name: string; active: boolean; teacher: boolean; office: boolean; admin: boolean; id: string }, email: string, pass: string
  }): void {
    let auth;
    this.afAuth.createUserWithEmailAndPassword(email, pass)
      .then(result => {
        auth = result;
        result.user.sendEmailVerification().then();
        this.afs.collection('users').doc(auth.uid).set(d, {merge: true})
          .then(() => {
            return true;
          })
          .catch(() => {
            return false;
          });
      })
      .catch(err => this.commonService.openBar('Failed register account!!!' + err, 2000));
  }

  registerUser(): void {
    // this.createUserDatabase(account.uid, new User(account.userid, account.name, account.isAdmin, true, false, false))
    //   .then(() => {
    //     alert('User register success!!');
    //     return this.createShiftDatabase(account.userid);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     alert('Failed register account!!!' + err);
    //   });
  }


  getUser(uid): Promise<any> {
    console.log('uid: ' + uid);
    const data = this.afs.collection('users').doc(uid);
    return data.ref.get()
      .then(doc => {
        console.log(doc);
        if (doc.exists) {
          console.log('User data: ', doc.data());
          if (doc.data().isActive) {
            return doc.data();
          } else {
            return 0;
          }
        } else {
          console.error('No matching invoice found');
          return 0;
        }
      })
      .catch();
  }

  getAllUser(): Promise<any> {
    const data = this.afs.collection('users');
    return data.ref.get()
      .then((d) => {
        return d;
      });
  }
}
