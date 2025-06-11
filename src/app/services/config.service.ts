import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: any = null;

  constructor(private firestore: AngularFirestore) {}

  async loadConfigOnce(): Promise<void> {
    if (this.config) return; // already loaded

    const docRef = this.firestore.collection('app_config').doc('stage');
    const snapshot = await firstValueFrom(docRef.get());

    if (snapshot.exists) {
      this.config = snapshot.data();
    } else {
      console.error('Config document not found!');
    }
  }

  get(key: string): any {
    return this.config ? this.config[key] : null;
  }

  getAll(): any {
    return this.config;
  }
}
