import Vue from 'vue';
import VueRouter from 'vue-router';

import HomePage from '../views/HomePage.vue';
import LoginPage from '../views/LoginPage.vue';

import store from '@/plugins/store.js';
import api from '@/api/api';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        redirect: { name: 'Rooms' }, // default view
        name: 'Home',
        component: HomePage,
        children: [
            {
                path: 'rooms',
                name: 'Rooms',
                component: () => import(/* webpackChunkName: "rooms" */"@/views/RoomsPage")
            },
            {
                path: 'routines',
                name: 'Routines',
                component: () => import(/* webpackChunkName: "routines" */"@/views/RoutinesPage")
            },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage
    },

    // rutas dinamicas para rooms y routines
    {
        path: '/rooms/:slug',
        name: 'RoomDetails',
        component: () => import(/* webpackChunkName: "room-details" */"@/views/RoomDetails"),
        props: true,
        beforeEnter: (to, from, next) => {

            // hay que llamar a la api y setear el store de nuevo porque cuando 
            // se refreshea la pagina (f5) se pierde el estado
            api.getRooms((rooms) => {
                store.commit("setRooms", rooms)
                const exists = store.getters.getRoomBySlug(api.slugify(to.params.slug));

                if (exists) next()
                else next({ name: 'NotFound' })
            })
        }
    },

    {
        path: '/devices/:slug',
        name: 'DeviceDetails',
        component: () => import(/* webpackChunkName: "device-details" */"@/views/DeviceDetails"),
        props: true,
        beforeEnter: (to, from, next) => {

            api.getDevices((devices) => {
                store.commit("setDevices", devices)
                const exists = store.getters.getDeviceBySlug(api.slugify(to.params.slug));
        
                if (exists) next()
                else next({ name: 'NotFound' })
            })
        }
    },

    // Default route (not found)
    {
        path: '/404',
        alias: '*',
        name: 'NotFound',
        component: () => import(/* webpackChunkName: "404" */"@/views/404NotFound"),
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

const isAuthenticated = true;

router.beforeEach((to, from, next) => {
    if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
    else next()
})

export default router