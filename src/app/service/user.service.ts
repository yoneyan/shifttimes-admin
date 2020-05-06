import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
  ) {
  }

  createUser(): void {
    // let auth;
    // this.afAuth.auth.createUserWithEmailAndPassword(account.email, account.pass)
    //   .then(result => {
    //     auth = result;
    //     auth.user.sendEmailVerification();
    //     this.createUserDatabase(auth.user.uid, new User(account.userid, account.name, account.isAdmin, true, false, true));
    //     alert('User Create success!!');
    //     // return this.createShiftDatabase(account.userid);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     alert('Failed register account!!!' + err);
    //   });
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

  // private createUserDatabase(uid: string, user: User): Promise<any> {
  //   console.log(user.deserialize());
  //   return this.afs.collection('users').doc(uid).set(user.deserialize())
  //     .then(() => {
  //       return true;
  //     })
  //     .catch(() => {
  //         return false;
  //       }
  //     );
  // }

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
