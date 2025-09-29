import otwTheme from "./theme/otw";
import mamonakuTheme from "./theme/mamonaku";

export type Theme = {
  colors: {
    primary: string
    secondary: string
    tertiary: string
    accent: string
    background: string
    text: string
  }
  fonts: {
    base: string
    heading: string
    olympic: string
    strategy: string
    lemonmilk: string
    mottarue: string
  }
  borderRadius: string
  logo: string
  logo_track: string
  brand: string
  bg_image: string
  track_bg: string
  page_bg: string
}
const branchName = import.meta.env.VITE_BRANCH_NAME 

let theme: Theme

switch (branchName) {
  case 'otw':
    theme = otwTheme
    break
  case 'mamonaku':
  default:
    theme = mamonakuTheme
    break
}

export default theme