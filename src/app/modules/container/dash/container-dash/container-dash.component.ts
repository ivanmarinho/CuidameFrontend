import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-container-dash',
  templateUrl: './container-dash.component.html',
  styleUrls: ['./container-dash.component.scss'],
})
export class ContainerDashComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  urls = [
    '/private/pets/all',
    '/private/vaccine/show',
    '/private/treatment/show',
    '/private/veterinarian/show',
    '/private/history/show',
    '/private/pets/show',
    '/private/pets/code',
    '/private/pages/manage',
    '/private/pages/care',
    '/private/pages/veterinarians',
    '/private/pages/service',

  ];



  noFlags = [
    '/private/veterinarian/edit',
    '/private/disease/edit',
    '/private/treatment/edit',
    '/private/vaccine/edit',
    '/private/pets/editpet',
    '/private/pets/all',
    '/private/pets/code',
    '/private/pages/manage',
    '/private/pages/care',
    '/private/pages/veterinarians',
    '/private/pages/service',
    '/private/pages/map',
    
  ];

  editurls = [
    '/private/veterinarian/edit',
    '/private/disease/edit',
    '/private/treatment/edit',
    '/private/vaccine/edit',
    '/private/pets/editpet',
  ];

  isUrlInArray(urls: string[]): boolean {
    return urls.includes(this.router.url);
  }

  background(urlsv2: string[]): boolean {
    return urlsv2.includes(this.router.url);
  }

  shouldShowFlag(): boolean {
    const url = this.router.url;

    for (const u of this.noFlags) {
      if (url.includes(u)) {
        return false;
      }
    }
    return true;
  }

  shouldShowGreeting(): boolean {
    const url = this.router.url;

    for (const u of this.editurls) {
      if (url.includes(u)) {
        return true;
      }
    }
    return false;
  }
}
