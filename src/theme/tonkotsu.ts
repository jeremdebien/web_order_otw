import type { Theme } from "@/theme";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export const tonkotsuTheme: Theme = {
    brand: 'Tonkotsu Kazan',
    slogan: `Experience ramen that's as hot as lava.`,
    colors: {
        primary: '#BA0303FF',
        secondary: '#2ecc71',
        tertiary: 'black',
        accent: 'black',
        background: '#f4f4f4',
        text: 'white',
        secondaryText: 'black',
    },
    fonts: {
        heading: 'Musashi, sans-serif',
        olympic: 'Olympic, sans-serif',
        base: 'Weight, sans-serif',
        strategy: 'Strategy, sans-serif',
        lemonmilk: 'LEMONMILK, sans-serif',
        mottarue: 'Mottarue, sans-serif',
    },
    borderRadius: '8px',
    logo: '/images/tonkotsu/kazan_logo.png',
    logo_track: '/images/tonkotsu/kazan_logo.png',
    track_bg: `/images/nyc/logoTrack.png`,
    bg_image: `/images/tonkotsu/bg_content.jpg`,
    page_bg: `${supabaseUrl}/storage/v1/object/public/web-ordering/images/tonkotsu_bg.jpg`,
    width: '400px',
}

export default tonkotsuTheme;