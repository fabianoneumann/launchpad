import { Html, Head, Body, Container, Text, Button, Hr } from '@react-email/components'
import type { VerifyEmailContent } from '@/lib/mail/content/verify-email-content'

interface VerifyEmailProps {
  name: string
  verificationLink: string
  content: VerifyEmailContent
}

export function VerifyEmail({ name, verificationLink, content }: VerifyEmailProps) {
  const greeting = content.greeting.replace('{{name}}', name)

  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', padding: '24px' }}>
        <Container
          style={{
            backgroundColor: '#ffffff',
            padding: '32px',
            borderRadius: '8px',
            maxWidth: '520px',
          }}
        >
          <Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#111' }}>{greeting}</Text>
          <Text style={{ fontSize: '15px', color: '#444' }}>{content.body}</Text>
          <Button
            href={verificationLink}
            style={{
              backgroundColor: '#16a34a',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: 'bold',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            {content.ctaLabel}
          </Button>
          <Text style={{ fontSize: '13px', color: '#999', marginTop: '16px' }}>
            {content.expiry}
          </Text>
          <Hr style={{ borderColor: '#eee', margin: '24px 0' }} />
          <Text style={{ fontSize: '13px', color: '#999' }}>{content.footer}</Text>
        </Container>
      </Body>
    </Html>
  )
}
