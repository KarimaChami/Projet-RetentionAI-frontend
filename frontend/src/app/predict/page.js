"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Users,
  Briefcase,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2,
  LogOut,
  Calendar,
  DollarSign,
  Star,
  Home,
  Plane,
  Clock,
  MapPin
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export default function AnalyzePage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [retentionPlan, setRetentionPlan] = useState(null);
  const [errors, setErrors] = useState({});

  // Form data
  const [formData, setFormData] = useState({
    age: '',
    department: 'IT',
    job_role: 'Developer',
    years_at_company: '',
    monthly_income: '',
    job_satisfaction: '3',
    work_life_balance: '3',
    performance_rating: '3',
    business_travel: 'Travel_Rarely',
    over_time: 'No',
    distance_from_home: '',
    employee_id: '',
    // Champs manquants avec valeurs par défaut
    education: '3',
    education_field: 'Life Sciences',
    gender: 'Male',
    job_involvement: '3',
    job_level: '1',
    monthly_rate: '10000',
    marital_status: 'Single',
    num_companies_worked: '1',
    percent_salary_hike: '10',
    stock_option_level: '0',
    total_working_years: '',
    years_in_current_role: '2',
    years_with_curr_manager: '2'
  });

  const departments = ['IT', 'Sales', 'HR', 'Marketing', 'Finance', 'Operations', 'R&D'];
  const jobRoles = ['Manager', 'Developer', 'Analyst', 'Specialist', 'Engineer', 'Consultant'];
  const travelOptions = ['Non-Travel', 'Travel_Rarely', 'Travel_Frequently'];

  // Vérifier l'authentification
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/login');
    } else {
      setToken(storedToken);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.age || formData.age < 18 || formData.age > 100) newErrors.age = 'L\'âge doit être entre 18 et 100 ans';
    if (!formData.years_at_company || formData.years_at_company < 0) newErrors.years_at_company = 'Les années doivent être >= 0';
    if (!formData.monthly_income || formData.monthly_income <= 0) newErrors.monthly_income = 'Le revenu doit être > 0';
    if (!formData.distance_from_home || formData.distance_from_home < 0) newErrors.distance_from_home = 'La distance doit être >= 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setPredictionResult(null);
    setRetentionPlan(null);

    try {
      const employeeData = {
        Age: parseInt(formData.age),
        BusinessTravel: formData.business_travel,
        Department: formData.department,
        Education: parseInt(formData.education),
        EducationField: formData.education_field,
        Gender: formData.gender,
        JobInvolvement: parseInt(formData.job_involvement),
        JobLevel: parseInt(formData.job_level),
        JobRole: formData.job_role,
        MonthlyRate: parseFloat(formData.monthly_rate),
        MaritalStatus: formData.marital_status,
        MonthlyIncome: parseFloat(formData.monthly_income),
        NumCompaniesWorked: parseInt(formData.num_companies_worked),
        PercentSalaryHike: parseInt(formData.percent_salary_hike),
        OverTime: formData.over_time,
        PerformanceRating: parseInt(formData.performance_rating),
        StockOptionLevel: parseInt(formData.stock_option_level),
        TotalWorkingYears: parseInt(formData.total_working_years || formData.years_at_company),
        WorkLifeBalance: parseInt(formData.work_life_balance),
        YearsAtCompany: parseInt(formData.years_at_company),
        YearsInCurrentRole: parseInt(formData.years_in_current_role),
        YearsWithCurrManager: parseInt(formData.years_with_curr_manager)
      };

      // Appel API prédiction
      const predictResponse = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(employeeData)
      });

      if (!predictResponse.ok) {
        if (predictResponse.status === 401) {
          alert('Session expirée. Veuillez vous reconnecter.');
          handleLogout();
          return;
        }
        const errorData = await predictResponse.json();
        throw new Error(errorData.detail || 'Erreur de prédiction');
      }

      const predictionData = await predictResponse.json();
      setPredictionResult(predictionData);

      if (predictionData.churn_probability > 0.5) {
        const retentionResponse = await fetch('http://localhost:8000/generate-retention-plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            employee_data: employeeData,
            churn_probability: predictionData.churn_probability
          })
        });

        if (retentionResponse.ok) {
          const retentionData = await retentionResponse.json();
          setRetentionPlan(retentionData);
        }
      }
    } catch (error) {
      alert(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (p) => p >= 0.7 ? 'from-red-500 to-red-600' : p >= 0.5 ? 'from-orange-500 to-orange-600' : 'from-green-500 to-green-600';
  const getRiskLabel = (p) => p >= 0.7 ? 'RISQUE ÉLEVÉ' : p >= 0.5 ? 'RISQUE MOYEN' : 'RISQUE FAIBLE';


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-[#FF6B35]/5 p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-[#FF6B35]/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-80 h-80 bg-[#4A5568]/5 rounded-full blur-3xl"
          animate={{ scale: [1.3, 1, 1.3], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-8 relative z-10"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] bg-clip-text text-transparent">
                RH Intelligence
              </h1>
              <p className="text-sm text-muted-foreground">Analyse prédictive des départs</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-border/50 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* Formulaire */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-[#FF6B35]" />
              <h2 className="text-xl font-bold">Profil de l'employé</h2>
            </div>

            <form onSubmit={handlePredict} className="space-y-4">
              {/* ID Employé (optionnel) */}
              <div>
                <Label htmlFor="employee_id" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#FF6B35]" />
                  ID Employé (optionnel)
                </Label>
                <Input
                  id="employee_id"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleInputChange}
                  placeholder="EMP001"
                  className="bg-input-background border-border/50 focus:border-[#FF6B35]"
                />
              </div>

              {/* Âge */}
              <div>
                <Label htmlFor="age" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#FF6B35]" />
                  Âge *
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="35"
                  required
                  className="bg-input-background border-border/50 focus:border-[#FF6B35]"
                />
                {errors.age && <p className="text-sm text-destructive mt-1">{errors.age}</p>}
              </div>

              {/* Département */}
              <div>
                <Label htmlFor="department" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#FF6B35]" />
                  Département *
                </Label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-input-background border border-border/50 rounded-md focus:border-[#FF6B35] focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Rôle */}
              <div>
                <Label htmlFor="job_role" className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#FF6B35]" />
                  Rôle *
                </Label>
                <select
                  id="job_role"
                  name="job_role"
                  value={formData.job_role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-input-background border border-border/50 rounded-md focus:border-[#FF6B35] focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                >
                  {jobRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Années dans l'entreprise */}
              <div>
                <Label htmlFor="years_at_company" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#FF6B35]" />
                  Années dans l'entreprise *
                </Label>
                <Input
                  id="years_at_company"
                  name="years_at_company"
                  type="number"
                  value={formData.years_at_company}
                  onChange={handleInputChange}
                  placeholder="5"
                  required
                  className="bg-input-background border-border/50 focus:border-[#FF6B35]"
                />
                {errors.years_at_company && <p className="text-sm text-destructive mt-1">{errors.years_at_company}</p>}
              </div>

              {/* Revenu mensuel */}
              <div>
                <Label htmlFor="monthly_income" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#FF6B35]" />
                  Revenu mensuel (€) *
                </Label>
                <Input
                  id="monthly_income"
                  name="monthly_income"
                  type="number"
                  value={formData.monthly_income}
                  onChange={handleInputChange}
                  placeholder="5000"
                  required
                  className="bg-input-background border-border/50 focus:border-[#FF6B35]"
                />
                {errors.monthly_income && <p className="text-sm text-destructive mt-1">{errors.monthly_income}</p>}
              </div>

              {/* Satisfaction au travail */}
              <div>
                <Label className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#FF6B35]" />
                  Satisfaction au travail: {formData.job_satisfaction}/5
                </Label>
                <input
                  type="range"
                  name="job_satisfaction"
                  min="1"
                  max="5"
                  value={formData.job_satisfaction}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF6B35]"
                />
              </div>

              {/* Équilibre vie pro/perso */}
              <div>
                <Label className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-[#FF6B35]" />
                  Équilibre vie pro/perso: {formData.work_life_balance}/5
                </Label>
                <input
                  type="range"
                  name="work_life_balance"
                  min="1"
                  max="5"
                  value={formData.work_life_balance}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF6B35]"
                />
              </div>

              {/* Performance */}
              <div>
                <Label className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#FF6B35]" />
                  Performance: {formData.performance_rating}/5
                </Label>
                <input
                  type="range"
                  name="performance_rating"
                  min="1"
                  max="5"
                  value={formData.performance_rating}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF6B35]"
                />
              </div>

              {/* Voyages professionnels */}
              <div>
                <Label htmlFor="business_travel" className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-[#FF6B35]" />
                  Voyages professionnels *
                </Label>
                <select
                  id="business_travel"
                  name="business_travel"
                  value={formData.business_travel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-input-background border border-border/50 rounded-md focus:border-[#FF6B35] focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                >
                  {travelOptions.map(option => (
                    <option key={option} value={option}>
                      {option === 'Non-Travel' ? 'Aucun' : 
                       option === 'Travel_Rarely' ? 'Rarement' : 
                       'Fréquemment'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Heures supplémentaires */}
              <div>
                <Label htmlFor="over_time" className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FF6B35]" />
                  Heures supplémentaires *
                </Label>
                <select
                  id="over_time"
                  name="over_time"
                  value={formData.over_time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-input-background border border-border/50 rounded-md focus:border-[#FF6B35] focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                >
                  <option value="No">Non</option>
                  <option value="Yes">Oui</option>
                </select>
              </div>

              {/* Distance domicile-travail */}
              <div>
                <Label htmlFor="distance_from_home" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FF6B35]" />
                  Distance domicile-travail (km) *
                </Label>
                <Input
                  id="distance_from_home"
                  name="distance_from_home"
                  type="number"
                  value={formData.distance_from_home}
                  onChange={handleInputChange}
                  placeholder="15"
                  required
                  className="bg-input-background border-border/50 focus:border-[#FF6B35]"
                />
                {errors.distance_from_home && <p className="text-sm text-destructive mt-1">{errors.distance_from_home}</p>}
              </div>

              {/* Bouton d'analyse */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] hover:shadow-lg hover:shadow-[#FF6B35]/20 transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Analyser le profil
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </div>
        </motion.div>

        {/* Résultats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Résultat de prédiction */}
          <AnimatePresence>
            {predictionResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <AlertCircle className="w-6 h-6 text-[#FF6B35]" />
                  <h2 className="text-xl font-bold">Résultat de l'analyse</h2>
                </div>

                {/* Gauge visuelle */}
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="inline-block"
                  >
                    <div className={`w-40 h-40 rounded-full bg-gradient-to-br ${getRiskColor(predictionResult.churn_probability)} flex items-center justify-center shadow-lg mx-auto mb-4`}>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-white">
                          {Math.round(predictionResult.churn_probability * 100)}%
                        </div>
                        <div className="text-sm text-white/90">Risque</div>
                      </div>
                    </div>
                  </motion.div>

                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                    predictionResult.churn_probability >= 0.7 ? 'bg-red-100 text-red-800' :
                    predictionResult.churn_probability >= 0.5 ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {getRiskLabel(predictionResult.churn_probability)}
                  </div>
                </div>

                {/* Détails */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">Probabilité de départ</span>
                    <span className="font-semibold">{(predictionResult.churn_probability * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">Niveau de risque</span>
                    <span className="font-semibold">{predictionResult.risk_level}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">Date d'analyse</span>
                    <span className="font-semibold">
                      {new Date(predictionResult.timestamp).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Plan de rétention */}
          <AnimatePresence>
            {retentionPlan && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.3 }}
                className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <h2 className="text-xl font-bold">Plan de rétention recommandé</h2>
                </div>

                <div className="space-y-4">
                  {retentionPlan.retention_plan.map((action, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex gap-3 p-4 bg-gradient-to-r from-green-50/50 to-transparent border-l-4 border-green-500 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm flex-1 leading-relaxed">{action}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50/50 border border-blue-200/50 rounded-lg">
                  <p className="text-sm text-blue-900 flex items-start gap-2">
                    <Brain className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Ces recommandations ont été générées automatiquement par notre IA en fonction du profil de l'employé.
                    </span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* État initial */}
          {!predictionResult && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card/50 backdrop-blur-xl border border-dashed border-border/50 rounded-2xl p-12 text-center"
            >
              <Brain className="w-16 h-16 mx-auto mb-4 text-[#FF6B35] opacity-50" />
              <h3 className="text-lg font-semibold mb-2 text-muted-foreground">
                Prêt pour l'analyse
              </h3>
              <p className="text-sm text-muted-foreground">
                Remplissez le formulaire et cliquez sur "Analyser le profil" pour obtenir une prédiction.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}