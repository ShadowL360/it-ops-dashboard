import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Server } from "lucide-react";
import { useAuth } from "@/lib/auth";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-2 text-primary font-heading font-bold">
            <Server className="h-6 w-6" />
            <span className="text-xl">IT Operação</span>
          </a>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Entrar
            </Button>
            <Button onClick={() => navigate("/signup")}>
              Registrar
            </Button>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            Serviços de IT Operação para o seu negócio
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10">
            Monitorização, automatização e gestão de infraestrutura com foco em resultados para que possa focar no seu negócio
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
              onClick={() => navigate("/signup")}
            >
              Comece Agora
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Saiba Mais
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading mb-4">Porquê IT Operação</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Soluções completas que impulsionam a sua empresa e garantem operações de TI sem problemas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Redução de Custos</h3>
              <p className="text-muted-foreground">
                Minimize os gastos com infraestrutura e pessoal técnico dedicado. A nossa solução permite que pague apenas pelo que utiliza.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Especialistas Dedicados</h3>
              <p className="text-muted-foreground">
                Tenha acesso a uma equipa de especialistas com conhecimentos avançados em tecnologias modernas de monitorização e operações.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Foco no Negócio</h3>
              <p className="text-muted-foreground">
                Concentre-se no crescimento da sua empresa enquanto cuidamos da sua infraestrutura tecnológica com total tranquilidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-heading mb-6">
            Pronto para otimizar suas operações de TI?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Junte-se a mais de 200 empresas que confiam em nossos serviços para 
            impulsionar seus resultados e manter sua infraestrutura funcionando sem problemas.
          </p>
          <Button size="lg" onClick={() => navigate("/signup")}>
            Comece Gratuitamente
          </Button>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 text-white font-heading font-bold mb-4">
                <Server className="h-6 w-6" />
                <span className="text-xl">IT Operação</span>
              </div>
              <p className="text-gray-400 mb-4">
                Fornecemos serviços de monitorização, automatização e gestão de infraestrutura de TI para empresas de todos os tamanhos.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Serviços</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Monitorização</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Automatização</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Chatbots</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Job Scheduling</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Sobre</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Equipe</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Carreiras</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <address className="not-italic text-gray-400">
                <p>Av. da Liberdade 110</p>
                <p>Lisboa, Portugal</p>
                <p className="mt-2">contacto@itoperacao.pt</p>
                <p>+351 123 456 789</p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 IT Operação. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
