import type { Theme } from "@/theme";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export const mamonakuTheme: Theme = {
    brand: 'Mamonaku',
    slogan: 'Where every cup feels special',
    colors: {
      primary: '#3b6cfd',
      secondary: '#2ecc71',
      tertiary: '#fd3c85',
      accent: 'black',
      background: '#f4f4f4',
      text: 'white',
      secondaryText: 'black',
    },
    fonts: {
      heading: 'MUSASHI, sans-serif',
      olympic: 'Olympic, sans-serif',
      base: 'Weight, sans-serif',
      strategy: 'Strategy, sans-serif',
      lemonmilk: 'LEMONMILK, sans-serif',
      mottarue: 'Mottarue, sans-serif',
    },
    borderRadius: '8px',
    logo: '/images/mamonaku/mamonaku_logo.png',
    logo_track: '/images/mamonaku/MMNK_Logo.png',
    track_bg: `/images/mamonaku/bg.png`,
    bg_image: `/images/mamonaku/mamonaku_bg.jpg`,
    page_bg: `${supabaseUrl}/storage/v1/object/public/web-ordering/images/mamonaku_bg.jpg`,
    width: '0px',
  }
  export default mamonakuTheme;