// import React, { useState } from 'react';
// import { motion } from 'motion/react';
// import { User, Briefcase, TrendingUp, Heart, Clock, DollarSign } from 'lucide-react';
// import { Button } from './ui/button';
// import { Input } from './ui/input';
// import { Label } from './ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// import { Slider } from './ui/slider';

// export interface EmployeeData {
//   firstName: string;
//   lastName: string;
//   position: string;
//   department: string;
//   yearsOfService: number;
//   salary: number;
//   performanceScore: number;
//   satisfactionLevel: number;
//   engagementScore: number;
//   workloadLevel: number;
//   careerOpportunities: number;
//   lastPromotion: number;
// }

// interface EmployeeFormProps {
//   onSubmit: (data: EmployeeData) => void;
// }

// export function EmployeeForm({ onSubmit }: EmployeeFormProps) {
//   const [formData, setFormData] = useState<EmployeeData>({
//     firstName: '',
//     lastName: '',
//     position: '',
//     department: '',
//     yearsOfService: 1,
//     salary: 40000,
//     performanceScore: 7,
//     satisfactionLevel: 7,
//     engagementScore: 7,
//     workloadLevel: 5,
//     careerOpportunities: 5,
//     lastPromotion: 2,
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   const updateField = (field: keyof EmployeeData, value: string | number) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="max-w-5xl mx-auto"
//     >
//       <div className="bg-card rounded-2xl shadow-xl border border-border/50 overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] p-6 text-white">
//           <div className="flex items-center gap-3">
//             <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
//               <User className="w-6 h-6" />
//             </div>
//             <div>
//               <h2 className="text-2xl">Profil Employé</h2>
//               <p className="text-white/90 text-sm">Renseignez les informations pour l'analyse prédictive</p>
//             </div>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-8">
//           {/* Informations personnelles */}
//           <div className="space-y-4">
//             <div className="flex items-center gap-2 mb-4">
//               <div className="w-8 h-8 rounded-lg bg-[#FF6B35]/10 flex items-center justify-center">
//                 <User className="w-4 h-4 text-[#FF6B35]" />
//               </div>
//               <h3 className="text-lg">Informations personnelles</h3>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="firstName">Prénom</Label>
//                 <Input
//                   id="firstName"
//                   value={formData.firstName}
//                   onChange={(e) => updateField('firstName', e.target.value)}
//                   required
//                   className="bg-input-background"
//                 />
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="lastName">Nom</Label>
//                 <Input
//                   id="lastName"
//                   value={formData.lastName}
//                   onChange={(e) => updateField('lastName', e.target.value)}
//                   required
//                   className="bg-input-background"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Informations professionnelles */}
//           <div className="space-y-4">
//             <div className="flex items-center gap-2 mb-4">
//               <div className="w-8 h-8 rounded-lg bg-[#FF6B35]/10 flex items-center justify-center">
//                 <Briefcase className="w-4 h-4 text-[#FF6B35]" />
//               </div>
//               <h3 className="text-lg">Informations professionnelles</h3>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="position">Poste</Label>
//                 <Input
//                   id="position"
//                   value={formData.position}
//                   onChange={(e) => updateField('position', e.target.value)}
//                   required
//                   placeholder="ex: Développeur Senior"
//                   className="bg-input-background"
//                 />
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="department">Département</Label>
//                 <Select value={formData.department} onValueChange={(value) => updateField('department', value)}>
//                   <SelectTrigger className="bg-input-background">
//                     <SelectValue placeholder="Sélectionnez un département" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="IT">Informatique</SelectItem>
//                     <SelectItem value="RH">Ressources Humaines</SelectItem>
//                     <SelectItem value="Marketing">Marketing</SelectItem>
//                     <SelectItem value="Ventes">Ventes</SelectItem>
//                     <SelectItem value="Finance">Finance</SelectItem>
//                     <SelectItem value="Operations">Opérations</SelectItem>
//                     <SelectItem value="Legal">Juridique</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="yearsOfService">Ancienneté (années)</Label>
//                 <Input
//                   id="yearsOfService"
//                   type="number"
//                   min="0"
//                   max="50"
//                   value={formData.yearsOfService}
//                   onChange={(e) => updateField('yearsOfService', parseInt(e.target.value))}
//                   className="bg-input-background"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="salary" className="flex items-center gap-2">
//                   <DollarSign className="w-4 h-4 text-[#FF6B35]" />
//                   Salaire annuel (€)
//                 </Label>
//                 <Input
//                   id="salary"
//                   type="number"
//                   min="20000"
//                   max="300000"
//                   step="1000"
//                   value={formData.salary}
//                   onChange={(e) => updateField('salary', parseInt(e.target.value))}
//                   className="bg-input-background"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Métriques de performance */}
//           <div className="space-y-6">
//             <div className="flex items-center gap-2 mb-4">
//               <div className="w-8 h-8 rounded-lg bg-[#FF6B35]/10 flex items-center justify-center">
//                 <TrendingUp className="w-4 h-4 text-[#FF6B35]" />
//               </div>
//               <h3 className="text-lg">Métriques de performance et engagement</h3>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-3">
//                 <Label className="flex items-center justify-between">
//                   <span>Score de performance</span>
//                   <span className="text-[#FF6B35]">{formData.performanceScore}/10</span>
//                 </Label>
//                 <Slider
//                   value={[formData.performanceScore]}
//                   onValueChange={([value]) => updateField('performanceScore', value)}
//                   min={1}
//                   max={10}
//                   step={1}
//                   className="w-full"
//                 />
//               </div>

