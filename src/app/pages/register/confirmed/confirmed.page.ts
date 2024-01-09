import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { ActionSheetController, AlertController, NavController, Platform } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-confirmed',
  templateUrl: './confirmed.page.html',
  styleUrls: ['./confirmed.page.scss'],
})
export class ConfirmedPage implements OnInit {
  receivedData: any;

  constructor(
    private dataService: DataService,
    private platform: Platform,
    private storageService: StorageService,
    private actionSheetCtrl: ActionSheetController,
    public alertController: AlertController,
    public navCtrl: NavController,
  ) {
    this.receivedData = this.dataService.getData();
    console.log(this.receivedData);
  }

  exitApp(): void {
    this.navCtrl.navigateRoot('/initial');
    this.storageService.clear();
  }

  ngOnInit() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.redirect();
    });

  }

  redirect() {
    this.navCtrl.navigateForward('/initial');
  }
}
