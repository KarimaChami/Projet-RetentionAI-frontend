import "./globals.css";

 

export const metadata = {
  title: "Hybrid Analyzer",
  description: "AI Content Analyze",
};

export default function RootLayout({
  children,
}){
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}
