import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

import router from './router'


/* PrimVue */
import 'primeicons/primeicons.css';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Button from "primevue/button"
import InputText from 'primevue/inputtext'
import Card from 'primevue/card';
import ScrollPanel from 'primevue/scrollpanel';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';



const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            // Set darkModeSelector to false or 'none' to disable dark mode
            darkModeSelector: false,
            // Or: darkModeSelector: 'none',
        }
    }
});
app.component('Button', Button);
app.component('IconField', IconField)
app.component('InputIcon', InputIcon)
app.component('InputText', InputText)
app.component('Card', Card)
app.component('ScrollPanel', ScrollPanel)
app.component('Dialog', Dialog)
app.component('Textarea', Textarea)

// Set CSS variable for background image using env var
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
if (supabaseUrl) {
    const imagePath = "/storage/v1/object/public/web-ordering/images/mamonaku_fullbg.jpgs"
    const cssValue = `url('${supabaseUrl}${imagePath}')`
    document.documentElement.style.setProperty('--app-background-image', cssValue)
}

app.mount('#app')
