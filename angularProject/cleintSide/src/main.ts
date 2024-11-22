import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appConfig } from './app/app.config'; 
import { tokenInterceptorInterceptor } from './app/services/token-interceptor.interceptor';
import { provideHttpClient ,withInterceptors} from '@angular/common/http';


// const routes = [
//   { path: '', component: HomeComponentComponent },
//   { path: 'cafe/dashboard', component: DashboardComponent },
//   { path: '**', redirectTo: '' }
// ]
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([tokenInterceptorInterceptor]) // Add your interceptor here
    ),
    provideAnimations(), 
    ...appConfig.providers,  
  ]
})
  .catch((err) => console.error('Bootstrap failed', err));
