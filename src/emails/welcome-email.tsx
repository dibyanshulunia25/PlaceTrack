import { Text, Button, Section, Heading, Hr } from "@react-email/components"
import { EmailLayout } from "./components/email-layout"
import * as React from "react"

export function WelcomeEmail({ name }: { name: string }) {
  return (
    <EmailLayout previewText={`Welcome to PlaceTrack, ${name}!`}>
      <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0 font-sans tracking-tight">
        Welcome to <strong>PlaceTrack</strong>
      </Heading>
      
      <Text className="text-black text-[15px] leading-[26px] font-sans">
        Hi {name},
      </Text>
      
      <Text className="text-black text-[15px] leading-[26px] font-sans">
        We're thrilled to have you join our community! PlaceTrack helps you track applications, discover community interview experiences, and prepare for your next big role.
      </Text>
      
      <Section className="text-center mt-[32px] mb-[32px]">
        <Button 
          className="bg-[#2563eb] rounded-lg text-white text-[14px] font-semibold no-underline text-center px-6 py-3 shadow-md border-b-[3px] border-[#1d4ed8]"
          href="https://placetrack.app/dashboard"
        >
          Go to Dashboard
        </Button>
      </Section>
      
      <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
      
      <Text className="text-[#666666] text-[14px] leading-[24px] font-sans">
        If you have any questions, feel free to explore our public repository of experiences.
      </Text>
    </EmailLayout>
  )
}

export default WelcomeEmail
