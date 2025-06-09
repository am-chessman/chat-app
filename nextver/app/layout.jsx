import "./globals.css";
import  {JetBrains_Mono} from "@next/font/google";

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains-mono',
})

export const metadata = {
  title: "ChatWave",
  description: "Chat app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable}`}>
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body className="m-0 h-full w-full flex justify-center items-center font-mono" >
            { children }
        </body>
    </html>
  );
}
