import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.page.html',
  styleUrls: ['./contactus.page.scss'],
})
export class ContactusPage implements OnInit {
  constructor() {}

  ngOnInit() {}

  openWhatsapp = async () => {
    await Browser.open({ url: 'wa.link/k58fif' });
  };

  openEmail = async () => {
    await Browser.open({ url: 'mailto:cuidame@esmart-tek.com' });
  };
}
