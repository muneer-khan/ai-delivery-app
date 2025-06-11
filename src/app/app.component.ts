import { Component } from '@angular/core';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private configService: ConfigService) {
    this.initApp();
  }

  async initApp() {
    await this.configService.loadConfigOnce();
    console.log('Config Loaded:', this.configService.getAll());
  }
  }
