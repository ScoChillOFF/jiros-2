import { provideEventPlugins } from '@taiga-ui/event-plugins';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'jiros-1813a',
        appId: '1:850862695754:web:d00a764cf5e48ac1434db3',
        storageBucket: 'jiros-1813a.firebasestorage.app',
        apiKey: 'AIzaSyBKmy3bnZtDNen1sSXW_Yc47Gmv2sq2Jnk',
        authDomain: 'jiros-1813a.firebaseapp.com',
        messagingSenderId: '850862695754',
        measurementId: 'G-S4R7TWCCY3',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideStorage(() => getStorage()),
    provideEventPlugins(),
  ],
};
