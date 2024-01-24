import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ImageModalPage implements OnInit {
  imageUrl: string;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams
  ) {}

  ngOnInit() {
    this.imageUrl = this.navParams.get('imageUrl');

    const ionModal = document.querySelector('ion-modal');
    ionModal.addEventListener('click', () => {
      this.closeModal();
    });
  }

  backdropClick() {
    this.closeModal();
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
