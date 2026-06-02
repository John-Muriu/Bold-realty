import { useState } from "react";
import { Phone, Mail, MapPin, Send, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("inquiries").insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
    });

    if (error) {
      toast.error("Failed to send message. Please try again.");
    } else {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Get in Touch
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Contact Us
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions about a property or need help finding your dream home? Our team is here to assist you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-card rounded-2xl border border-border p-8 shadow-card">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <Input
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-12"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone
                    </label>
                    <Input
                      placeholder="+254 XXX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-12"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <Textarea
                    required
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                  />
                </div>
                <Button variant="gold" size="lg" type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Quick Contact */}
              <div className="bg-card rounded-2xl border border-border p-8 shadow-card">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                  Quick Contact
                </h2>
                <div className="space-y-6">
                  <a
                    href="tel:+254725316343"
                    className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                      <p className="text-muted-foreground">+254 725 316 343</p>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/254725316343"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">WhatsApp</h3>
                      <p className="text-muted-foreground">Chat with us instantly</p>
                    </div>
                  </a>

                  <a
                    href="mailto:info@boldrealty.co.ke"
                    className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 hover:bg-blue-500/10 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <p className="text-muted-foreground">info@boldrealty.co.ke</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Office Location */}
              <div className="bg-card rounded-2xl border border-border p-8 shadow-card">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                  Visit Our Office
                </h2>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Office Address</h3>
                    <p className="text-muted-foreground">
                      Kilimani,<br />
                      Nairobi Kenya
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.817431772399!2d36.78789911475395!3d-1.2863898990655587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d0a8c7c0db%3A0x7f0c3c3c3c3c3c3c!2sKilimani%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1234567890123"
                    className="w-full h-48 rounded-xl border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
