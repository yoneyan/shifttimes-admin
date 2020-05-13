import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {CommonService} from './common.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private commonService: CommonService,
    private router: Router
  ) {
  }

  registerUser(email: string, pass: string) {
    this.afAuth.createUserWithEmailAndPassword(email, pass)
      .then(() => {
        this.afAuth.currentUser.then(d => {
          d.sendEmailVerification().then(() => {
            this.commonService.pushUserRegister({result: true, uid: d.uid});
            this.commonService.openBar('一時的にログアウトします。再ログインしてください。', 2000);
            this.afAuth.signOut().then(() => this.router.navigate(['/']).then());
          })
            .catch(err => this.commonService.openBar('登録エラー:' + err, 20000));
        })
          .catch((err) => this.commonService.openBar('登録エラー:' + err, 20000));
      });
  }

  createUser({d, uid}: {
    d: { name: string; isActive: boolean; isTeacher: boolean; isOffice: boolean; isAdmin: boolean; id: string }, uid: string,
  }): void {
    this.afs.collection('users').doc(uid).set(d)
      .then(() => this.commonService.openBar('登録完了しました。メールに本人確認用のリンクを踏んでアクセスしてください。', 2000))
      .catch((err) => this.commonService.openBar('登録エラー:' + err, 20000));
  }

  // registerUser(): void {
  // this.createUserDatabase(account.uid, new User(account.userid, account.name, account.isAdmin, true, false, false))
  //   .then(() => {
  //     alert('User register success!!');
  //     return this.createShiftDatabase(account.userid);
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     alert('Failed register account!!!' + err);
  //   });
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

  nextID(): Promise<any> {
    return this.getAllUser().then(d => {
      const teacherID: string[] = new Array();
      const adminID: string[] = new Array();
      const officeID: string[] = new Array();

      for (let i = 0; i < d.size; i++) {
        const position = d.docs[i].data().id.slice(0, 1);
        if (position === 'a') {
          adminID.push(d.docs[i].data().id);
        } else if (position === 't') {
          teacherID.push(d.docs[i].data().id);
        } else if (position === 'o') {
          officeID.push(d.docs[i].data().id);
        }
      }

      let maxAdminID = 0;
      let maxTeacherID = 0;
      let maxOfficeID = 0;

      // Admin
      for (const a of adminID) {
        if (parseInt(a.slice(-3), 10) > maxAdminID) {
          maxAdminID = (parseInt(a.slice(-3), 10));
        }
      }
      // Teacher
      for (const t of teacherID) {
        if (parseInt(t.slice(-5), 10) > maxTeacherID) {
          maxTeacherID = (parseInt(t.slice(-5), 10));
        }
      }
      // Office
      for (const o of officeID) {
        if (parseInt(o.slice(-3), 10) > maxOfficeID) {
          maxOfficeID = (parseInt(o.slice(-3), 10));
        }
      }

      maxAdminID++;
      maxTeacherID++;
      maxOfficeID++;

      console.log({
        admin: 'a' + ('000' + maxAdminID).slice(-3),
        teacher: 't' + ('00000' + maxTeacherID).slice(-5),
        office: 'o' + ('000' + maxOfficeID).slice(-3),
      });

      return {
        admin: 'a' + ('000' + maxAdminID).slice(-3),
        teacher: 't' + ('00000' + maxTeacherID).slice(-5),
        office: 'o' + ('000' + maxOfficeID).slice(-3),
      };
    });
  }
}
