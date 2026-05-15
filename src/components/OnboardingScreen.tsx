import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, PiggyBank, Users, Shield, ArrowRight, CheckCircle2, ChevronDown, Sun, Moon } from 'lucide-react';
import Logo from './Logo';

interface OnboardingScreenProps {
  onNavigate: (screen: 'signup' | 'login') => void;
}

export default function OnboardingScreen({ onNavigate }: OnboardingScreenProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if(nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const faqs = [
    {
      question: "Is my money safe with PAVE?",
      answer: "Absolutely. PAVE uses bank-grade encryption and is licensed by the Central Bank of Nigeria. Your funds are held securely and insured."
    },
    {
      question: "What is KYC and why is it required?",
      answer: "KYC (Know Your Customer) verification confirms your identity using your BVN and NIN. This protects you from fraud and is required by regulation before you can make transactions."
    },
    {
      question: "Can I withdraw my savings anytime?",
      answer: "Flexible savings can be withdrawn anytime. Fixed savings have a lock period, and early withdrawal incurs a small penalty."
    },
    {
      question: "How does Thrift (Ajo) work?",
      answer: "You contribute a fixed amount at regular intervals (daily, weekly, or monthly). After a set period, you receive your total contributions. Missing contributions may incur penalties."
    },
    {
      question: "What payment methods do you accept?",
      answer: "You can fund your wallet via debit/credit card, bank transfer, or USSD. Withdrawals are sent directly to your verified bank account."
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col antialiased font-sans text-on-background overflow-x-hidden scrollbar-hide transition-colors duration-300">
      
      {/* Background Graphic */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:24px_24px] opacity-20 dark:opacity-30"></div>
      
      {/* Illuminated Grid Hover Effect */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-100 transition-opacity duration-0"
        style={{
          backgroundImage: `radial-gradient(rgba(139, 92, 246, 0.8) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          WebkitMaskImage: `radial-gradient(200px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
          maskImage: `radial-gradient(200px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
        }}
      ></div>
      
      {/* Top Brand/Nav */}
      <header className="w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto relative z-10">
        <Logo size="md" />
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-variant/50"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => onNavigate('login')}
            className="hidden md:block text-on-surface-variant hover:text-primary font-medium text-sm transition-colors"
          >
            Log In
          </button>
          <button 
            onClick={() => onNavigate('signup')}
            className="bg-primary hover:bg-primary/90 text-on-primary font-semibold py-2 px-5 rounded-full opacity-90 transition-all text-sm shadow-md hover:shadow-lg active:scale-95"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full px-6 py-24 flex flex-col items-center text-center max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center justify-center px-4 py-2 bg-surface border border-outline-variant/50 text-on-surface-variant text-sm font-medium rounded-full shadow-sm backdrop-blur-sm"
        >
          <span className="mr-2">🚀</span> Building Financial Discipline
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl md:text-8xl font-display font-extrabold text-on-background mb-8 leading-[1.05] tracking-tight"
        >
          Save Smarter.<br/>Grow Together.<br/><span className="text-primary opacity-90">Build Wealth.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-12 font-light leading-relaxed"
        >
          PAVE is your digital wallet for savings and traditional thrift contributions (Ajo/Esusu). Build financial discipline with automated savings and community-powered growth.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-6 z-10 w-full sm:w-auto"
        >
          <button 
            onClick={() => onNavigate('signup')}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-on-primary font-bold py-4 px-10 rounded-full uppercase tracking-wider text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95"
          >
            Get Started Free
          </button>
          <button 
            onClick={() => onNavigate('login')}
            className="w-full sm:w-auto bg-transparent hover:bg-surface-variant/30 text-on-background font-bold py-4 px-10 rounded-full border-2 border-on-background uppercase tracking-wider text-sm transition-all hover:-translate-y-1 active:scale-95"
          >
            Log in to your account
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-wrap justify-center items-center gap-8 mt-16 text-sm text-on-surface-variant font-medium uppercase tracking-widest"
        >
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Bank-grade Security</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> CBN Licensed</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> 24/7 Support</span>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="w-full px-6 py-24 bg-surface z-10 relative border-y border-outline-variant/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-on-background mb-6 tracking-tight">Everything You Need to Save & Grow</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto text-lg font-light">
              From your digital wallet to traditional thrift contributions, PAVE has all the tools you need to build lasting financial habits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-surface p-8 shadow-md rounded-2xl border border-outline-variant/40 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="text-primary mb-6">
                <Wallet size={36} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-3">Digital Wallet</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed font-light">Fund your wallet instantly via card, USSD, or bank transfer. Withdraw anytime.</p>
            </div>
            <div className="bg-surface p-8 shadow-md rounded-2xl border border-outline-variant/40 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="text-primary mb-6">
                <PiggyBank size={36} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-3">Smart Savings</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed font-light">Create flexible or fixed savings plans with automated deposits and competitive interest.</p>
            </div>
            <div className="bg-surface p-8 shadow-md rounded-2xl border border-outline-variant/40 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="text-primary mb-6">
                <Users size={36} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-3">Thrift (Ajo/Esusu)</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed font-light">Join or create traditional contribution groups. Build wealth together with your community.</p>
            </div>
            <div className="bg-surface p-8 shadow-md rounded-2xl border border-outline-variant/40 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="text-primary mb-6">
                <Shield size={36} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-3">Secure & Verified</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed font-light">Bank-grade encryption with mandatory KYC verification for complete peace of mind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Split 1 - Savings */}
      <section className="w-full px-6 py-24 max-w-7xl mx-auto overflow-hidden relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 w-full relative">
            <div className="inline-block px-4 py-1.5 rounded-full bg-surface border border-outline-variant/50 text-on-surface text-xs font-bold uppercase tracking-widest mb-6">
              Savings
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-on-background mb-6 tracking-tight">Save for What Matters Most</h2>
            <p className="text-xl text-on-surface-variant mb-10 leading-relaxed font-light max-w-lg">
              Whether it's an emergency fund, a new car, or your dream vacation, PAVE helps you reach your goals faster with smart automated savings.
            </p>
            
            <ul className="space-y-6 mb-12 w-full font-light">
              <li className="flex items-start gap-4 text-on-surface">
                <div className="bg-primary/10 p-1 rounded-full"><CheckCircle2 size={20} className="text-primary" /></div>
                <span>Flexible savings - withdraw anytime</span>
              </li>
              <li className="flex items-start gap-4 text-on-surface">
                <div className="bg-primary/10 p-1 rounded-full"><CheckCircle2 size={20} className="text-primary" /></div>
                <span>Fixed savings with higher interest rates</span>
              </li>
              <li className="flex items-start gap-4 text-on-surface">
                <div className="bg-primary/10 p-1 rounded-full"><CheckCircle2 size={20} className="text-primary" /></div>
                <span>Auto-debit from your wallet</span>
              </li>
            </ul>

            <button 
              onClick={() => onNavigate('signup')}
              className="bg-on-background hover:bg-on-background/90 text-background font-bold py-4 px-8 rounded-full uppercase tracking-wider text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95"
            >
              Start Saving Today
            </button>
          </div>

          <div className="flex-1 w-full flex justify-center">
            {/* Minimalist Visualizer */}
            <div className="w-full max-w-md bg-surface rounded-[2rem] p-10 relative border-2 border-outline-variant/50 shadow-2xl">
              <div className="flex justify-between items-end mb-6 border-b border-outline-variant pb-4">
                <div>
                  <div className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">Emergency Fund</div>
                  <div className="text-4xl font-display font-extrabold text-on-surface mb-1">₦185,000</div>
                </div>
                <div className="text-primary text-xl font-extrabold">37%</div>
              </div>
              <div className="text-on-surface-variant text-sm mb-4 font-light">Goal: ₦500,000</div>
              
              <div className="h-4 w-full bg-surface-variant rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[37%]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full px-6 py-24 bg-surface z-10 relative border-y border-outline-variant/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-on-background mb-4 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-on-surface-variant text-lg font-light">Got questions? We've got answers.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-surface border border-outline-variant/40 rounded-2xl overflow-hidden hover:border-on-background transition-colors duration-300">
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-on-surface text-lg"
                >
                  {faq.question}
                  <ChevronDown size={20} className={`text-on-surface-variant transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-6 text-on-surface-variant text-base leading-relaxed font-light">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-6 py-32 z-10 relative mb-8">
        <div className="max-w-4xl mx-auto bg-primary rounded-[3rem] p-12 md:p-20 text-center relative shadow-2xl">
          <h2 className="text-4xl md:text-6xl font-display font-extrabold text-on-primary mb-6 tracking-tight leading-[1.1]">Ready to Start Your Financial Journey?</h2>
          <p className="text-on-primary/90 max-w-2xl mx-auto text-xl mb-12 font-light">
            Join thousands of Nigerians building wealth with PAVE. Create your free account in minutes.
          </p>
          
          <button 
            onClick={() => onNavigate('signup')}
            className="bg-background text-on-background font-bold py-5 px-10 rounded-full uppercase tracking-wider text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 inline-flex items-center"
          >
            Create Free Account <ArrowRight size={20} className="ml-2" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t-2 border-outline-variant/50 bg-surface z-10 relative">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <Logo size="md" className="mb-6 justify-start" />
              <p className="text-sm text-on-surface-variant font-light leading-relaxed">
                Building financial discipline through smart savings and cultural community contributions.
              </p>
            </div>
            
            <div className="md:ml-auto">
              <h4 className="font-bold text-on-surface mb-6 uppercase tracking-widest text-sm">Product</h4>
              <ul className="space-y-4 text-sm text-on-surface-variant font-light">
                <li><a href="#" className="hover:text-primary transition-colors">Wallet</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Savings</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Thrift (Ajo)</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>
            
            <div className="md:ml-auto">
              <h4 className="font-bold text-on-surface mb-6 uppercase tracking-widest text-sm">Company</h4>
              <ul className="space-y-4 text-sm text-on-surface-variant font-light">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div className="md:ml-auto">
              <h4 className="font-bold text-on-surface mb-6 uppercase tracking-widest text-sm">Legal</h4>
              <ul className="space-y-4 text-sm text-on-surface-variant font-light">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-outline-variant/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant uppercase tracking-widest">
            <div>© {new Date().getFullYear()} PAVE. All rights reserved.</div>
            <div>Licensed by the Central Bank of Nigeria</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
