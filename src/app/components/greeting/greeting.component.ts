import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-greeting',
  templateUrl: './greeting.component.html',
  styleUrls: ['./greeting.component.scss'],
})
export class GreetingComponent implements OnInit {
  constructor(private storageService: StorageService,) {}

  greetingMessage: string = '';
  name: string;
  greeting: boolean = false;
  public user: User;
  id: number = 0;
  public petId: string = '';
  public agreement: string = '';

  getGreeting() {
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 12) {
      return (this.greetingMessage = 'Buenos días');
    } else if (currentHour >= 12 && currentHour < 18) {
      return (this.greetingMessage = 'Buenas tardes');
    } else {
      return (this.greetingMessage = 'Buenas noches');
    }
  }

  async ngOnInit() {
    await this.storageService.init();
    await this.getUser();
    await this.getPetAgreement()
    this.getGreeting();
  }

  async getPetAgreement() {
    this.agreement = this.storageService.getPetAgreement()
    // console.log(this.petId)
  }

 

  private async getUser() {
    try {
      await this.storageService.loadUser().then((userp) => {
        if (userp) {
          this.user = userp;
          const { name } = this.user;
          this.name = name;
          this.greeting = true;
          // this.dataService.user = userp;
          // console.log('User coming from storage', this.user);
          this.id = Number(this.user.id);
          // console.log('User coming from data service',this.dataService.user);
        }
      });
    } catch (error) {
      this.greeting = false;
      console.log('Error obteniento user storage', error);
    }
  }
}
