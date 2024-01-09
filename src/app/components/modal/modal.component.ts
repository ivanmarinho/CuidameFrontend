import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  title: string;
  buttons: any[];


  constructor(private modalController: ModalController, private navParams: NavParams) {
    this.title = this.navParams.get('title');
    this.buttons = this.navParams.get('buttons');
    console.log(this.buttons);
  }

  onButtonClicked(button: any) {
    button.handler();
    this.modalController.dismiss();
  }

  ngOnInit() {}

}
