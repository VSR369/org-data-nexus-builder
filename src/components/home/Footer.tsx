
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  ArrowUp
} from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections = {
    quickLinks: [
      { label: "About Us", href: "/about" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Challenges", href: "/challenges" },
      { label: "Solutions", href: "/solutions" },
      { label: "Success Stories", href: "/success-stories" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Help Center", href: "/help" }
    ],
    forSeekers: [
      { label: "Launch a Challenge", href: "/launch-challenge" },
      { label: "Browse Solutions", href: "/browse-solutions" },
      { label: "Seeker Resources", href: "/seeker-resources" },
      { label: "Pricing", href: "/pricing" },
      { label: "Enterprise Solutions", href: "/enterprise" }
    ],
    forProviders: [
      { label: "Join as Provider", href: "/register" },
      { label: "Browse Challenges", href: "/browse-challenges" },
      { label: "Provider Tools", href: "/provider-tools" },
      { label: "Learning Center", href: "/learning" },
      { label: "Community Forum", href: "/community" }
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Data Protection", href: "/data-protection" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Intellectual Property", href: "/ip-policy" }
    ]
  };

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: "#", label: "Facebook" },
    { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
    { icon: <Linkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" },
    { icon: <Youtube className="h-5 w-5" />, href: "#", label: "YouTube" }
  ];

  return (
    <footer className="bg-muted/30 border-t">
      {/* Newsletter Section */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="mb-6 opacity-90 max-w-xl mx-auto">
            Get the latest challenges, success stories, and platform updates delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              placeholder="Enter your email" 
              className="bg-primary-foreground text-foreground"
            />
            <Button variant="secondary" className="hover-scale">
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">CI</span>
              </div>
              <span className="font-bold text-xl">CoInnovator</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Connecting problem solvers with problem owners to create innovative solutions for real-world challenges.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@coinnovator.com</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerSections.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm story-link"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Seekers */}
          <div>
            <h4 className="font-semibold mb-4">For Seekers</h4>
            <ul className="space-y-2">
              {footerSections.forSeekers.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm story-link"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h4 className="font-semibold mb-4">For Providers</h4>
            <ul className="space-y-2">
              {footerSections.forProviders.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm story-link"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerSections.legal.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm story-link"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 CoInnovator. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="text-muted-foreground hover:text-foreground transition-colors hover-scale"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Back to Top */}
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToTop}
            className="hover-scale"
          >
            <ArrowUp className="h-4 w-4 mr-2" />
            Back to Top
          </Button>
        </div>
      </div>
    </footer>
  );
};
