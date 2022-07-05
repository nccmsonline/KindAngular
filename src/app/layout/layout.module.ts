import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MiniSidebarDirective } from '../directives/mini-sidebar.directive';
import { ScrollSpyDirective } from '../directives/scroll-spy.directive';
import { MobileMiniSidebarDirective } from '../directives/mobile-mini-sidebar.directive';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    PanelMenuModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [FooterComponent, HeaderComponent, SidebarComponent, MiniSidebarDirective, ScrollSpyDirective, MobileMiniSidebarDirective],
  exports: [FooterComponent, HeaderComponent, SidebarComponent, MiniSidebarDirective, MobileMiniSidebarDirective]
})
export class LayoutModule { }
export function HttpLoaderFactory(http: HttpClient) {
 // return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}
