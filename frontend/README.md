// ============================================================================
// STRUCTURE DU PROJET FRONTEND
// ============================================================================
/*
frontend/
├── app/
│   ├── layout.js
│   ├── page.js
│   ├── login/
│   │   └── page.js
│   ├── register/
│   │   └── page.js
│   └── analyze/
│       └── page.js
├── components/
│   ├── auth/
│   │   ├── LoginForm.js
│   │   └── RegisterForm.js
│   ├── analyze/
│   │   └── AnalyzeForm.js
│   └── ui/
│       ├── button.js
│       ├── input.js
│       └── label.js
├── lib/
│   └── utils.js
├── public/
├── styles/
│   └── globals.css
├── package.json
├── tailwind.config.js
├── next.config.js
├── .env.local
└── Dockerfile
*/

// ============================================================================
// 1. package.json
// ============================================================================
/*
{
  "name": "retentionai-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^10.16.16",
    "lucide-react": "^0.292.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.5",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.0.4"
  }
}
*/

// ============================================================================
// 2. app/layout.js - Layout principal
// ============================================================================
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'RetentionAI - Plateforme RH Intelligence',
  description: 'Analyse prédictive des départs et recommandations de rétention',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

// ============================================================================
// 3. app/page.js - Page d'accueil (redirection)
// ============================================================================
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return null;
}

// ============================================================================
// 4. app/login/page.js
// ============================================================================
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return <LoginForm />;
}

// ============================================================================
// 5. app/register/page.js
// ============================================================================
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return <RegisterForm />;
}

// ============================================================================
// 6. app/analyze/page.js
// ============================================================================
import AnalyzeForm from '@/components/analyze/AnalyzeForm';

export default function AnalyzePage() {
  return <AnalyzeForm />;
}

// ============================================================================
// 7. components/ui/button.js
// ============================================================================
import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }

// ============================================================================
// 8. components/ui/input.js
// ============================================================================
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }

// ============================================================================
// 9. components/ui/label.js
// ============================================================================
import * as React from "react"
import { cn } from "@/lib/utils"

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }

// ============================================================================
// 10. lib/utils.js
// ============================================================================
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// ============================================================================
// 11. styles/globals.css
// ============================================================================
/*
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
    --input-background: 0 0% 100%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    --input-background: 217.2 32.6% 17.5%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
*/

// ============================================================================
// 12. tailwind.config.js
// ============================================================================
/*
/** @type {import('tailwindcss').Config} * /
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'input-background': "hsl(var(--input-background))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}
*/

// ============================================================================
// 13. next.config.js
// ============================================================================
/*
/** @type {import('next').NextConfig} * /
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
*/

// ============================================================================
// 14. .env.local
// ============================================================================
/*
NEXT_PUBLIC_API_URL=http://localhost:8000
*/

// ============================================================================
// 15. frontend/Dockerfile
// ============================================================================
/*
FROM node:18-alpine

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code
COPY . .

# Build de production
RUN npm run build

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]
*/

// ============================================================================
// 16. .dockerignore
// ============================================================================
/*
node_modules
.next
.git
.gitignore
README.md
.env.local
.DS_Store
npm-debug.log
*/

// ============================================================================
// 17. Instructions d'installation
// ============================================================================
/*
# Installation et démarrage du frontend

## 1. Créer le projet Next.js
```bash
npx create-next-app@latest frontend --typescript=false --tailwind --app --src-dir=false
cd frontend
```

## 2. Installer les dépendances supplémentaires
```bash
npm install framer-motion lucide-react class-variance-authority clsx tailwind-merge
```

## 3. Créer la structure des dossiers
```bash
mkdir -p components/auth components/analyze components/ui lib
```

## 4. Copier tous les fichiers fournis dans leurs emplacements respectifs

## 5. Créer le fichier .env.local
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

## 6. Lancer en mode développement
```bash
npm run dev
```

L'application sera accessible sur http://localhost:3000

## 7. Build pour production
```bash
npm run build
npm start
```

## 8. Avec Docker
```bash
# À la racine du projet
docker-compose up --build
```
*/

// ============================================================================
// 18. README.md pour le frontend
// ============================================================================
/*
# RetentionAI Frontend

Application Next.js pour l'analyse prédictive RH

## Fonctionnalités

- ✅ Authentification JWT (Login/Register)
- ✅ Formulaire d'analyse employé
- ✅ Prédiction du risque de départ
- ✅ Génération automatique de plan de rétention
- ✅ Interface moderne avec animations (Framer Motion)
- ✅ Design responsive (Tailwind CSS)
- ✅ Thème personnalisé (#FF6B35)

## Pages

1. **/** - Redirection vers /login
2. **/login** - Authentification
3. **/register** - Inscription
4. **/analyze** - Analyse et prédiction (protégée)

## Stack Technique

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Framer Motion
- Lucide React Icons

## Variables d'environnement

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Commandes

```bash
npm run dev      # Développement
npm run build    # Build production
npm start        # Démarrer en production
npm run lint     # Linter
```

## Auteur

**Karima Chami**
RetentionAI - Projet RH Intelligence
*/

export default null; // Fichier de référence uniquement