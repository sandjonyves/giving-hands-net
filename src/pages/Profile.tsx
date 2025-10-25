import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Mail, Phone, MapPin, Building2, Droplet } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>({});
  const [role, setRole] = useState("");

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      navigate("/auth");
      return;
    }

    const userRole = localStorage.getItem("userRole");
    const data = JSON.parse(localStorage.getItem("userData") || "{}");
    setUserData(data);
    setRole(userRole || "");
  }, [navigate]);

  const getInitials = () => {
    const name = userData.fullName || userData.bankName || "U";
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRoleLabel = () => {
    switch (role) {
      case "doctor":
        return "Docteur";
      case "blood_bank":
        return "Banque de sang";
      case "donor":
        return "Donneur";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Header */}
      <div className="bg-card shadow-md">
        <div className="max-w-2xl mx-auto p-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Profile Header Card */}
        <Card className="shadow-lg animate-slide-up">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="w-24 h-24 border-4 border-primary shadow-primary">
                <AvatarFallback className="bg-primary text-white text-2xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h1 className="text-2xl font-bold">{userData.fullName || userData.bankName}</h1>
                <Badge variant="outline" className="mt-2">
                  {getRoleLabel()}
                </Badge>
              </div>

              {role === "donor" && (
                <div className="flex items-center gap-2 text-primary">
                  <Droplet className="w-5 h-5 fill-current" />
                  <span className="text-xl font-bold">{userData.bloodType}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Informations</CardTitle>
            <CardDescription>Détails de votre profil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{userData.email}</p>
              </div>
            </div>

            {role === "donor" && userData.phone && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{userData.phone}</p>
                </div>
              </div>
            )}

            {role === "doctor" && userData.hospital && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Hôpital</p>
                  <p className="font-medium">{userData.hospital}</p>
                </div>
              </div>
            )}

            {role === "blood_bank" && (
              <>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Nom de la banque</p>
                    <p className="font-medium">{userData.bankName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Localisation</p>
                    <p className="font-medium">{userData.location}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Statistics Card for Donors */}
        {role === "donor" && (
          <Card className="shadow-lg border-primary border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary fill-current" />
                Historique des dons
              </CardTitle>
              <CardDescription>Votre impact en chiffres</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-primary/10">
                  <div className="text-3xl font-bold text-primary">12</div>
                  <div className="text-sm text-muted-foreground mt-1">Dons effectués</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-success/10">
                  <div className="text-3xl font-bold text-success">12</div>
                  <div className="text-sm text-muted-foreground mt-1">Vies sauvées</div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-gradient-hero text-white text-center">
                <p className="text-sm font-medium">Prochain don disponible dans</p>
                <p className="text-2xl font-bold mt-1">2 mois</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button variant="outline" size="lg" className="w-full">
            Modifier le profil
          </Button>
          <Button variant="destructive" size="lg" className="w-full" onClick={() => {
            localStorage.clear();
            navigate("/auth");
          }}>
            Se déconnecter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
