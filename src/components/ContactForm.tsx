import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { sendContactEmail } from '@/utils/sendEmail';
import { cn } from '@/utils/cn';

interface FieldErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

interface ContactFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initial: ContactFormState = { name: '', email: '', subject: '', message: '' };

export function ContactForm() {
  const [form, setForm] = useState<ContactFormState>(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const validate = (data: ContactFormState): FieldErrors => {
    const next: FieldErrors = {};
    if (!data.name.trim()) next.name = 'Please enter your name.';
    if (!data.email.trim()) {
      next.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      next.email = 'Please enter a valid email address.';
    }
    if (!data.subject.trim()) next.subject = 'Please add a subject.';
    if (!data.message.trim() || data.message.trim().length < 10) {
      next.message = 'Please write a message (at least 10 characters).';
    }
    return next;
  };

  const onChange = (key: keyof ContactFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
      if (errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: undefined }));
      }
    };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = validate(form);
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    setStatus('sending');
    setStatusMessage('');
    const res = await sendContactEmail(form);
    if (res.ok) {
      setStatus('success');
      setStatusMessage("Thanks — your message is on its way. I'll reply soon.");
      setForm(initial);
    } else {
      setStatus('error');
      setStatusMessage(res.error ?? 'Something went wrong. Please try again.');
    }
  };

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      noValidate
      className="relative overflow-hidden rounded-3xl glass p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="name"
          label="Name"
          placeholder="Your full name"
          value={form.name}
          onChange={onChange('name')}
          error={errors.name}
        />
        <Field
          id="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={form.email}
          onChange={onChange('email')}
          error={errors.email}
        />
      </div>
      <div className="mt-5">
        <Field
          id="subject"
          label="Subject"
          placeholder="What's this about?"
          value={form.subject}
          onChange={onChange('subject')}
          error={errors.subject}
        />
      </div>
      <div className="mt-5">
        <Field
          id="message"
          label="Message"
          placeholder="Tell me a bit about your project, opportunity, or idea..."
          value={form.message}
          onChange={onChange('message')}
          error={errors.message}
          textarea
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-text-muted">
          By submitting, you agree to be contacted by email.
        </p>
        <button
          type="submit"
          disabled={status === 'sending'}
          className={cn(
            'group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-fg shadow-soft transition-all duration-300',
            'hover:bg-primary-accent hover:shadow-glow active:scale-[0.98]',
            'disabled:opacity-60',
          )}
        >
          {status === 'sending' ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current/70 border-t-transparent" />
          ) : (
            <FaPaperPlane className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          )}
          {status === 'sending' ? 'Sending...' : 'Send message'}
        </button>
      </div>

      {status === 'success' && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs text-success">
          <FaCheckCircle /> {statusMessage}
        </p>
      )}
      {status === 'error' && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-400">
          <FaExclamationCircle /> {statusMessage}
        </p>
      )}
    </motion.form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  textarea?: boolean;
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  textarea,
}: FieldProps) {
  const props = {
    id,
    name: id,
    value,
    onChange,
    placeholder,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${id}-error` : undefined,
  };

  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-text-muted">
        {label}
      </span>
      <div
        className={cn(
          'group relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-glass-soft)] transition-all duration-300',
          'focus-within:border-primary/50 focus-within:shadow-glow',
          error && 'border-red-500/40 focus-within:border-red-500/60',
        )}
      >
        {textarea ? (
          <textarea
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            rows={6}
            className="block w-full resize-none rounded-2xl bg-transparent px-4 py-3 text-sm text-text outline-none placeholder:text-text-muted/60"
          />
        ) : (
          <input
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            type={type}
            className="block h-12 w-full rounded-2xl bg-transparent px-4 text-sm text-text outline-none placeholder:text-text-muted/60"
          />
        )}
      </div>
      {error && (
        <span id={`${id}-error`} className="mt-1.5 inline-block text-xs text-red-400">
          {error}
        </span>
      )}
    </label>
  );
}
