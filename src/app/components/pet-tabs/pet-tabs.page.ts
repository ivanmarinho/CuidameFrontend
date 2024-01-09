import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pet-tabs',
  templateUrl: './pet-tabs.page.html',
  styleUrls: ['./pet-tabs.page.scss'],
})
export class PetTabsPage implements OnInit {
  @Input() tabsArray: string[] = [];

  constructor() { }

  ngOnInit() {
  }

}
