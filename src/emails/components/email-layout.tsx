import { Body, Container, Head, Html, Tailwind, Preview, Section, Text } from "@react-email/components"

export function EmailLayout({ 
  children, 
  previewText = "Message from PlaceTrack"
}: { 
  children: React.ReactNode, 
  previewText?: string 
}) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-[#f0f2f5] my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded-2xl my-[40px] mx-auto p-[30px] w-[465px] bg-white shadow-sm">
            <Section className="mt-[10px]">
              <div className="w-12 h-12 bg-[#2563eb] rounded-xl flex items-center justify-center mx-auto" style={{ boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3)' }}>
                <Text className="text-white font-bold text-2xl m-0 leading-none text-center pt-2">P</Text>
              </div>
            </Section>
            
            <Section className="mt-[20px]">
              {children}
            </Section>
            
            <Section className="mt-[40px] border-t border-solid border-[#eaeaea] pt-[20px]">
              <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
                This email was sent to you by PlaceTrack.
                <br />
                © {new Date().getFullYear()} PlaceTrack, All Rights Reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
