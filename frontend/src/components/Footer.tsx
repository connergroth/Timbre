import { Github, Mail } from "lucide-react";
import { SpotifyStatus } from "./SpotifyStatus";
import { ThemeSelector } from "./ThemeSelector";

export const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="font-playfair text-2xl font-bold text-primary">
              Timbre
            </div>
            <div className="flex space-x-3">
              <a 
                href="https://github.com/connergroth/timbre" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors group"
              >
                <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="mailto:connergroth@gmail.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors group"
              >
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://open.spotify.com/user/connergroth" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </a>
            </div>
            <div className="flex justify-start">
              <ThemeSelector />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-playfair font-semibold text-foreground">Product</h4>
            <div className="space-y-2 text-sm">
              <div className="block">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  How it works
                </a>
              </div>
              <div className="block">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </a>
              </div>
              <div className="block">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-playfair font-semibold text-foreground">Company</h4>
            <div className="space-y-2 text-sm">
              <div className="block">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </a>
              </div>
              <div className="block">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </a>
              </div>
              <div className="block">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-playfair font-semibold text-foreground">Legal</h4>
            <div className="space-y-2 text-sm">
              <div className="block">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </a>
              </div>
              <div className="block">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center space-y-1">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Timbre. All rights reserved.
          </p>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-muted-foreground text-sm">Made by Conner Groth:</span>
            <SpotifyStatus username="connergroth" />
          </div>
        </div>
      </div>
    </footer>
  );
};