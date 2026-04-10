import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { Navbar } from './components/navbar/navbar';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { Cart } from './components/cart/cart';

export const routes: Routes = [

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
    }
    
];
