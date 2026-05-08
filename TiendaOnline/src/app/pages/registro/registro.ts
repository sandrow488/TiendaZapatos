import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Registro {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  readonly errorMessage = signal('');
  readonly isLoading = signal(false);

  onSubmit(): void {
    if (this.isLoading()) return;

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Las contraseñas no coinciden.');
      return;
    }

    this.errorMessage.set('');
    this.isLoading.set(true);

    this.authService.register(this.fullName, this.email, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err: { error?: { message?: string } }) => {
        this.errorMessage.set(err.error?.message ?? 'Error al crear la cuenta.');
        this.isLoading.set(false);
      },
    });
  }
}
