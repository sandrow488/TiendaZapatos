import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  readonly errorMessage = signal('');
  readonly isLoading = signal(false);

  onSubmit(): void {
    if (this.isLoading()) return;
    this.errorMessage.set('');
    this.isLoading.set(true);

    this.authService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err: { error?: { message?: string } }) => {
        this.errorMessage.set(err.error?.message ?? 'Credenciales incorrectas.');
        this.isLoading.set(false);
      },
    });
  }
}
