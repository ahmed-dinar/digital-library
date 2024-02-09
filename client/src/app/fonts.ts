import {Poppins, Anton} from 'next/font/google'

export const poppinsFont = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export const antonFont = Anton({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-anton',
});
