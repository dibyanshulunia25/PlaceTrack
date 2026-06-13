import { Text, Section, Heading, Hr } from "@react-email/components"
import { EmailLayout } from "./components/email-layout"
import * as React from "react"

interface GoodLuckEmailProps {
  candidateName: string
  companyName: string
  eventType: string
}

export function GoodLuckEmail({ 
  candidateName, 
  companyName, 
  eventType = "Upcoming Event"
}: GoodLuckEmailProps) {
  return (
    <EmailLayout previewText={`It's time! Good luck with your ${companyName} ${eventType} today.`}>
      <Section className="text-center">
        <Text className="text-[50px] leading-none m-0 p-0 mb-4">🚀</Text>
      </Section>
      <Heading className="text-black text-[24px] font-bold text-center p-0 mt-[10px] mb-[20px] mx-0 font-sans tracking-tight">
        You've Got This!
      </Heading>
      
      <Text className="text-black text-[15px] leading-[26px] font-sans text-center">
        Hi {candidateName},
      </Text>
      
      <Text className="text-black text-[15px] leading-[26px] font-sans text-center">
        Today is the day of your <strong>{companyName} {eventType}</strong>. We know you've put in the hard work and preparation.
      </Text>

      <Text className="text-black text-[15px] leading-[26px] font-sans text-center font-bold my-6">
        Step in with confidence, be yourself, and show them what you can do.
      </Text>
      
      <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
      
      <Text className="text-[#666666] text-[14px] leading-[24px] font-sans text-center">
        We are rooting for you. Best of luck!
      </Text>
    </EmailLayout>
  )
}

export default GoodLuckEmail
