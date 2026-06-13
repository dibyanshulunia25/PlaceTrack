import { Text, Button, Section, Heading, Hr } from "@react-email/components"
import { EmailLayout } from "./components/email-layout"
import * as React from "react"

interface FeedbackRequestEmailProps {
  candidateName: string
  companyName: string
  role: string
  eventType: string
}

export function FeedbackRequestEmail({ 
  candidateName, 
  companyName, 
  role, 
  eventType = "Event"
}: FeedbackRequestEmailProps) {
  return (
    <EmailLayout previewText={`How did your ${companyName} ${eventType} go? Help the community by sharing your experience.`}>
      <Heading className="text-black text-[22px] font-bold text-center p-0 my-[20px] mx-0 font-sans tracking-tight">
        How did it go?
      </Heading>
      
      <Text className="text-black text-[15px] leading-[26px] font-sans">
        Hi {candidateName},
      </Text>
      
      <Text className="text-black text-[15px] leading-[26px] font-sans">
        We hope your <strong>{eventType}</strong> with <strong>{companyName}</strong> for the <strong>{role}</strong> role went well!
      </Text>

      <Text className="text-black text-[15px] leading-[26px] font-sans">
        PlaceTrack is built on the power of community sharing. Now that you've been through it, your experience is incredibly valuable to others who might be preparing for the exact same process.
      </Text>
      
      <Section className="text-center mt-[32px] mb-[32px]">
        <Button 
          className="bg-[#2563eb] rounded-lg text-white text-[14px] font-semibold no-underline text-center px-6 py-3 shadow-md border-b-[3px] border-[#1d4ed8]"
          href={`https://placetrack.app/experiences/new`}
        >
          Share Your Experience
        </Button>
      </Section>
      
      <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
      
      <Text className="text-[#666666] text-[14px] leading-[24px] font-sans text-center">
        Whether you were asked tricky questions, faced a unique challenge, or just want to share some tips—your contribution makes a difference. You can also choose to post anonymously.
      </Text>
    </EmailLayout>
  )
}

export default FeedbackRequestEmail
