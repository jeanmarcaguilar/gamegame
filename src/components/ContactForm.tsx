import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaCheckCircle, FaExclamationCircle, FaUser, FaEnvelope, FaRegCommentDots, FaPen, FaShieldAlt } from 'react-icons/fa';
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
      className="relative overflow-hidden rounded-3xl bg-[#09090C] border-t border-white/40 border-l border-r border-b border-white/10 p-6 sm:p-8 lg:p-10 shadow-[0_0_35px_rgba(255,255,255,0.08)]"
    >
      {/* Top right intense glow */}
      <div className="absolute top-0 right-10 w-[35%] h-[2px] bg-white shadow-[0_0_20px_5px_rgba(255,255,255,0.9)]" />
      <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] rounded-full bg-white/10 blur-[60px] pointer-events-none" />

      <div className="relative z-10 grid gap-6 sm:grid-cols-2">
        <Field
          id="name"
          label="Name"
          placeholder="Your full name"
          value={form.name}
          onChange={onChange('name')}
          error={errors.name}
          icon={FaUser}
        />
        <Field
          id="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={form.email}
          onChange={onChange('email')}
          error={errors.email}
          icon={FaEnvelope}
        />
      </div>
      <div className="relative z-10 mt-6">
        <Field
          id="subject"
          label="Subject"
          placeholder="What's this about?"
          value={form.subject}
          onChange={onChange('subject')}
          error={errors.subject}
          icon={FaRegCommentDots}
        />
      </div>
      <div className="relative z-10 mt-6">
        <Field
          id="message"
          label="Message"
          placeholder="Tell me a bit about your project, opportunity, or idea..."
          value={form.message}
          onChange={onChange('message')}
          error={errors.message}
          textarea
          icon={FaPen}
        />
      </div>

      <div className="relative z-10 mt-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-6">
        <p className="flex items-center gap-2 text-xs text-gray-400">
          <FaShieldAlt className="text-white/70" />
          By submitting, you agree to be contacted by email.
        </p>
        <button
          type="submit"
          disabled={status === 'sending'}
          className={cn(
            'group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-black shadow-[0_0_20px_rgba(255,255,255,0.35)] transition-all duration-300',
            'hover:bg-neutral-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] active:scale-[0.98]',
            'disabled:opacity-60 disabled:cursor-not-allowed',
          )}
        >
          {status === 'sending' ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black/70 border-t-transparent" />
          ) : (
            <FaPaperPlane className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          )}
          {status === 'sending' ? 'Sending...' : 'Send message'}
        </button>
      </div>

      {status === 'success' && (
        <p className="relative z-10 mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          <FaCheckCircle /> {statusMessage}
        </p>
      )}
      {status === 'error' && (
        <p className="relative z-10 mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
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
  icon?: any;
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
  icon: Icon,
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
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-white">
        {label}
      </span>
      <div
        className={cn(
          'group relative flex rounded-xl border border-white/10 bg-[#050508] transition-all duration-300 overflow-hidden',
          'focus-within:border-white/50 focus-within:shadow-[0_0_20px_rgba(255,255,255,0.2)] focus-within:bg-[#0c0c10]',
          error && 'border-red-500/40 focus-within:border-red-500/60',
        )}
      >
        {Icon && (
          <div className="flex shrink-0 w-12 items-start justify-center pt-4 text-white/50 group-focus-within:text-white transition-colors">
            <Icon className="h-4 w-4" />
          </div>
        )}
        {textarea ? (
          <textarea
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            rows={5}
            className={cn("block w-full resize-none bg-transparent py-3.5 pr-4 text-[13px] text-white outline-none placeholder:text-gray-600", !Icon && "pl-4")}
          />
        ) : (
          <input
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            type={type}
            className={cn("block h-12 w-full bg-transparent pr-4 text-[13px] text-white outline-none placeholder:text-gray-600", !Icon && "pl-4")}
          />
        )}
      </div>
      {error && (
        <span id={`${id}-error`} className="mt-1.5 inline-block text-[11px] font-medium text-red-400">
          {error}
        </span>
      )}
    </label>
  );
}
