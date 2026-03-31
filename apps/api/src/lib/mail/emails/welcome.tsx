import { Html, Head, Body, Container, Text, Hr } from '@react-email/components'
import type { WelcomeEmailContent } from '@/lib/mail/content/welcome-content'

interface WelcomeEmailProps {
  name: string
  content: WelcomeEmailContent
}

export function WelcomeEmail({ name, content }: WelcomeEmailProps) {
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
          <Hr style={{ borderColor: '#eee', margin: '24px 0' }} />
          <Text style={{ fontSize: '13px', color: '#999' }}>{content.footer}</Text>
        </Container>
      </Body>
    </Html>
  )
}
