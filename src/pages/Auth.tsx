import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type UserRole = "doctor" | "blood_bank" | "donor";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>("donor");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    hospital: "",
    bankName: "",
    location: "",
    bloodType: "",
    phone: "",
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store user data in localStorage for demo
    localStorage.setItem("userRole", role);
    localStorage.setItem("userData", JSON.stringify(formData));
    localStorage.setItem("isAuthenticated", "true");

    toast({
      title: isLogin ? "Connexion réussie !" : "Inscription réussie !",
      description: `Bienvenue ${formData.fullName || formData.bankName}`,
    });

    navigate("/dashboard");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth">
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-white fill-current" />
          </div>
          <span className="font-bold text-primary">BloodLink</span>
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-md mx-auto animate-slide-up">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {isLogin ? "Connexion" : "Inscription"}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin ? "Connectez-vous à votre compte" : "Créez votre compte BloodLink"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label>Je suis :</Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border-2 border-border hover:border-primary transition-smooth cursor-pointer">
                    <RadioGroupItem value="doctor" id="doctor" />
                    <Label htmlFor="doctor" className="cursor-pointer flex-1 font-normal">
                      👨‍⚕️ Docteur
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border-2 border-border hover:border-primary transition-smooth cursor-pointer">
                    <RadioGroupItem value="blood_bank" id="blood_bank" />
                    <Label htmlFor="blood_bank" className="cursor-pointer flex-1 font-normal">
                      🏥 Banque de sang
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border-2 border-border hover:border-primary transition-smooth cursor-pointer">
                    <RadioGroupItem value="donor" id="donor" />
                    <Label htmlFor="donor" className="cursor-pointer flex-1 font-normal">
                      ❤️ Donneur
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Dynamic Fields based on Role */}
              <div className="space-y-4">
                {role === "doctor" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nom complet *</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Dr. Jean Dupont"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hospital">Hôpital *</Label>
                      <Input
                        id="hospital"
                        type="text"
                        placeholder="Hôpital Central"
                        value={formData.hospital}
                        onChange={(e) => handleInputChange("hospital", e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                {role === "blood_bank" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Nom de la banque *</Label>
                      <Input
                        id="bankName"
                        type="text"
                        placeholder="Banque de Sang Nationale"
                        value={formData.bankName}
                        onChange={(e) => handleInputChange("bankName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Localisation *</Label>
                      <Input
                        id="location"
                        type="text"
                        placeholder="Paris, France"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                {role === "donor" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nom complet *</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Marie Martin"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodType">Groupe sanguin *</Label>
                      <Select value={formData.bloodType} onValueChange={(value) => handleInputChange("bloodType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {bloodTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Numéro de téléphone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+33 6 12 34 56 78"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                {/* Common Fields */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemple.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" variant="hero" size="lg" className="w-full">
                {isLogin ? "Se connecter" : "S'inscrire"}
              </Button>

              {/* Toggle Login/Signup */}
              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
                </span>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2"
                >
                  {isLogin ? "S'inscrire" : "Se connecter"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
