import { Mail, Phone, MapPin, Clock, Send, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: Mail,
    title: "Correo electrónico",
    content: "talentmatch@gmail.com",
    description: "Respuesta en menos de 24 horas"
  },
  {
    icon: Phone,
    title: "Teléfono",
    content: "(+593) 123-456-789",
    description: "Lunes a Viernes, 9:00 - 18:00"
  },
  {
    icon: MapPin,
    title: "Ubicación",
    content: "Manabí, Ecuador",
    description: "Servicio disponible en todo Ecuador"
  },
  {
    icon: Clock,
    title: "Horario de atención",
    content: "Lunes - Viernes",
    description: "9:00 AM - 6:00 PM (GMT-5)"
  }
];

const faqs = [
  {
    question: "¿Cómo funciona el análisis de CVs con IA?",
    answer: "Nuestra IA utiliza algoritmos avanzados de procesamiento de lenguaje natural para extraer habilidades, experiencia y competencias de los currículums, proporcionando un análisis detallado y preciso."
  },
  {
    question: "¿Es seguro subir mi información personal?",
    answer: "Absolutamente. Utilizamos encriptación de extremo a extremo y cumplimos con todas las normativas de protección de datos. Tu información está completamente segura."
  },
  {
    question: "¿Cuánto tiempo toma encontrar candidatos ideales?",
    answer: "Con TalentMatch, puedes recibir candidatos preseleccionados en menos de 24 horas, reduciendo el tiempo de reclutamiento hasta un 85%."
  },
  {
    question: "¿Hay algún costo para los candidatos?",
    answer: "No, nuestro servicio es completamente gratuito para candidatos. Solo las empresas pagan por acceder a la plataforma."
  }
];

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    empresa: "",
    telefono: "",
    asunto: "",
    mensaje: "",
    tipo: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular envío del formulario
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "¡Mensaje enviado!",
        description: "Te contactaremos pronto. Gracias por tu interés en TalentMatch."
      });
      setFormData({
        nombre: "",
        email: "",
        empresa: "",
        telefono: "",
        asunto: "",
        mensaje: "",
        tipo: ""
      });
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 md:py-22">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
              <Mail className="h-4 w-4" />
              Contacto
            </div>
            
            <h1 className="mb-5 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              ¿Tienes alguna pregunta?
            </h1>
            
            <p className="mb-2 text-lg text-muted-foreground md:text-xl">
              Estamos aquí para ayudarte. Contáctanos y te responderemos lo antes posible.
            </p>
            
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-center">
              <Link to="/">
                <Button variant="hero" size="lg" className="group">
                  <ArrowLeft className="mr-2 h- w-2 transition-transform group-hover:-translate-x-1" />
                  Volver al inicio
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative gradient blobs */}
        <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 left-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </section>

      {/* Contact Info & Form */}
      <section className="py-1 md:py-1">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Information */}
            <div>
              <h2 className="mb-6 text-3xl font-bold">Información de contacto</h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Estamos disponibles para ayudarte con cualquier pregunta sobre TalentMatch. 
                Elige la forma más conveniente para contactarnos.
              </p>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="border-2 transition-all hover:border-primary hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-primary/10 p-3 text-primary">
                          <info.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{info.title}</h3>
                          <p className="text-lg font-medium text-primary">{info.content}</p>
                          <p className="text-sm text-muted-foreground">{info.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Enviar mensaje</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre completo *</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => handleInputChange("nombre", e.target.value)}
                        placeholder="Tu nombre completo"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="empresa">Empresa</Label>
                      <Input
                        id="empresa"
                        value={formData.empresa}
                        onChange={(e) => handleInputChange("empresa", e.target.value)}
                        placeholder="Nombre de tu empresa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        value={formData.telefono}
                        onChange={(e) => handleInputChange("telefono", e.target.value)}
                        placeholder="(+593) 123-456-789"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de consulta</Label>
                    <Select value={formData.tipo} onValueChange={(value) => handleInputChange("tipo", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de consulta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="empresa">Soy empresa - Quiero contratar talento</SelectItem>
                        <SelectItem value="candidato">Soy candidato - Busco oportunidades</SelectItem>
                        <SelectItem value="demo">Solicitar demo</SelectItem>
                        <SelectItem value="soporte">Soporte técnico</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="asunto">Asunto *</Label>
                    <Input
                      id="asunto"
                      value={formData.asunto}
                      onChange={(e) => handleInputChange("asunto", e.target.value)}
                      placeholder="¿En qué podemos ayudarte?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mensaje">Mensaje *</Label>
                    <Textarea
                      id="mensaje"
                      value={formData.mensaje}
                      onChange={(e) => handleInputChange("mensaje", e.target.value)}
                      placeholder="Cuéntanos más detalles sobre tu consulta..."
                      rows={4}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      "Enviando mensaje..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar mensaje
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contacto;
