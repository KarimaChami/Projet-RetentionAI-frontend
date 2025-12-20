"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Users, Briefcase, TrendingUp, AlertCircle, CheckCircle,
  Loader2, LogOut, Calendar, DollarSign, Star, Home, Plane,
  Clock, MapPin, GraduationCap, Heart, UserCircle, BarChart3,
  Layers, Award, Hash, Building2, UserPlus, Milestone
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
  const educationFields = ['Life Sciences', 'Medical', 'Marketing', 'Technical Degree', 'Other', 'Human Resources'];
  const maritalStatuses = ['Single', 'Married', 'Divorced'];

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
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.age || formData.age < 18) newErrors.age = "Âge requis (min 18)";
    if (!formData.years_at_company) newErrors.years_at_company = "Champ requis";
    if (!formData.monthly_income) newErrors.monthly_income = "Revenu requis";
    if (!formData.total_working_years) newErrors.total_working_years = "Champ requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    
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
        TotalWorkingYears: parseInt(formData.total_working_years),
        WorkLifeBalance: parseInt(formData.work_life_balance),
        YearsAtCompany: parseInt(formData.years_at_company),
        YearsInCurrentRole: parseInt(formData.years_in_current_role),
        YearsWithCurrManager: parseInt(formData.years_with_curr_manager)
      };

      const res = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(employeeData)
      });

      if (res.ok) {
        const data = await res.json();
        setPredictionResult(data);
        if (data.churn_probability > 0.5) {
          const retRes = await fetch('http://localhost:8000/generate-retention-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ employee_data: employeeData, churn_probability: data.churn_probability })
          });
          if (retRes.ok) setRetentionPlan(await retRes.json());
        }
      }
    } catch (err) {
      alert("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FF6B35] rounded-lg text-white"><Brain size={28} /></div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">RH Intelligence</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Predictive Analytics Dashboard</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="ghost" className="text-slate-600 hover:text-red-500">
            <LogOut size={18} className="mr-2" /> Quitter
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Formulaire - 7 colonnes */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handlePredict} className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 space-y-8">
              
              {/* Identité & Base */}
              <section>
                <div className="flex items-center gap-2 mb-4 text-[#FF6B35]">
                  <UserCircle size={20} />
                  <h2 className="font-bold text-slate-800">Informations de base</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-slate-500">ID Employé</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-2.5 text-slate-400" size={16} />
                      <Input name="employee_id" value={formData.employee_id} onChange={handleInputChange} className="pl-9" placeholder="EMP-001" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-slate-500">Âge</Label>
                    <Input name="age" type="number" value={formData.age} onChange={handleInputChange} className={errors.age ? "border-red-500" : ""} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-slate-500">Genre</Label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                      <option value="Male">Homme</option>
                      <option value="Female">Femme</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-slate-500 text-flex items-center gap-1"><Heart size={12}/> État Civil</Label>
                    <select name="marital_status" value={formData.marital_status} onChange={handleInputChange} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                      {maritalStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs uppercase text-slate-500">Distance Domicile (km)</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 text-slate-400" size={16} />
                      <Input name="distance_from_home" type="number" value={formData.distance_from_home} onChange={handleInputChange} className="pl-9" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Éducation & Poste */}
              <section className="pt-6 border-t">
                <div className="flex items-center gap-2 mb-4 text-[#FF6B35]">
                  <Briefcase size={20} />
                  <h2 className="font-bold text-slate-800">Carrière & Éducation</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-slate-500">Département</Label>
                    <select name="department" value={formData.department} onChange={handleInputChange} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-slate-500">Rôle</Label>
                    <select name="job_role" value={formData.job_role} onChange={handleInputChange} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                      {jobRoles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-slate-500">Niveau d'études (1-5)</Label>
                    <Input name="education" type="number" min="1" max="5" value={formData.education} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-slate-500">Domaine d'études</Label>
                    <select name="education_field" value={formData.education_field} onChange={handleInputChange} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                      {educationFields.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
              </section>

              {/* Expérience Temporelle */}
              <section className="pt-6 border-t">
                <div className="flex items-center gap-2 mb-4 text-[#FF6B35]">
                  <Calendar size={20} />
                  <h2 className="font-bold text-slate-800">Ancienneté & Expérience</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-slate-500">Expérience Totale</Label>
                    <Input name="total_working_years" type="number" value={formData.total_working_years} onChange={handleInputChange} placeholder="ans" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-slate-500">Années ici</Label>
                    <Input name="years_at_company" type="number" value={formData.years_at_company} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-slate-500">Nb Entreprises</Label>
                    <Input name="num_companies_worked" type="number" value={formData.num_companies_worked} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-slate-500">Années poste actuel</Label>
                    <Input name="years_in_current_role" type="number" value={formData.years_in_current_role} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-slate-500">Années / Manager</Label>
                    <Input name="years_with_curr_manager" type="number" value={formData.years_with_curr_manager} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-slate-500">Niveau Job (1-5)</Label>
                    <Input name="job_level" type="number" min="1" max="5" value={formData.job_level} onChange={handleInputChange} />
                  </div>
                </div>
              </section>

              {/* Finance & Conditions */}
              <section className="pt-6 border-t">
                <div className="flex items-center gap-2 mb-4 text-[#FF6B35]">
                  <DollarSign size={20} />
                  <h2 className="font-bold text-slate-800">Finance & Rythme</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-slate-500">Salaire Mensuel (€)</Label>
                      <Input name="monthly_income" type="number" value={formData.monthly_income} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-slate-500">Taux Mensuel (Global)</Label>
                      <Input name="monthly_rate" type="number" value={formData.monthly_rate} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-slate-500">% Augmentation</Label>
                      <Input name="percent_salary_hike" type="number" value={formData.percent_salary_hike} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-slate-500">Stock Options (0-3)</Label>
                      <Input name="stock_option_level" type="number" min="0" max="3" value={formData.stock_option_level} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-slate-500 flex items-center gap-1"><Plane size={14}/> Voyages Pro</Label>
                    <select name="business_travel" value={formData.business_travel} onChange={handleInputChange} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                      {travelOptions.map(o => <option key={o} value={o}>{o.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-slate-500 flex items-center gap-1"><Clock size={14}/> Heures Supplémentaires</Label>
                    <select name="over_time" value={formData.over_time} onChange={handleInputChange} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                      <option value="No">Non</option>
                      <option value="Yes">Oui</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Sliders d'engagement */}
              <section className="pt-6 border-t bg-slate-50/50 -mx-8 px-8 py-6 rounded-b-2xl">
                <div className="flex items-center gap-2 mb-6 text-[#FF6B35]">
                  <TrendingUp size={20} />
                  <h2 className="font-bold text-slate-800">Évaluation & Satisfaction</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {[
                    { id: 'job_satisfaction', label: 'Satisfaction Job', icon: Star },
                    { id: 'work_life_balance', label: 'Équilibre Vie P/P', icon: Home },
                    { id: 'performance_rating', label: 'Performance', icon: Award },
                    { id: 'job_involvement', label: 'Implication', icon: Users },
                  ].map((item) => (
                    <div key={item.id} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-xs uppercase font-semibold text-slate-600 flex items-center gap-2">
                          <item.icon size={14} className="text-[#FF6B35]" /> {item.label}
                        </Label>
                        <span className="text-sm font-bold text-[#FF6B35]">{formData[item.id]}/5</span>
                      </div>
                      <input 
                        type="range" name={item.id} min="1" max="5" 
                        value={formData[item.id]} onChange={handleInputChange}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#FF6B35]"
                      />
                    </div>
                  ))}
                </div>
              </section>

              <Button type="submit" disabled={loading} className="w-full bg-[#FF6B35] hover:bg-[#e85a2a] h-14 text-lg font-bold shadow-lg shadow-[#FF6B35]/20">
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Brain className="mr-2" />}
                Lancer l'Analyse Prédictive
              </Button>
            </form>
          </div>

          {/* Résultats - 5 colonnes */}
          <div className="lg:col-span-5 space-y-6">
            <AnimatePresence mode="wait">
              {predictionResult ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {/* Carte Score */}
                  <div className="bg-white rounded-2xl border p-8 shadow-sm text-center">
                    <h3 className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-6">Probabilité de départ</h3>
                    <div className="relative inline-flex items-center justify-center mb-6">
                      <svg className="w-48 h-48 transform -rotate-90">
                        <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                        <circle 
                          cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" 
                          strokeDasharray={552} 
                          strokeDashoffset={552 - (552 * predictionResult.churn_probability)}
                          className={predictionResult.churn_probability > 0.5 ? "text-red-500" : "text-green-500"} 
                        />
                      </svg>
                      <span className="absolute text-5xl font-black text-slate-800">
                        {Math.round(predictionResult.churn_probability * 100)}%
                      </span>
                    </div>
                    <div className={`py-2 px-4 rounded-full text-sm font-bold inline-block ${
                      predictionResult.churn_probability > 0.7 ? "bg-red-100 text-red-700" : 
                      predictionResult.churn_probability > 0.4 ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"
                    }`}>
                      {predictionResult.churn_probability > 0.5 ? "RISQUE DÉTECTÉ" : "PROFIL STABLE"}
                    </div>
                  </div>

                  {/* Plan de rétention */}
                  {retentionPlan && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-green-200 shadow-sm overflow-hidden">
                      <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex items-center gap-2">
                        <CheckCircle className="text-green-600" size={20} />
                        <h3 className="font-bold text-green-800">Plan de Rétention IA</h3>
                      </div>
                      <div className="p-6 space-y-4">
                        {retentionPlan.retention_plan.map((step, i) => (
                          <div key={i} className="flex gap-4 items-start">
                            <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i+1}</div>
                            <p className="text-sm text-slate-700 leading-relaxed">{step}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <div className="bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl h-[600px] flex flex-col items-center justify-center text-center p-8">
                  <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                    <Brain size={40} className="text-slate-400" />
                  </div>
                  <h3 className="text-slate-800 font-bold text-lg">En attente de données</h3>
                  <p className="text-slate-500 text-sm max-w-[250px] mt-2">
                    Remplissez le profil de l'employé à gauche pour générer l'analyse.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}