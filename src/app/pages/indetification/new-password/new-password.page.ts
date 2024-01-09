import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { ToastMessage } from 'src/app/utils/toastMessage';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss'],
})
export class NewPasswordPage implements OnInit {
  newPassword: string = '';
  confirmPassword: string = '';
  passwordsMatch: boolean = true;

  public showPassword: boolean = false;
  public showPasswordConfirm: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    public navCtrl: NavController,
    public toastMessage: ToastMessage
  ) {}

  ngOnInit() {}

  public toggleTextPassword(isConfirm: boolean = false): void {
    if (isConfirm) {
      this.showPasswordConfirm = !this.showPasswordConfirm;
    } else {
      this.showPassword = !this.showPassword;
    }
  }

  public getType(isConfirm: boolean = false): string {
    return isConfirm
      ? this.showPasswordConfirm
        ? 'text'
        : 'password'
      : this.showPassword
      ? 'text'
      : 'password';
  }

  async resetPassword(newPassword: string) {
    const id = this.route.snapshot.paramMap.get('id');
    const resetToken = this.route.snapshot.paramMap.get('resetToken');
  
    if (newPassword.length < 8) {
      this.toastMessage.presentToast('La contraseña debe tener al menos 8 caracteres');
      return; // Salir de la función si la contraseña no cumple con el requisito mínimo
    }
  
    if (newPassword === '' || this.confirmPassword === '') {
      this.toastMessage.presentToast('¡Existen campos vacíos!');
      this.passwordsMatch = false;
      return; // Salir de la función si hay campos vacíos
    }
  
    if (newPassword === this.confirmPassword) {
      this.passwordsMatch = true;
      try {
        const resp = await this.userService.resetPassword(id, resetToken, newPassword).toPromise();
  
        if (resp.success) {
          this.toastMessage.presentToast(resp.message);
          setTimeout(() => {
            this.navCtrl.navigateForward('/initial'); // Usar router.navigate en lugar de navCtrl.navigateForward
          }, 5000);
        } else {
          this.toastMessage.presentToast(resp.message);
        }
      } catch (error) {
        console.error(error);
  
        if (error.status === 400) {
          this.toastMessage.presentToast('Token inválido para esta solicitud. El Token ha expirado');
        } else if (error.status === 404) {
          this.toastMessage.presentToast('Usuario no encontrado');
        } else {
          this.toastMessage.presentToast('Error al restablecer la contraseña');
        }
      }
    } else {
      this.toastMessage.presentToast('Las contraseñas no coinciden');
      this.passwordsMatch = false;
    }
  }
  
  
  
}
