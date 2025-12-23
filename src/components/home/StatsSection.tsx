import { TrendingUp, Users, Home, Award } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: Home,
      value: "1,000+",
      label: "SOLD HOMES",
      description: "Successfully delivered to families",
    },
    {
      icon: TrendingUp,
      value: "1/2B",
      label: "$ IN SALES",
      description: "Total property value sold",
    },
    {
      icon: Users,
      value: "1,000+",
      label: "SATISFIED CUSTOMERS",
      description: "Happy families & investors",
    },
    {
      icon: Award,
      value: "15+",
      label: "YEARS EXPERIENCE",
      description: "In real estate excellence",
    },
  ];

  return (
    <section className="py-16 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center group animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-primary tracking-wider mb-1">
                {stat.label}
              </div>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
