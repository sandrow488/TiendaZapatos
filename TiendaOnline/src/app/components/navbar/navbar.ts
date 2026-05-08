import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  private readonly authService = inject(AuthService);

  readonly isLoggedIn = computed(() => !!this.authService.currentUser());
  readonly isAdmin = computed(() => this.authService.currentUser()?.role === 'admin');
  readonly userName = computed(() => this.authService.currentUser()?.full_name ?? 'Invitado');
  readonly cartCount = signal(3);

  logout(): void {
    this.authService.logout();
    this.cartCount.set(0);
  }
}
