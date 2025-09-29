import type { Theme } from "@/theme";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

 export const otwTheme: Theme = {
    brand: 'OTW',
    colors: {
      primary: '#45BF70',
      secondary: '#2ecc71',
      tertiary: 'black',
      accent: 'black',
      background: '#f4f4f4',
      text: 'white',
    },
    fonts: {
      heading: 'Weight, sans-serif',
      olympic: 'Olympic, sans-serif',
      base: 'Weight, sans-serif',
      strategy: 'Strategy, sans-serif',
      lemonmilk: 'LEMONMILK, sans-serif',
      mottarue: 'Mottarue, sans-serif',
    },
    borderRadius: '8px',
    logo: '/images/otw/otw_logo.png',
    logo_track: '/images/otw/otw_logo1.png',
    track_bg: `/images/otw/track_bg.jpg`,
    bg_image: `/images/otw/welcome_bg.jpg`,
    page_bg: `${supabaseUrl}/storage/v1/object/public/web-ordering/images/otw_bg.jpg`,
  }

  export default otwTheme;