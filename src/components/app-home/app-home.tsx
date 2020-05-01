import { Component, Listen, State, h, Prop } from '@stencil/core';
import { SearchbarChangeEventDetail, RouterEventDetail } from '@ionic/core';
import { paramsEncode, paramsDecode, ParamsObject } from '../../helpers/utils';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css'
})
export class AppHome {
  @Prop({ connect: 'ion-router' }) router: HTMLIonRouterElement;
  @State() searchParams: ParamsObject = paramsDecode(window.location.search);

  @Listen('ionRouteWillChange', {target: "body"})
  async ionRouteWillChange(_e: CustomEvent<RouterEventDetail>) {
    this.searchParams = paramsDecode(window.location.search);
  }

  async handleSearchChange(e: CustomEvent<SearchbarChangeEventDetail>) {
    this.searchParams = {
      ...this.searchParams,
      search: e.detail.value
    };
    const search = paramsEncode(this.searchParams);
    const router: HTMLIonRouterElement = await (this.router as any).componentOnReady();
    router.push(`${window.location.pathname}${search}`, "root");
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Home</ion-title>
        </ion-toolbar>
        <ion-toolbar color="primary">
          <ion-searchbar value={this.searchParams.search} onIonChange={(e) => this.handleSearchChange(e)}/>
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
      </ion-content>
    ];
  }
}
