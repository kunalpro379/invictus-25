import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full py-6 bg-blue-950/20 border-t">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Hackathon Starter</h3>
            <p className="text-sm text-gray-500">
              Modern, responsive components for your next hackathon project.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-500 hover:text-primary">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-primary">
                  Components
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-primary">
                  Examples
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-primary">
                  Templates
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-500 hover:text-primary">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-primary">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-primary">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-primary">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-500 hover:text-primary">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-primary">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-primary">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Hackathon Starter. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-4 sm:mt-0">
            Made with ❤️ for developers
          </p>
        </div>
      </div>
    </footer>
  );
}
