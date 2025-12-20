"use client"; 
import { Lock, Mail, Brain } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';


export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleLogin = async () => {
    const newErrors = { email: '', password: '' };
    if (!email || !email.includes('@')) newErrors.email = 'Veuillez entrer une adresse email valide';
    if (!password || password.length < 6) newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    setErrors(newErrors);
    if (newErrors.email || newErrors.password) return;

    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.detail || "Erreur de connexion");
      return;
    }

    const data = await response.json();
    localStorage.setItem("token", data.access_token);
    // alert("Connexion réussie !");
    router.push('predict'); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/5 via-background to-[#4A5568]/5">
        <motion.div className="absolute top-20 left-20 w-72 h-72 bg-[#FF6B35]/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div className="absolute bottom-20 right-20 w-96 h-96 bg-[#4A5568]/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }} className="w-full max-w-md relative z-10"
      >
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <motion.div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] mb-4 shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl mb-2 bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] bg-clip-text text-transparent">
              RH Intelligence
            </h1>
            <p className="text-muted-foreground">Plateforme d'analyse prédictive des talents</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FF6B35]" /> Email
              </Label>
              <Input id="email" type="email" placeholder="votre.email@entreprise.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="bg-input-background border-border/50 focus:border-[#FF6B35] transition-colors"
              />
              {errors.email && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive">{errors.email}</motion.p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#FF6B35]" /> Mot de passe
              </Label>
              <Input id="password" type="password" placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="bg-input-background border-border/50 focus:border-[#FF6B35] transition-colors"
              />
              {errors.password && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive">{errors.password}</motion.p>}
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button type="submit"
                className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] hover:shadow-lg hover:shadow-[#FF6B35]/20 transition-all"
              >Se connecter</Button>
            </motion.div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Vous n'avez pas de compte ?{' '}
              <Link href="/register" className="text-[#FF6B35] hover:text-[#FF8C5A] font-medium transition-colors">
                S'inscrire
              </Link>
            </p>
          </div>

          <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border/30">
            <p className="text-sm text-muted-foreground text-center">
              <span className="block mb-1">Démo : utilisez n'importe quelle adresse email valide</span>
              <span className="text-xs">et un mot de passe de 6+ caractères</span>
            </p>
          </div>
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-center mt-6 text-sm text-muted-foreground">
          Propulsé par l'IA • Sécurisé • Confidentiel
        </motion.p>
      </motion.div>
    </div>
  );
}
