import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('RegistroEstudiantes.Web');
  currentYear = new Date().getFullYear();
  angularVersion = '21';

  constructor(private router: Router) {}

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
