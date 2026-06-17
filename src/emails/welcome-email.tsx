import { Text, Button, Section, Heading, Hr } from '@react-email/components';
import { EmailLayout } from './components/email-layout';
import * as React from 'react';

export function WelcomeEmail({ name }: { name: string }) {
  return (
    <EmailLayout previewText={`Welcome to PlaceTrack, ${name}!`}>
      <Heading className="mx-0 my-[30px] p-0 text-center font-sans text-[24px] font-normal tracking-tight text-black">
        Welcome to <strong>PlaceTrack</strong>
      </Heading>

      <Text className="font-sans text-[15px] leading-[26px] text-black">
        Hi {name},
      </Text>

      <Text className="font-sans text-[15px] leading-[26px] text-black">
        We're thrilled to have you join our community! PlaceTrack helps you
        track applications, discover community interview experiences, and
        prepare for your next big role.
      </Text>

      <Section className="mt-[32px] mb-[32px] text-center">
        <Button
          className="rounded-lg border-b-[3px] border-[#1d4ed8] bg-[#2563eb] px-6 py-3 text-center text-[14px] font-semibold text-white no-underline shadow-md"
          href="https://place-track-two.vercel.app/dashboard"
        >
          Go to Dashboard
        </Button>
      </Section>

      <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

      <Text className="font-sans text-[14px] leading-[24px] text-[#666666]">
        If you have any questions, feel free to explore our public repository of
        experiences.
      </Text>
    </EmailLayout>
  );
}

export default WelcomeEmail;
