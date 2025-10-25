import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Hospital, Users, Plus, Bell, User, LogOut, Clock, CheckCircle2 } from "lucide-react";

type UserRole = "doctor" | "blood_bank" | "donor";

interface Request {
  id: string;
  bloodType: string;
  hospital: string;
  urgency: "urgent" | "normal";
  status: "pending" | "completed";
  date: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("donor");
  const [userName, setUserName] = useState("");
  const [requests, setRequests] = useState<Request[]>([
    {
      id: "1",
      bloodType: "O+",
      hospital: "Hôpital Central",
      urgency: "urgent",
      status: "pending",
      date: "Il y a 5 min",
    },
    {
      id: "2",
      bloodType: "A+",
      hospital: "Clinique du Nord",
      urgency: "normal",
      status: "pending",
      date: "Il y a 1h",
    },
  ]);

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      navigate("/auth");
      return;
    }

    const userRole = localStorage.getItem("userRole") as UserRole;
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    setRole(userRole);
    setUserName(userData.fullName || userData.bankName || "Utilisateur");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  const getRoleIcon = () => {
    switch (role) {
      case "doctor":
        return <Hospital className="w-6 h-6" />;
      case "blood_bank":
        return <Users className="w-6 h-6" />;
      default:
        return <Heart className="w-6 h-6" />;
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case "doctor":
        return "Docteur";
      case "blood_bank":
        return "Banque de sang";
      default:
        return "Donneur";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Header */}
      <div className="bg-card shadow-md">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                {getRoleIcon()}
              </div>
              <div>
                <h1 className="text-xl font-bold">{userName}</h1>
                <p className="text-sm text-muted-foreground">{getRoleLabel()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
                <User className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Quick Action */}
        {role === "doctor" && (
          <Card className="border-primary border-2 shadow-primary animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Nouvelle demande
              </CardTitle>
              <CardDescription>
                Créer une demande de sang pour un patient
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="hero" size="lg" className="w-full">
                Faire une demande
              </Button>
            </CardContent>
          </Card>
        )}

        {role === "blood_bank" && (
          <Card className="border-primary border-2 shadow-primary animate-slide-up">
            <CardHeader>
              <CardTitle>Demandes reçues</CardTitle>
              <CardDescription>
                Gérer les demandes et notifier les donneurs
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {role === "donor" && (
          <Card className="border-primary border-2 shadow-primary animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary fill-current" />
                Alertes de don
              </CardTitle>
              <CardDescription>
                Un patient a besoin de votre aide
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Requests List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            {role === "doctor" ? "Mes demandes" : role === "blood_bank" ? "Demandes actives" : "Alertes récentes"}
          </h2>
          
          {requests.map((request, index) => (
            <Card 
              key={request.id} 
              className="hover:shadow-md transition-smooth cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{request.bloodType}</span>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">{request.hospital}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {request.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {request.urgency === "urgent" && (
                      <Badge variant="destructive" className="animate-pulse">
                        Urgent
                      </Badge>
                    )}
                    
                    {request.status === "completed" ? (
                      <Badge className="bg-success text-success-foreground">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Complété
                      </Badge>
                    ) : role === "donor" ? (
                      <Button variant="hero" size="sm">
                        Je suis disponible
                      </Button>
                    ) : role === "blood_bank" ? (
                      <Button variant="default" size="sm">
                        Notifier les donneurs
                      </Button>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">{role === "donor" ? "12" : "47"}</div>
                <div className="text-sm text-muted-foreground">
                  {role === "donor" ? "Dons" : "Demandes"}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-success">{role === "donor" ? "12" : "35"}</div>
                <div className="text-sm text-muted-foreground">Complétées</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-warning">{role === "donor" ? "0" : "12"}</div>
                <div className="text-sm text-muted-foreground">En attente</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
