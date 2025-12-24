import { PageShell } from "@/components/layout/PageShell";
import ContactFormNetlify from '@/components/ContactFormNetlify';

export default function ContactPage() {
  return (
    <PageShell>
        
        <main>
            <h1>Contact Us</h1>
         <ContactFormNetlify />
        </main>
    </PageShell>
  );
}