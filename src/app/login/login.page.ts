
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
 selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (err) {
      alert('Login failed: ' + (err as any).message);
    }
  }

  async register() {
    try {
      await this.authService.register(this.email, this.password);
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (err) {
      alert('Registration failed: ' + (err as any).message);
    }
  }

  closePage() {
  this.router.navigate(['/home']); 
}
}
