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
} from '@react-email/components';
import * as React from 'react';

interface StaleApplicationReminderEmailProps {
  companyName: string;
  role: string;
  applicationId: string;
}

export const StaleApplicationReminderEmail = ({
  companyName = 'a company',
  role = 'Software Engineer',
  applicationId = '',
}: StaleApplicationReminderEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Any updates on your application at {companyName}?</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Application Update Reminder
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hi there,
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              It's been a week since you applied for the <strong>{role}</strong>{' '}
              position at <strong>{companyName}</strong>.
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Have you received an online assessment or interview invite?
              Keeping your application status up to date helps you track your
              progress and allows us to send you relevant preparation resources!
            </Text>

            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-[#2563eb] px-4 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={`https://place-track-two.vercel.app/dashboard/applications`}
              >
                Update Application Status
              </Button>
            </Section>

            <Text className="text-[14px] leading-[24px] text-black">
              If you haven't heard back yet, don't worry! Keep preparing and
              checking your inbox.
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This is an automated reminder from PlaceTrack. If you prefer not
              to receive these reminders, you can manage your email preferences
              in your dashboard settings.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default StaleApplicationReminderEmail;
