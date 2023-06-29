import "./globals.css";
import Background from "@/lib/components/Common/Background";
import Providers from "@/lib/components/Common/Providers";

export const metadata = {};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Background>{children}</Background>
        </Providers>
      </body>
    </html>
  );
}
