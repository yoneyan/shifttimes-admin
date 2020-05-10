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

  createUser({d, uid}: {
    d: { name: string; isActive: boolean; isTeacher: boolean; isOffice: boolean; isAdmin: boolean; id: string }, uid: string,
  }): void {
    this.afs.collection('users').doc(uid).set(d)
      .then(() => this.commonService.openBar('登録完了しました。メールに本人確認用のリンクを踏んでアクセスしてください。', 2000))
      .catch((err) => this.commonService.openBar('登録エラー:' + err, 20000));
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
