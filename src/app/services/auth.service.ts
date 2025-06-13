import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, Observable, of, switchMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  logout() {
    return this.afAuth.signOut();
  }

  getCurrentUser() {
    return this.afAuth.authState;
  }

  getIdToken(): Observable<string | null> {
    return this.afAuth.authState.pipe(
      take(1), 
      switchMap(user => {
        if (user) {
          return from(user.getIdToken());
        } else {
          return of(null);
        }
      })
    );
  }
}
