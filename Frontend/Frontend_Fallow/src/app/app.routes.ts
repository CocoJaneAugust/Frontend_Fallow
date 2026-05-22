import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { Navbar } from './components/navbar/navbar';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { Cart } from './components/cart/cart';
import { Register } from './components/register/register';
import { Checkout } from './components/checkout/checkout';

export const routes: Routes = [

    { path: '', 
      redirectTo: 'home', 
      pathMatch: 'full' 
    },

    {
        path:'login',
        component: Login
    }, 

    {
        path:'home',
        component: Home
    },

    {
        path:'navbar',
        component: Navbar
    },

    { path: 'producto/:id', 
      component: ProductDetailComponent 
    },
     
    { path: 'carrito', 
        component: Cart 
    },

    { path: 'register',
      component: Register
    },

    { path: 'checkout', 
      component: Checkout 
    },

    { path: '**', 
      redirectTo: 'home' 
    }

];
