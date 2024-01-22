import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-header-dash',
  templateUrl: './header-dash.component.html',
  styleUrls: ['./header-dash.component.scss'],
})
export class HeaderDashComponent implements AfterViewInit {
  public activeFlagIndex: number = -1;
  public activeFlag: number = -1;

  constructor(private router: Router, private dataService: DataService) {}

  ngAfterViewInit() {
    this.dataService.getActiveFlag().subscribe(flag => {
      this.activeFlag = flag;
      this.activeFlagIndex = flag;
    });
  }
  

  public categories: string[] = [
    'Datos',
    'Vacunas',
    'Historial',
    'Veterinario',
  ];

  public icons: string[] = [
    'ico_blue_footprint.svg',
    'ico_blue_vaccine.svg',
    'ico_blue_history.svg',
    'ico_blue_veterinarian.svg',
  ];

  public urls: string[] = [
    '/private/data/show',
    '/private/vaccine/show',
    '/private/history/show',
    '/private/veterinarian/show',
  ];

  public blue_urls: string[] = [
    '/private/data/show',
    '/private/vaccine/show',
    '/private/history/show',
    '/private/veterinarian/show',
    '/private/pages/veterinarians',
  ];

  toggleActiveFlag(index: number) {
    if (this.activeFlagIndex === index) {
      return;
    }

    if (this.activeFlagIndex !== -1) {
      this.activeFlagIndex = -1;
    }

    this.activeFlagIndex = index;
  }

  shouldShowFlag(index: number): boolean {
    const url = this.router.url;
    if (url.includes('data/addpet')) {
      return index === 0;
    }
    if (url.includes('vaccine/add')) {
      return index === 1;
    }
    if (url.includes('history/add')) {
      return index === 2;
    }

    if (url.includes('treatment/add')) {
      return index === 2;
    }

    if (url.includes('disease/add')) {
      return index === 2;
    }
    if (
      url.includes('veterinarian/add') ||
      url.includes('/private/pages/veterinarians')
    ) {
      return index === 3;
    }
    return true;
  }

  transparentUrls = [
    '/private/veterinarian/add',
    '/private/disease/add',
    '/private/treatment/add',
    '/private/vaccine/add',
    '/private/data/addpet',
  ];

  background(urls: string[]): boolean {
    return urls.includes(this.router.url);
  }
}
