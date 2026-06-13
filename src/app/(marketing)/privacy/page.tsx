import { SlideUp } from "@/components/ui/animation";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-24 max-w-4xl">
      <SlideUp>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mb-12">
          Last updated: October 2023
        </p>
      </SlideUp>

      <SlideUp delay={0.2}>
        <Card className="mb-12">
          <CardContent className="p-8 md:p-12 prose prose-gray dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
            <p className="mb-6">
              When you use PlaceTrack, we collect information you provide directly to us, such as your name, email address, educational background, and placement-related data (e.g., job applications, interview notes, and assessment schedules).
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
            <p className="mb-6">
              We use the information we collect to operate, maintain, and provide you with the features and functionality of the Service. We also use this information to communicate with you, such as sending you reminders and updates.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">3. Data Security</h2>
            <p className="mb-6">
              We care about the security of your information and use commercially reasonable physical, administrative, and technological safeguards to preserve the integrity and security of all information collected through our Service. However, no security system is impenetrable and we cannot guarantee the security of our systems 100%.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">4. Sharing of Information</h2>
            <p className="mb-6">
              We do not sell, rent, or share your personal information with third parties for their commercial purposes. We may share your information with third-party service providers who help us operate our Service, but they are bound by confidentiality agreements.
            </p>
            
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Your Choices</h2>
            <p>
              You can access, update, or delete your account information at any time by logging into your account settings. If you have any questions about this Privacy Policy, please contact us.
            </p>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  );
}
