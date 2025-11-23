import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface PasswordResetEmailProps {
  resetLink?: string;
}

export const PasswordResetEmail = ({
  resetLink = 'https://example.com',
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={paragraph}>Hi,</Text>
        <Text style={paragraph}>
          Someone recently requested a password change for your Exhibitly account.
          If this was you, you can set a new password here:
        </Text>
        <Button style={button} href={resetLink}>
          Reset password
        </Button>
        <Text style={paragraph}>
          If you don&apos;t want to change your password or you didn&apos;t request
          this, just ignore and delete this message.
        </Text>
        <Text style={paragraph}>
          To keep your account secure, please don&apos;t forward this email to
          anyone.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default PasswordResetEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
};

const button = {
  backgroundColor: '#000000',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
};
