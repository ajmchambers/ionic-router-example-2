import { Component, Listen, State, h } from '@stencil/core';
import { RouterEventDetail } from '@ionic/core';
import { paramsEncode, paramsDecode, ParamsObject } from '../../helpers/utils';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css'
})
export class AppHome {
  @State() searchParams: ParamsObject = paramsDecode(window.location.search);

  private searchbarEl: HTMLIonSearchbarElement;

  @Listen('ionRouteDidChange', {target: "body"})
  async ionRouteDidChange(_e: CustomEvent<RouterEventDetail>) {
    if (_e.detail.to !== "/") {
      return;
    }
    this.handleSearchChange();
  }

  async handleSearchChange(_e?) {
    this.searchParams = {
      ...this.searchParams,
      search: this.searchbarEl.value
    };
    const search = paramsEncode(this.searchParams);
    const oldUrl = `${window.location.pathname}${window.location.search}`;
    const newUrl = `${window.location.pathname}${search}`;
    if (oldUrl !== newUrl) {
      const router: HTMLIonRouterElement = document.querySelector('ion-router');
      router.push(newUrl, "root");
    }
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Home</ion-title>
        </ion-toolbar>
        <ion-toolbar color="primary">
          <ion-searchbar value={this.searchParams.search} ref={el => this.searchbarEl = el} onIonChange={(e) => this.handleSearchChange(e)}/>
        </ion-toolbar>
      </ion-header>,

      <ion-content class="ion-padding">
        <p>
          Welcome to the PWA Toolkit. You can use this starter to build entire
          apps with web components using Stencil and ionic/core! Check out the
          README for everything that comes in this starter out of the box and
          check out our docs on <a href="https://stenciljs.com">stenciljs.com</a> to get started.
        </p>

        <ion-button href="/profile/ionic" expand="block">Profile page</ion-button>
        <ion-button href="/redirect" expand="block">Test Redirect</ion-button>
      </ion-content>
    ];
  }
}
