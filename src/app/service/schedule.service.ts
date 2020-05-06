import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {CommonService} from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(
    private afs: AngularFirestore,
    private commonService: CommonService,
  ) {
  }

  scheduleRegister(scheduleData) {
    const doc = {};
    for (let i = 1; i <= scheduleData.data.length; i++) {
      doc[`${i}`] = scheduleData.data[i - 1];
    }
    doc[`info`] = scheduleData.information;

    this.afs.collection('base').doc('calendar')
      .collection(`${scheduleData.year}`).doc(`${scheduleData.month}`).set(doc, {merge: true})
      .then(() => this.commonService.openBar('適用に成功しました。', 2000))
      .catch(error => this.commonService.openBar('適用出来ませんでした。 Error: ' + error, 2000));
  }
}
