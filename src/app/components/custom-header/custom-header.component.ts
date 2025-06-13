import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-custom-header',
  templateUrl: './custom-header.component.html',
  styleUrls: ['./custom-header.component.scss'],
  standalone: false,
})
export class CustomHeaderComponent implements OnInit {
  isLoggedIn = false;
   @Output() menuToggle = new EventEmitter<void>();

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private auth: AngularFireAuth)
  {}

  ngOnInit() {
    this.auth.onAuthStateChanged(user => {
      this.isLoggedIn = !!user;
    });
  }


  onToggleSidebar() {
    this.menuToggle.emit();
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  goToAccount() {
    this.router.navigateByUrl('/account');
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  goToSignup() {
    this.router.navigateByUrl('/signup');
  }
}
