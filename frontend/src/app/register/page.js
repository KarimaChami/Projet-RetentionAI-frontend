"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Brain, User } from 'lucide-react';
import { Button } from '../ui/button'; 
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

const handleRegister = async (e) => {
  e.preventDefault();

  const newErrors = { username: '', email: '', password: '', confirmPassword: '' };
  let hasError = false;

  if (!username || username.length < 3) {
    newErrors.username = "Le nom d'utilisateur doit contenir au moins 3 caractères";
    hasError = true;
  }

  if (!email || !email.includes('@')) {
    newErrors.email = 'Veuillez entrer une adresse email valide';
    hasError = true;
  }

  if (!password || password.length < 6) {
    newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    hasError = true;
  }

  if (password !== confirmPassword) {
    newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    hasError = true;
  }

  setErrors(newErrors);
  if (hasError) return;

  try {
    const res = await fetch('http://localhost:8000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        email,
        password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Erreur lors de l'inscription");
      return;
    }

    localStorage.setItem("token", data.access_token); // stocke le token
    alert("Inscription réussie !");
    router.push("/login"); // redirection vers login

  } catch (error) {
    console.error("Erreur d'inscription :", error);
    alert("Erreur réseau ou serveur");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background (comme login) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/5 via-background to-[#4A5568]/5">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-[#FF6B35]/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-[#4A5568]/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] mb-4 shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl mb-2 bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] bg-clip-text text-transparent">
              Créer votre Compte
            </h1>
            <p className="text-muted-foreground">Démarrez votre analyse prédictive des talents</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#FF6B35]" />
                Nom d'utilisateur
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Votre nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-input-background border-border/50 focus:border-[#FF6B35] transition-colors"
              />
              {errors.username && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-destructive">{errors.username}</motion.p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FF6B35]" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="votre.email@entreprise.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input-background border-border/50 focus:border-[#FF6B35] transition-colors"
              />
              {errors.email && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-destructive">{errors.email}</motion.p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#FF6B35]" />
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input-background border-border/50 focus:border-[#FF6B35] transition-colors"
              />
              {errors.password && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-destructive">{errors.password}</motion.p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#FF6B35]" />
                Confirmer le mot de passe
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-input-background border-border/50 focus:border-[#FF6B35] transition-colors"
              />
              {errors.confirmPassword && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-destructive">{errors.confirmPassword}</motion.p>}
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-2">
              <Button type="submit" className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] hover:shadow-lg hover:shadow-[#FF6B35]/20 transition-all">
                S'inscrire
              </Button>
            </motion.div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Vous avez déjà un compte ?{' '}
              <a href="/login" className="text-[#FF6B35] hover:text-[#FF8C5A] font-medium transition-colors">
                Se connecter
              </a>
            </p>
          </div>
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center mt-6 text-sm text-muted-foreground">
          Propulsé par l'IA • Sécurisé • Confidentiel
        </motion.p>
      </motion.div>
    </div>
  );
}
