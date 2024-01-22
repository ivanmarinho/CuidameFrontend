import { DataService } from 'src/app/services/data.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-header-greeting',
  templateUrl: './header-greeting.component.html',
  styleUrls: ['./header-greeting.component.scss'],
})
export class HeaderGreetingComponent implements OnInit {
  constructor(
    private storageService: StorageService,
    private router: Router,
    public dataService: DataService
  ) {
    this.dataReceived = this.dataService.getDataHeader();
  }

  public greetingMessage: string = '';
  public name: string;
  public user: User;
  public id: number = 0;
  public greeting: boolean = false;

  public category = '';
  public icon = '';

  public dataReceived: string = '';

  setCategoryAndIcon() {
    // console.log(this.dataReceived)
    if (this.dataReceived.includes('vaccine')) {
      this.category = 'Vacunas';
      this.icon = 'ico_blue_vaccine.svg';
    } else if (this.dataReceived.includes('data')) {
      this.category = 'Datos';
      this.icon = 'ico_blue_footprint.svg';
    } else if (this.dataReceived.includes('history')) {
      this.category = 'Historial';
      this.icon = 'ico_blue_history.svg';
    } else if (this.dataReceived.includes('veterinarian')) {
      this.category = 'Veterinario';
      this.icon = 'ico_blue_veterinarian.svg';
    } else {
      this.category = '';
      this.icon = '';
    }
  }

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

  getName() {
    this.storageService
      .loadUser()
      .then((user) => {
        if (user) {
          const { name } = user;
          this.name = name;
          this.greeting = true;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  private async getUser() {
    await this.storageService
      .loadUser()
      .then((userp) => {
        if (userp) {
          this.user = userp;
          this.id = Number(this.user.id);
        }
      })
      .catch((e) => console.log('Error obteniento user storage', e));
  }

  async ngOnInit() {
    await this.storageService.init();
    await this.getUser();
    this.getName();
    this.getGreeting();
    this.setCategoryAndIcon();
  }
}
