import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components"
import * as React from "react"

interface StaleApplicationReminderEmailProps {
  companyName: string
  role: string
  applicationId: string
}

export const StaleApplicationReminderEmail = ({
  companyName = "a company",
  role = "Software Engineer",
  applicationId = "",
}: StaleApplicationReminderEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Any updates on your application at {companyName}?</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Application Update Reminder
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hi there,
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              It's been a week since you applied for the <strong>{role}</strong> position at <strong>{companyName}</strong>. 
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Have you received an online assessment or interview invite? Keeping your application status up to date helps you track your progress and allows us to send you relevant preparation resources!
            </Text>
            
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#2563eb] rounded text-white text-[12px] font-semibold no-underline text-center px-4 py-3"
                href={`https://placetrack.vercel.app/dashboard/applications`}
              >
                Update Application Status
              </Button>
            </Section>

            <Text className="text-black text-[14px] leading-[24px]">
              If you haven't heard back yet, don't worry! Keep preparing and checking your inbox.
            </Text>
            
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This is an automated reminder from PlaceTrack. If you prefer not to receive these reminders, you can manage your email preferences in your dashboard settings.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default StaleApplicationReminderEmail
