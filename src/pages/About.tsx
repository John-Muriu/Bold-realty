import { Link } from "react-router-dom";
import { Target, Eye, Heart, Award, Users, TrendingUp, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for excellence in everything we do, ensuring the highest standards in real estate services.",
    },
    {
      icon: Heart,
      title: "Integrity",
      description: "Honesty and transparency are at the core of our business. We build trust through ethical practices.",
    },
    {
      icon: Users,
      title: "Client-Centric",
      description: "Our clients are our priority. We go above and beyond to understand and meet their unique needs.",
    },
    {
      icon: Eye,
      title: "Innovation",
      description: "We embrace technology and innovative solutions to provide a seamless real estate experience.",
    },
  ];

  const stats = [
    { value: "15+", label: "Years Experience" },
    { value: "1,000+", label: "Properties Sold" },
    { value: "500M+", label: "KSh in Sales" },
    { value: "98%", label: "Client Satisfaction" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="py-16 section-dark">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
                About Us
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Building Dreams,{" "}
                <span className="text-gradient-gold">One Home</span> at a Time
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                NdetoHomes is a leading real estate agency in Kenya, dedicated to helping families and investors find their perfect properties. With over 15 years of experience, we've built a reputation for excellence, integrity, and exceptional service.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-card border-y border-border -mt-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="font-display text-3xl md:text-4xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="bg-card rounded-2xl border border-border p-8 shadow-card">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Our Mission
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  To be the most trusted and preferred real estate partner in Kenya, providing exceptional service and creating lasting value for our clients. We are committed to making the property buying, selling, and renting process seamless, transparent, and rewarding.
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-8 shadow-card">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Eye className="w-8 h-8 text-primary" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Our Vision
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  To transform the real estate landscape in East Africa by setting new standards of excellence, innovation, and customer satisfaction. We envision a future where every family has access to quality housing and every investor finds profitable opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Our Values
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                What Drives Us
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our core values guide every interaction and decision we make
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl border border-border p-6 shadow-card text-center group hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <value.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  Why Choose Us
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Your Trusted Partner in Real Estate
                </h2>
                <p className="text-muted-foreground mb-8">
                  With a proven track record of success and a deep understanding of the Kenyan property market, we offer unparalleled expertise and personalized service to meet your real estate needs.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Award className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground">Award-winning real estate services</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground">Experienced team of professionals</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground">Market-leading property insights</span>
                  </li>
                </ul>
                <Button variant="gold" size="lg" asChild>
                  <Link to="/contact">
                    Get in Touch
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>

              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
                  alt="Real estate team"
                  className="rounded-2xl shadow-elevated"
                />
                <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-2xl shadow-gold">
                  <div className="font-display text-4xl font-bold">15+</div>
                  <div className="text-sm">Years of Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
