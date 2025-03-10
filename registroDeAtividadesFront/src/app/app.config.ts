import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
    provideAnimations(), // ✅ Adicionado para suportar animações (necessário pro Toastr)
    provideToastr({      // ✅ Configurações do Toastr
      positionClass: 'toast-bottom-center',  // Pode ajustar para 'toast-top-right' se preferir
      timeOut: 3000,
      progressBar: true,
      closeButton: true
    })
  ]
};
