// resources/js/types/global.d.ts

import { AxiosInstance } from 'axios';

interface RouteFunction {
    (name: string, params?: any, absolute?: boolean): string;
    current: (name?: string, params?: any) => boolean;
    // Jika Anda menggunakan `route().has('name')`, tambahkan juga:
    // has: (name: string) => boolean;
}

declare global {
    interface Window {
        axios: AxiosInstance;
        Ziggy: import('ziggy-js').Config & {
            routes: {
                [key: string]: {
                    uri: string,
                    methods: string[],
                    bindings?: { [key: string]: string },
                    parameters?: { [key: string]: string }
                }
            };
            // Tambahkan properti lain dari objek `Ziggy` global jika Anda menggunakannya:
            // csrfToken?: string;
            // baseUrl?: string;
        };
    }

    var route: RouteFunction;
}