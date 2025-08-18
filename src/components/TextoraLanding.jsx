import React, { useState, useEffect } from "react";
import { FileText, Users, Zap, Shield, ArrowRight, Edit3, Globe, Clock } from "lucide-react";
import { useNavigate } from 'react-router-dom';
const TextoraLanding = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [typingText, setTypingText] = useState("");
  const fullText = "Write. Collaborate. Create.";

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoaded(true);
    let i = 0;
    const typeTimer = setInterval(() => {
      if (i < fullText.length) {
        setTypingText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typeTimer);
      }
    }, 100);

    return () => clearInterval(typeTimer);
  }, []);

  const createDocument = async () => {
    try {
      const response = await fetch(`${API_URL}/api/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Textora", content: "" }),
      });
      const data = await response.json();
      navigate(`/doc/${data.id}`); 
    } catch (error) {
      console.error("Error creating document:", error);
      alert("Failed to create document");
    }
  };

  const features = [
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Real-time Collaboration",
      description: "Work together with your team instantly. See changes as they happen, with live cursors and seamless synchronization."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: "Lightning Fast",
      description: "Experience blazing-fast performance with instant updates and minimal latency, no matter how many people are editing."
    },
    {
      icon: <Shield className="w-8 h-8 text-green-500" />,
      title: "Auto-Save & Persistence",
      description: "Never lose your work. Everything is automatically saved to the database and accessible from anywhere."
    },
    {
      icon: <Globe className="w-8 h-8 text-purple-500" />,
      title: "Universal Access",
      description: "Access your documents from any device, anywhere. Share with anyone using a simple link."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-10 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>


      <header className="relative z-10 p-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Edit3 className="w-8 h-8 text-blue-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Textora
          </h1>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="#features" className="hover:text-blue-300 transition-colors">Features</a>
          <a href="#about" className="hover:text-blue-300 transition-colors">About</a>
          <a href="#contact" className="hover:text-blue-300 transition-colors">Contact</a>
        </nav>
      </header>


      <main className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {typingText}
                <span className="animate-pulse">|</span>
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              The next-generation collaborative text editor that brings teams together. 
              Edit documents simultaneously with real-time synchronization and persistent storage.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={createDocument}
                className="group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-2"
              >
                <FileText className="w-5 h-5" />
                <span>Start Writing Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 max-w-4xl mx-auto mb-20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Live collaboration</span>
                </div>
              </div>
              <div className="text-left space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">Alex is typing...</span>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                    <span className="text-sm text-gray-400">Sarah</span>
                  </div>
                  <p className="text-gray-200">"The new marketing strategy looks great! I've added some suggestions in the second paragraph."</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-400">Document saved automatically</span>
                </div>
              </div>
            </div>
          </div>

          <section id="features" className="mb-20">
            <h3 className="text-4xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Why Choose Textora?
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h4 className="text-xl font-semibold mb-3 text-white">{feature.title}</h4>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-lg border border-white/10 rounded-3xl p-12">
            <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ready to Transform Your Writing?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of teams already collaborating seamlessly with Textora. 
              Start your first document in seconds.
            </p>
            <button
              onClick={createDocument}
              className="group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-12 py-4 rounded-full font-semibold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-2 mx-auto"
            >
              <Edit3 className="w-6 h-6" />
              <span>Create Your First Document</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </section>
        </div>
      </main>

      <footer className="relative z-10 p-6 text-center text-gray-400 border-t border-white/10 mt-20">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Edit3 className="w-5 h-5 text-blue-400" />
          <span className="font-semibold text-blue-400">Textora</span>
        </div>
        <p>© 2025 Textora. Collaborative writing, reimagined.</p>
      </footer>
    </div>
  );
};

export default TextoraLanding;