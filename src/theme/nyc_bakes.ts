import type { Theme } from "@/theme";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export const nycBakesTheme: Theme = {
  brand: 'Potato Corner',
  slogan: 'The Best Potatoes in the World',
  colors: {
    primary: '#128f46',
    secondary: '#2ecc71',
    tertiary: 'black',
    accent: 'black',
    background: '#f4f4f4a3',
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
  logo: '/images/nyc/potatocorner.png',
  logo_track: '/images/nyc/potatocorner.png',
  // track_bg: `/images/nyc/logoTrack.png`,
  bg_image: `/images/nyc/2.png`,
  page_bg: `${supabaseUrl}/storage/v1/object/public/web-ordering/images/otw_bg.jpg`,
  width: '400px',
  track_bg: ""
}

export default nycBakesTheme;