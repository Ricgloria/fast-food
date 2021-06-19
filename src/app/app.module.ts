import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './core/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgxMaskModule} from 'ngx-mask';
import localePt from '@angular/common/locales/pt';
import {registerLocaleData} from '@angular/common';
import {NgxCurrencyModule} from 'ngx-currency';
import {customCurrencyMaskConfig} from './shared/helpers/currency';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TokenInterceptor} from './core/interceptor/token.interceptor';

registerLocaleData(localePt, 'pt');

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        HttpClientModule,
        ToastrModule.forRoot(),
        NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
        NgxMaskModule.forRoot(),
        FormsModule
    ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pt'
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
