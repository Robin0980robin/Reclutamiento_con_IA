// src/components/Footer.tsx

import { Brain, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfService from "./TermsOfService";
import { useI18n } from "@/hooks/use-i18n";

const Footer = () => {
  const { common, header } = useI18n();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-secondary/30">
      <div className="container mx-auto px-20 py-9">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Brain className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold">{common.appName}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {/* Texto estático, se puede añadir a i18n si es necesario */}
              Transformando el reclutamiento con inteligencia artificial para conectar el mejor talento con las mejores oportunidades.
            </p>
          </div>

          {/* Producto */}
          <div>
            <h4 className="mb-4 font-semibold">Producto</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/caracteristicas" className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {header.features}
                </Link>
              </li>
              <li>
                <Link to="/para-quien" className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {header.forWho}
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {common.demo}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <PrivacyPolicy asLink>
                  <button className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-sm">
                    {common.privacyPolicy}
                  </button>
                </PrivacyPolicy>
              </li>
              <li>
                <TermsOfService asLink>
                  <button className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-sm">
                    {common.termsOfUse}
                  </button>
                </TermsOfService>
              </li>
              <li>
                <Link to="/acerca-de" className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {common.aboutUs}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="mb-4 font-semibold">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{common.contactEmail}</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{common.contactPhone}</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{common.contactAddress}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} {common.appName}. {common.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;