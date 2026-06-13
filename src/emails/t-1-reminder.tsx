import { Text, Section, Heading, Hr } from "@react-email/components"
import { EmailLayout } from "./components/email-layout"
import * as React from "react"

interface T1ReminderProps {
  candidateName: string
  companyName: string
  role: string
  eventType: string
  time: string
}

export function T1ReminderEmail({ 
  candidateName, 
  companyName, 
  role, 
  eventType = "Upcoming Event",
  time 
}: T1ReminderProps) {
  return (
    <EmailLayout previewText={`Final checklist for your ${companyName} ${eventType} tomorrow!`}>
      <Heading className="text-black text-[22px] font-bold text-center p-0 my-[20px] mx-0 font-sans tracking-tight">
        Tomorrow is the Day!
      </Heading>
      
      <Text className="text-black text-[15px] leading-[26px] font-sans">
        Hi {candidateName},
      </Text>
      
      <Text className="text-black text-[15px] leading-[26px] font-sans">
        Your <strong>{eventType}</strong> at <strong>{companyName}</strong> for the <strong>{role}</strong> role is happening tomorrow at <strong>{time}</strong>!
      </Text>

      <Section className="bg-[#f8fafc] rounded-lg p-5 border border-solid border-[#e2e8f0] my-6">
        <Text className="text-black text-[15px] leading-[26px] font-bold font-sans m-0 mb-3">
          Final Checklist:
        </Text>
        <Text className="text-black text-[14px] leading-[24px] font-sans m-0 pl-2">
          • Double check your internet connection and equipment.<br/>
          • Review your resume and any notes you've taken.<br/>
          • Have a glass of water nearby.<br/>
          • Most importantly, get a good night's sleep!
        </Text>
      </Section>
      
      <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
      
      <Text className="text-[#666666] text-[14px] leading-[24px] font-sans">
        Take a deep breath and relax tonight. You have prepared well for this.
      </Text>
    </EmailLayout>
  )
}

export default T1ReminderEmail
