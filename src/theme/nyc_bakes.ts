import type { Theme } from "@/theme";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

 export const nycBakesTheme: Theme = {
    brand: 'NYC Bakes',
    slogan: 'The Best Bakes in NYC',
    colors: {
      primary: 'black',
      secondary: '#2ecc71',
      tertiary: 'black',
      accent: 'black',
      background: '#f4f4f4',
      text: 'white',
      secondaryText: 'black',
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
    logo: '/images/nyc/logo.webp',
    logo_track: '/images/nyc/logo.webp',
    track_bg: `/images/nyc/logoTrack.png`,
    bg_image: `/images/nyc/promotion.jpg`,
    page_bg: `${supabaseUrl}/storage/v1/object/public/web-ordering/images/otw_bg.jpg`,
    width: '400px',
  }

  export default nycBakesTheme;