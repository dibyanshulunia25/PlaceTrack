import { Text, Section, Heading } from "@react-email/components"
import { EmailLayout } from "./components/email-layout"
import * as React from "react"

export function NotificationEmail({ 
  subject, 
  message 
}: { 
  subject: string, 
  message: string 
}) {
  return (
    <EmailLayout previewText={subject}>
      <Heading className="text-black text-[20px] font-bold text-center p-0 my-[20px] mx-0 font-sans tracking-tight">
        {subject}
      </Heading>
      
      <Section className="bg-[#f8fafc] rounded-lg p-6 border border-solid border-[#e2e8f0]">
        <Text className="text-black text-[15px] leading-[26px] font-sans whitespace-pre-wrap m-0">
          {message}
        </Text>
      </Section>
    </EmailLayout>
  )
}

export default NotificationEmail
