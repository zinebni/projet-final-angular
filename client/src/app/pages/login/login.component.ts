import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="card login-card">
        <div class="login-header">
          <span class="logo-icon">🎫</span>
          <h1>Smart Queue</h1>
          <p>Connexion Agent / Admin</p>
        </div>
        
        <form (ngSubmit)="login()">
          <div class="form-group">
            <label for="username">
              <span class="material-icons">person</span>
              Nom d'utilisateur
            </label>
            <input 
              type="text" 
              id="username"
              [(ngModel)]="username"
              name="username"
              placeholder="Entrez votre nom d'utilisateur"
              required
              autocomplete="username">
          </div>
          
          <div class="form-group">
            <label for="password">
              <span class="material-icons">lock</span>
              Mot de passe
            </label>
            <input 
              type="password" 
              id="password"
              [(ngModel)]="password"
              name="password"
              placeholder="Entrez votre mot de passe"
              required
              autocomplete="current-password">
          </div>
          
          @if (error) {
            <div class="alert alert-error">
              <span class="material-icons">error</span>
              {{ error }}
            </div>
          }
          
          <button type="submit" class="btn btn-primary btn-lg full-width" [disabled]="loading">
            @if (loading) {
              <span class="material-icons spinning">sync</span>
              Connexion en cours...
            } @else {
              <span class="material-icons">login</span>
              Se connecter
            }
          </button>
        </form>
        
        <div class="login-footer">
          <p>Accès réservé au personnel autorisé</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 2.5rem;
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .logo-icon { font-size: 3rem; }
    
    .login-header h1 {
      color: #1a365d;
      margin: 0.5rem 0 0.25rem;
    }
    
    .login-header p { color: #718096; }
    
    .form-group label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .form-group label .material-icons {
      font-size: 1.25rem;
      color: #718096;
    }
    
    .full-width { width: 100%; }
    
    .alert-error {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #fed7d7;
      color: #c53030;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
    }
    
    .login-footer {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
      color: #a0aec0;
      font-size: 0.875rem;
    }
    
    .spinning { animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  error = '';
  private returnUrl = '/agent';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/agent';
    
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  login() {
    if (!this.username || !this.password) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.router.navigate([this.returnUrl]);
        } else {
          this.error = response.message || 'Erreur de connexion';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Erreur de connexion au serveur';
      }
    });
  }
}

