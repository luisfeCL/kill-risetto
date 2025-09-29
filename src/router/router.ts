import { Router } from '@vaadin/router';

let router: Router;

export const initRouter = ( outlet: HTMLElement ) => {
    router = new Router(outlet);
    
    router.setRoutes([
    {
        path: '/',
        component: 'home-page',
        action: async () => {
            await import('../pages/home-page/home-page.ts');
        }
    },
    {
        path: '/game-page',
        component: 'game-page',
        action: async () => {
            await import('../pages/game-page/game-page.ts');
        }
    },
    {
        path: '(.*)',
        redirect:'/'
        },
    ]);
};