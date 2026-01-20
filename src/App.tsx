import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { FontSizeProvider } from "@/contexts/FontSizeContext";
import { ButtonSizeProvider } from "@/contexts/ButtonSizeContext";
import { LetterSpacingProvider } from "@/contexts/LetterSpacingContext";
import { AutoplayBlockProvider } from "@/contexts/AutoplayBlockContext";
import { SpeechReaderProvider } from "@/contexts/SpeechReaderContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { DataProvider } from "@/contexts/DataContext"; 
import ProtectedRoute from "@/components/ProtectedRoute"; 
import AccessibilityWidgets from "@/components/AccessibilityWidgets";
import Index from "./pages/Index";
import Caracteristicas from "./pages/Caracteristicas";
import ParaQuien from "./pages/ParaQuien";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard"; 
import CandidateDashboard from "./pages/CandidateDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AccessibilityProvider>
      <ThemeProvider>
        <FontSizeProvider>
          <ButtonSizeProvider>
            <LetterSpacingProvider>
              <AutoplayBlockProvider>
                <SpeechReaderProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <AccessibilityWidgets />
                    <BrowserRouter>
                      <AuthProvider>
                        <DataProvider> 
                          <Routes>
                            {/* Rutas Públicas */}
                            <Route path="/" element={<Index />} />
                            <Route path="/caracteristicas" element={<Caracteristicas />} />
                            <Route path="/para-quien" element={<ParaQuien />} />
                            <Route path="/contacto" element={<Contacto />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password" element={<ResetPassword />} />
                            
                            {/* Rutas Protegidas (Requieren Login) */}
                            <Route element={<ProtectedRoute />}>
                              <Route path="/profile" element={<Profile />} />
                              
                              {/* Ruta de Dashboard para RECLUTADORES */}
                              <Route 
                                path="/dashboard" 
                                element={<ProtectedRoute requiredRole="reclutador" />}
                              >
                                <Route index element={<Dashboard />} /> 
                              </Route>
                              
                              {/* Ruta de Dashboard para CANDIDATOS */}
                              <Route 
                                path="/candidato-dashboard" 
                                element={<ProtectedRoute requiredRole="candidato" />}
                              >
                                <Route index element={<CandidateDashboard />} /> 
                              </Route>
                            </Route>

                            {/* Catch-All Route */}
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </DataProvider>
                      </AuthProvider>
                    </BrowserRouter>
                  </TooltipProvider>
                </SpeechReaderProvider>
              </AutoplayBlockProvider>
            </LetterSpacingProvider>
          </ButtonSizeProvider>
        </FontSizeProvider>
      </ThemeProvider>
    </AccessibilityProvider>
  </QueryClientProvider>
);

export default App;