//               <div className="space-y-3">
//                 <Label className="flex items-center justify-between">
//                   <span className="flex items-center gap-2">
//                     <Heart className="w-4 h-4 text-[#FF6B35]" />
//                     Niveau de satisfaction
//                   </span>
//                   <span className="text-[#FF6B35]">{formData.satisfactionLevel}/10</span>
//                 </Label>
//                 <Slider
//                   value={[formData.satisfactionLevel]}
//                   onValueChange={([value]) => updateField('satisfactionLevel', value)}
//                   min={1}
//                   max={10}
//                   step={1}
//                   className="w-full"
//                 />
//               </div>

//               <div className="space-y-3">
//                 <Label className="flex items-center justify-between">
//                   <span>Score d'engagement</span>
//                   <span className="text-[#FF6B35]">{formData.engagementScore}/10</span>
//                 </Label>
//                 <Slider
//                   value={[formData.engagementScore]}
//                   onValueChange={([value]) => updateField('engagementScore', value)}
//                   min={1}
//                   max={10}
//                   step={1}
//                   className="w-full"
//                 />
//               </div>

//               <div className="space-y-3">
//                 <Label className="flex items-center justify-between">
//                   <span className="flex items-center gap-2">
//                     <Clock className="w-4 h-4 text-[#FF6B35]" />
//                     Charge de travail
//                   </span>
//                   <span className="text-[#FF6B35]">{formData.workloadLevel}/10</span>
//                 </Label>
//                 <Slider
//                   value={[formData.workloadLevel]}
//                   onValueChange={([value]) => updateField('workloadLevel', value)}
//                   min={1}
//                   max={10}
//                   step={1}
//                   className="w-full"
//                 />
//               </div>

//               <div className="space-y-3">
//                 <Label className="flex items-center justify-between">
//                   <span>Opportunités de carrière</span>
//                   <span className="text-[#FF6B35]">{formData.careerOpportunities}/10</span>
//                 </Label>
//                 <Slider
//                   value={[formData.careerOpportunities]}
//                   onValueChange={([value]) => updateField('careerOpportunities', value)}
//                   min={1}
//                   max={10}
//                   step={1}
//                   className="w-full"
//                 />
//               </div>

//               <div className="space-y-3">
//                 <Label className="flex items-center justify-between">
//                   <span>Dernière promotion (années)</span>
//                   <span className="text-[#FF6B35]">{formData.lastPromotion}</span>
//                 </Label>
//                 <Slider
//                   value={[formData.lastPromotion]}
//                   onValueChange={([value]) => updateField('lastPromotion', value)}
//                   min={0}
//                   max={10}
//                   step={1}
//                   className="w-full"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Submit button */}
//           <motion.div 
//             whileHover={{ scale: 1.01 }} 
//             whileTap={{ scale: 0.99 }}
//             className="pt-4"
//           >
//             <Button
//               type="submit"
//               className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] hover:shadow-lg hover:shadow-[#FF6B35]/20 transition-all py-6"
//             >
//               Analyser le risque de départ
//             </Button>
//           </motion.div>
//         </form>
//       </div>
//     </motion.div>
//   );
// }
