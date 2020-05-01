import { Component, Element, Prop, State, h } from '@stencil/core';
import { sayHello, openURL } from '../../helpers/utils';

@Component({
  tag: 'app-profile',
  styleUrl: 'app-profile.css'
})
export class AppProfile {
  @Element() el;
  @State() state = false;
  @Prop() name: string;

  formattedName(): string {
    if (this.name) {
      return this.name.substr(0, 1).toUpperCase() + this.name.substr(1).toLowerCase();
    }
    return '';
  }

  /* for debugging, see: https://github.com/ionic-team/ionic/blob/master/core/src/components/back-button/back-button.tsx#L97-L105 */
  async onClick(ev: Event, defaultHref?: string) {
    const nav: HTMLIonNavElement = this.el.closest('ion-nav');
    ev.preventDefault();

    debugger;
    if (nav && await nav.canGoBack()) {
      return nav.pop({ skipIfBusy: true })
    }
    return openURL(defaultHref, ev, 'back');
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-buttons slot="start">
            {/* <ion-back-button defaultHref="/" /> */}
            <ion-button onClick={(e) => this.onClick(e, "/")}>
              <ion-icon slot="icon-only" name="arrow-back-sharp" />
            </ion-button>
          </ion-buttons>
          <ion-title>Profile: {this.name}</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content class="ion-padding">
        <p>
          {sayHello()}! My name is {this.formattedName()}. My name was passed in through a
          route param!
        </p>

        <ion-item>
          <ion-label>Setting ({this.state.toString()})</ion-label>
          <ion-toggle
            checked={this.state}
            onIonChange={ev => (this.state = ev.detail.checked)}
          />
        </ion-item>

      </ion-content>
    ];
  }
}
