import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {CommonService} from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {


  constructor(
    private afs: AngularFirestore,
    private commonService: CommonService,
  ) {
  }

  planToString(data: number): string {
    if (data === 2) {
      // ○
      return '◯';
    } else if (data === 1) {
      // △
      return '△';
    } else if (data === 0) {
      // X
      return 'X';
    }
  }

  planToNumber(data: string): number {
    if (data === '◯') {
      // ○
      return 2;
    } else if (data === '△') {
      // △
      return 1;
    } else if (data === 'X') {
      // X
      return 0;
    }
  }

  searchTimetables(): Promise<any> {
    const data = this.afs.collection('base').doc('classtimes');
    return data.ref.get()
      .then((doc) => {
        if (doc.exists) {
          console.log('time data: ', doc.data());
          return doc.data();
        } else {
          console.error('No matching invoice found');
        }
      });
  }

  getCalendar(dateData): Promise<any> {
    const data = this.afs.collection('base').doc('calendar')
      .collection(`${dateData.year}`).doc(`${dateData.month}`);
    return data.ref.get()
      .then((doc) => {
        if (doc.exists) {
          console.log('calendar: ', doc.data());
          return doc.data();
        } else {
          this.commonService.openBar('データがありません。', 2000);
          return 0;
        }
      })
      .catch(error => this.commonService.openBar('Error: ' + error, 2000));
  }

  getShift(date): Promise<any> {
    const data = this.afs.collection('shiftdata').doc(date.id)
      .collection(`${date.year}`).doc(`${date.month}`);
    return data.ref.get()
      .then((doc) => {
        if (doc.exists) {
          console.log('day data: ', doc.data());
          return doc.data();
        } else {
          this.commonService.openBar('データがありません。', 2000);
          return 0;
        }
      });
  }

  getShiftBaseData(data): Promise<any> {
    const base = this.afs.collection('result').doc(data.id)
      .collection('shift').doc('latest')
      .collection(`${data.year}`).doc(`${data.month}`);
    return base.ref.get()
      .then((doc) => {
        if (doc.exists) {
          console.log('base data: ', doc.data());
          return doc.data();
        } else {
          this.commonService.openBar('データがありません。', 2000);
          return 0;
        }
      });
  }

  applyShift(base, teacher, office): Promise<any> {
    console.log(base);
    const doc = {};
    const docBase = {};
    for (const t of teacher) {
      doc[t.date] = t.data;
    }
    for (const o of office) {
      doc[o.date] = o.data;
    }

    doc[`time`] = new Date().getTime();

    docBase[`locked`] = 'false';

    console.log(doc);
    return this.afs.collection('result').doc(base.id)
      .collection('shift').doc('latest')
      .collection(`${base.year}`).doc(`${base.month}`).set(doc, {merge: true})
      .then(() => {
          this.afs.collection('shiftdata').doc(base.id)
            .collection(`${base.year}`).doc(`${base.month}`).set(docBase, {merge: true})
            .then(() => {
              return 0;
            })
            .catch((error) => {
              return error;
            });
        }
      )
      .catch((error) => {
        return error;
      });
  }
}

interface DateData {
  id: number;
  year: number;
  month: number;
  day: number;
}

interface Timetable {
  times: string;
  select: number;
}

interface ShiftData {
  base: DateData;
  name: string;
  status: number;
}

