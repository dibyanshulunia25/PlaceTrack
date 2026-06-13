import { SlideUp } from "@/components/ui/animation";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-24 max-w-4xl">
      <SlideUp>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Terms of Service
        </h1>
        <p className="text-muted-foreground mb-12">
          Last updated: October 2023
        </p>
      </SlideUp>

      <SlideUp delay={0.2}>
        <Card className="mb-12">
          <CardContent className="p-8 md:p-12 prose prose-gray dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="mb-6">
              By accessing and using PlaceTrack ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">2. Description of Service</h2>
            <p className="mb-6">
              PlaceTrack provides students with tools to manage job applications, prepare for interviews, and track placement activities. We reserve the right to modify or discontinue, temporarily or permanently, the Service with or without notice.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">3. User Conduct</h2>
            <p className="mb-6">
              You agree to use the Service only for lawful purposes. You are solely responsible for the knowledge and adherence to any and all laws, rules, and regulations pertaining to your use of the Service.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">4. Intellectual Property</h2>
            <p className="mb-6">
              The Service and its original content, features, and functionality are owned by PlaceTrack and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>
            
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Limitation of Liability</h2>
            <p>
              In no event shall PlaceTrack, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  );
}
