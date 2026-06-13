import { Text, Button, Section, Heading, Hr } from "@react-email/components"
import { EmailLayout } from "./components/email-layout"
import * as React from "react"

interface T2ReminderProps {
  candidateName: string
  companyName: string
  role: string
  eventType: string
  date: string
  time: string
}

export function T2ReminderEmail({ 
  candidateName, 
  companyName, 
  role, 
  eventType = "Upcoming Event",
  date, 
  time 
}: T2ReminderProps) {
  return (
    <EmailLayout previewText={`Preparation time! Your ${companyName} ${eventType} is in 2 days.`}>
      <Heading className="text-black text-[22px] font-bold text-center p-0 my-[20px] mx-0 font-sans tracking-tight">
        2 Days Until Your {companyName} {eventType}
      </Heading>
      
      <Text className="text-black text-[15px] leading-[26px] font-sans">
        Hi {candidateName},
      </Text>
      
      <Text className="text-black text-[15px] leading-[26px] font-sans">
        This is a quick reminder that your <strong>{eventType}</strong> for the <strong>{role}</strong> role at <strong>{companyName}</strong> is scheduled in just two days!
      </Text>
      
      <Section className="bg-[#f8fafc] rounded-lg p-5 border border-solid border-[#e2e8f0] my-6">
        <Text className="text-black text-[15px] leading-[26px] font-sans m-0">
          📅 <strong>Date:</strong> {date}<br/>
          ⏰ <strong>Time:</strong> {time}
        </Text>
      </Section>

      <Text className="text-black text-[15px] leading-[26px] font-sans">
        Now is the perfect time to review community experiences for {companyName} and brush up on any relevant topics. Check out PlaceTrack's repository to see what others have faced during similar events!
      </Text>
      
      <Section className="text-center mt-[32px] mb-[32px]">
        <Button 
          className="bg-[#2563eb] rounded-lg text-white text-[14px] font-semibold no-underline text-center px-6 py-3 shadow-md border-b-[3px] border-[#1d4ed8]"
          href={`https://placetrack.app/experiences/${encodeURIComponent(companyName)}`}
        >
          View {companyName} Experiences
        </Button>
      </Section>
      
      <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
      
      <Text className="text-[#666666] text-[14px] leading-[24px] font-sans">
        You've got this! We'll send you one more quick checklist tomorrow.
      </Text>
    </EmailLayout>
  )
}

export default T2ReminderEmail
