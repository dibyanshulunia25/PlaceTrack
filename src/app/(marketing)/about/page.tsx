import { SlideUp } from "@/components/ui/animation";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-24 max-w-4xl">
      <SlideUp>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          About PlaceTrack
        </h1>
        <p className="text-xl text-muted-foreground mb-12">
          PlaceTrack was built to solve a problem every student faces: the chaos of placement season.
        </p>
      </SlideUp>

      <SlideUp delay={0.2}>
        <Card className="mb-12">
          <CardContent className="p-8 md:p-12 prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We believe that securing your dream job shouldn't be hampered by logistical nightmares. Juggling dozens of applications, multiple coding assessment platforms, and back-to-back interviews is stressful enough. PlaceTrack exists to streamline that entire process.
            </p>
            <h2 className="text-2xl font-bold mb-4">Why We Built This</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              After watching countless peers lose track of deadlines, forget to follow up, and struggle to manage their preparation resources, we realized there had to be a better way than a complex spreadsheet. PlaceTrack is the all-in-one dashboard we wish we had during our own placement journeys.
            </p>
            <h2 className="text-2xl font-bold mb-4">The Future</h2>
            <p className="text-muted-foreground leading-relaxed">
              We are constantly evolving the platform. From intelligent application tracking to AI-assisted interview preparation, PlaceTrack is committed to giving students the ultimate edge in a competitive job market.
            </p>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  );
}
